import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native'
import Video from 'react-native-video'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { styles } from './SavedStyles'
import { useNavigation } from '@react-navigation/native'

export default function SavedScreen() {
  const [videos, setVideos] = useState<string[]>([])
  const navigation = useNavigation()

  useEffect(() => {
    const load = async () => {
      if (Platform.OS === 'android') {
        const sdkVersion = Platform.constants?.Release || '0'
        let granted
        if (parseInt(sdkVersion, 10) >= 13) {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          )
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          )
        }
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return
        }
      }

      const result = await CameraRoll.getPhotos({
        first: 50,
        assetType: 'Videos',
      })
      const uris = result.edges.map(edge => edge.node.image.uri)
      setVideos(uris)
    }

    load()
  }, [])

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.videoContainer}>
      <Video source={{ uri: item }} style={styles.video} controls resizeMode="cover" />
    </View>
  )

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <Text style={styles.emptyText}>保存された動画がありません</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderItem}
        />
      )}
      TouchableOpacity
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
    </View>
  )
}

