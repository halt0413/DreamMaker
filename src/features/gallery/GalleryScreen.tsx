import React, { useEffect, useState } from 'react'
import {
  PermissionsAndroid,
  Platform,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { styles } from './GalleryStyles'
import { RootStackParamList } from '../../navigation/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<string[]>([])
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        )
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission not granted')
          return
        }
      }

      const result = await CameraRoll.getPhotos({
        first: 100,
        assetType: 'Photos',
      })

      const randomUris = result.edges
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(p => p.node.image.uri)

      setPhotos(randomUris)
    })()
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      {photos.length === 0 ? (
        <Text style={styles.loadingText}>写真を読み込み中...</Text>
      ) : (
        photos.map(uri => (
          <Image
            key={uri}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))
      )}

      <View style={styles.view}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Movie')}
          style={styles.touchableopacity} 
        >
          <Text style={styles.text}>次へ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
