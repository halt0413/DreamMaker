import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './GalleryStyles';
import { RunwayML } from '@runwayml/sdk';
import ImageResizer from 'react-native-image-resizer';

import { OPENAI_API_KEY, RUNWAY_API_KEY } from '@env';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;

const runway = new RunwayML({
  apiKey: RUNWAY_API_KEY,
});

export default function GalleryScreen() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setLoading(false);
            return;
          }
        }

        const result = await CameraRoll.getPhotos({
          first: 100,
          assetType: 'Photos',
        });

        const uris = result.edges.map(edge => edge.node.image.uri);
        const randomUris = uris.sort(() => Math.random() - 0.5).slice(0, 2);

        const descriptions = await Promise.all(
          randomUris.map(uri => getImageDescription(uri)),
        );

        const prompt = await generateGen3Prompt(
          descriptions[0],
          descriptions[1],
        );

        const videoUrl = await generateRunwayVideo(
          randomUris[0],
          randomUris[1],
          prompt,
        );

        navigation.navigate('Movie', { videoUrl });
      } catch (err) {
        console.warn('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigation]);

  return (
    <View style={styles.loadingContainer}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>動画を生成しています...</Text>
        </>
      ) : null}
    </View>
  );
}

const getImageDescription = async (uri: string): Promise<string> => {
  const base64 = await getBase64(uri);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please describe the contents of this image in one or two short, objective sentences.
              Focus on visually important elements such as the main objects, materials, their positions, colors, and context.
              Avoid emotional tone, metaphors, or interpretation.
              This description will be used to generate a prompt for an AI video model that gradually transforms this image into another.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content || '';
};

const generateGen3Prompt = async (
  desc1: string,
  desc2: string,
): Promise<string> => {
  const promptRequest = `
  You are a Gen-3 prompt generator.
  Generate a surreal but photorealistic video prompt under 900 characters.
  The transformation must start at a small visible point in Image 1, then gradually change into Image 2 by morphing visible elements.
  Avoid scene cuts or sudden jumps. Use vivid visual verbs like melt, ripple, shift, twist, blur, reshape.
  Image 1: ${desc1}
  Image 2: ${desc2}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptRequest }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content || '';
};

const generateRunwayVideo = async (
  uri1: string,
  uri2: string,
  prompt: string,
): Promise<string> => {
  const resizedUri1 = await resizeImage(uri1);
  const resizedUri2 = await resizeImage(uri2);

  const base64_1 = await getBase64(resizedUri1);
  const base64_2 = await getBase64(resizedUri2);

  const task = await runway.imageToVideo.create({
    model: 'gen3a_turbo',
    promptImage: [
      {
        uri: `data:image/jpeg;base64,${base64_1}`,
        position: 'first',
      },
      {
        uri: `data:image/jpeg;base64,${base64_2}`,
        position: 'last',
      },
    ],
    promptText: prompt,
    ratio: '768:1280',
    duration: 10,
  });

  // タスクの完了を待つ
  let result = await runway.tasks.retrieve(task.id);
  while (result.status === 'PENDING' || result.status === 'RUNNING') {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒待機
    result = await runway.tasks.retrieve(task.id);
  }

  if (result.status === 'SUCCEEDED' && result.output) {
    return result.output[0];
  } else {
    throw new Error(`Video generation failed: ${result.status}`);
  }
};

const getBase64 = (uri: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });


const resizeImage = async (uri: string): Promise<string> => {
  const resized = await ImageResizer.createResizedImage(
    uri,
    768, // width
    1280, // height
    'JPEG',
    100,
    0,
    undefined,
    false,
    { mode: 'cover' } // ← aspect ratioを保ちながらcrop
  );

  return resized.uri;
};
