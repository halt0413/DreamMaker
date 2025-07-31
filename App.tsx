import React, { useEffect, useState } from 'react'
import {
  PermissionsAndroid,
  Platform,
  Image,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'

export default function App() {
  const [photos, setPhotos] = useState<string[]>([])

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
    <ScrollView>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingText: {
    margin: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 5,
  },
})

