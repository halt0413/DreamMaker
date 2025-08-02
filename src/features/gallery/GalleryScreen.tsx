import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './GalleryStyles';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;

export default function GalleryScreen() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission not granted');
          setLoading(false);
          return;
        }
      }

      try {
        await CameraRoll.getPhotos({
          first: 100,
          assetType: 'Photos',
        });

        //  const randomUris = result.edges
        //   .sort(() => Math.random() - 0.5)
        //   .slice(0, 10)
        //   .map(p => p.node.image.uri)
        
        navigation.navigate('Movie');

      } catch (error) {
        console.warn('Failed to load photos:', error);
        setLoading(false);
      }
    })();
  }, [navigation]);

  return (
    <View style={styles.loadingContainer}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>写真を読み込み中...</Text>
        </>
      ) : null}
    </View>
  );
}