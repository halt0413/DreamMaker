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
      console.log('[GalleryScreen] 初期化開始');

      try {
        if (Platform.OS === 'android') {
          console.log('[GalleryScreen] Android権限リクエスト中');
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('[GalleryScreen] 権限が拒否されました');
            setLoading(false);
            return;
          }
          console.log('[GalleryScreen] 権限が許可されました');
        }

        console.log('[GalleryScreen] 写真を取得中...');
        const result = await CameraRoll.getPhotos({
          first: 100,
          assetType: 'Photos',
        });

        const uris = result.edges.map(edge => edge.node.image.uri);
        const randomUris = uris.sort(() => Math.random() - 0.5).slice(0, 2);
        console.log(
          `[GalleryScreen] ${uris.length}枚の写真から2枚を選択:`,
          randomUris,
        );

        console.log('[GalleryScreen] 画像の説明を生成中...');
        const descriptions = await Promise.all(
          randomUris.map(uri => getImageDescription(uri)),
        );
        console.log('[GalleryScreen] 画像説明完了:', descriptions);

        console.log('[GalleryScreen] Gen-3プロンプトを生成中...');
        const prompt = await generateGen3Prompt(
          descriptions[0],
          descriptions[1],
        );
        console.log('[GalleryScreen] プロンプト生成完了:', prompt);

        console.log('[GalleryScreen] Runwayで動画生成開始...');
        const videoUrl = await generateRunwayVideo(
          randomUris[0],
          randomUris[1],
          prompt,
        );
        console.log('[GalleryScreen] 動画生成完了:', videoUrl);

        console.log('[GalleryScreen] Movieスクリーンに遷移');
        navigation.navigate('Movie', { videoUrl });
      } catch (err) {
        console.error('[GalleryScreen] エラーが発生しました:', err);
      } finally {
        console.log('[GalleryScreen] 処理完了、ローディング終了');
        setLoading(false);
      }
    };

    init();
  }, [navigation]);

  return (
    <View style={styles.loadingContainer}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#f1c40f" />
          <Text style={styles.loadingText}>夢を作成中....</Text>
        </>
      ) : null}
    </View>
  );
}

const getImageDescription = async (uri: string): Promise<string> => {
  console.log('[getImageDescription] 画像の説明生成開始:', uri);

  try {
    const base64 = await getBase64(uri);
    console.log('[getImageDescription] Base64変換完了');

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

    if (!response.ok) {
      throw new Error(
        `OpenAI APIエラー: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const description = data.choices[0].message.content || '';
    console.log('[getImageDescription] 説明生成完了:', description);

    return description;
  } catch (error) {
    console.error('[getImageDescription] エラー:', error);
    throw error;
  }
};

const generateGen3Prompt = async (
  desc1: string,
  desc2: string,
): Promise<string> => {
  console.log('[generateGen3Prompt] プロンプト生成開始');
  console.log('[generateGen3Prompt] 画像1:', desc1);
  console.log('[generateGen3Prompt] 画像2:', desc2);

  const promptRequest = `
  You are a Gen-3 prompt generator.
  Generate a surreal but photorealistic video prompt under 900 characters.
  The transformation must start at a small visible point in Image 1 and gradually morph into Image 2 by transforming textures, shapes, or objects in stages.
  Describe at least two intermediate changes between the start and the final state.
  Avoid scene cuts or sudden jumps. Use vivid visual verbs like melt, ripple, shift, twist, blur, reshape.
  Image 1: ${desc1}
  Image 2: ${desc2}`;

  try {
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

    if (!response.ok) {
      throw new Error(
        `OpenAI APIエラー: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const prompt = data.choices[0].message.content || '';
    console.log('[generateGen3Prompt] プロンプト生成完了:', prompt);

    return prompt;
  } catch (error) {
    console.error('[generateGen3Prompt] エラー:', error);
    throw error;
  }
};

const generateRunwayVideo = async (
  uri1: string,
  uri2: string,
  prompt: string,
): Promise<string> => {
  console.log('[generateRunwayVideo] 動画生成開始');
  console.log('[generateRunwayVideo] プロンプト:', prompt);

  try {
    console.log('[generateRunwayVideo] 画像リサイズ中...');
    const resizedUri1 = await resizeImage(uri1);
    const resizedUri2 = await resizeImage(uri2);
    console.log('[generateRunwayVideo] リサイズ完了');

    console.log('[generateRunwayVideo] Base64変換中...');
    const base64_1 = await getBase64(resizedUri1);
    const base64_2 = await getBase64(resizedUri2);
    console.log('[generateRunwayVideo] Base64変換完了');

    console.log('[generateRunwayVideo] Runwayタスク作成中...');
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
    console.log('[generateRunwayVideo] タスク作成完了, ID:', task.id);

    // タスクの完了を待つ
    console.log('[generateRunwayVideo] タスク完了を待機中...');
    let result = await runway.tasks.retrieve(task.id);
    let pollCount = 0;

    while (result.status === 'PENDING' || result.status === 'RUNNING') {
      pollCount++;
      console.log(
        `[generateRunwayVideo] ポーリング ${pollCount}回目 - ステータス: ${result.status}`,
      );
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒待機
      result = await runway.tasks.retrieve(task.id);
    }

    if (result.status === 'SUCCEEDED' && result.output) {
      console.log('[generateRunwayVideo] 動画生成成功:', result.output[0]);
      return result.output[0];
    } else {
      console.error('[generateRunwayVideo] 動画生成失敗:', result.status);
      throw new Error(`Video generation failed: ${result.status}`);
    }
  } catch (error) {
    console.error('[generateRunwayVideo] エラー:', error);
    throw error;
  }
};

const getBase64 = (uri: string): Promise<string> =>
  new Promise((resolve, reject) => {
    console.log('[getBase64] Base64変換開始:', uri);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        console.log('[getBase64] Base64変換完了');
        resolve(base64);
      };
      reader.onerror = error => {
        console.error('[getBase64] FileReader エラー:', error);
        reject(error);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = error => {
      console.error('[getBase64] XMLHttpRequest エラー:', error);
      reject(error);
    };
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });

const resizeImage = async (uri: string): Promise<string> => {
  console.log('[resizeImage] 画像リサイズ開始:', uri);

  try {
    const resized = await ImageResizer.createResizedImage(
      uri,
      768, // width
      1280, // height
      'JPEG',
      100,
      0,
      undefined,
      false,
      { mode: 'cover' },
    );

    console.log('[resizeImage] リサイズ完了:', resized.uri);
    return resized.uri;
  } catch (error) {
    console.error('[resizeImage] エラー:', error);
    throw error;
  }
};
