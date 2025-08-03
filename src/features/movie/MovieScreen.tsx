import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native'
import Share from 'react-native-share'
import Video from 'react-native-video'
import { styles } from './MovieStyles'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../navigation/types'
import RNFS from 'react-native-fs'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

type MovieScreenRouteProp = RouteProp<RootStackParamList, 'Movie'>

export default function MovieScreen() {
  const route = useRoute<MovieScreenRouteProp>()
  const { videoUrl } = route.params

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const sdkVersion = Platform.constants?.Release || '0'

      if (parseInt(sdkVersion, 10) >= 13) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      }
    }
    return true
  }

  const handleSave = async () => {
    if (!videoUrl) return

    const hasPermission = await requestPermission()
    if (!hasPermission) {
      Alert.alert('エラー', '保存のための権限がありません。設定から許可してください。')
      return
    }

    const fileName = `video_${Date.now()}.mp4`
    const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`

    try {
      const result = await RNFS.downloadFile({
        fromUrl: videoUrl,
        toFile: tempPath,
      }).promise

      if (result.statusCode === 200) {
        await CameraRoll.save(tempPath, { type: 'video' })
        Alert.alert('保存完了', '動画を写真フォルダに保存しました。')
      } else {
        Alert.alert('保存失敗', '動画の保存に失敗しました。')
      }
    } catch (error) {
      console.log('保存エラー:', error)
      Alert.alert('エラー', '保存中にエラーが発生しました。')
    }
  }

  const handleShare = async () => {
    if (!videoUrl) return

    const tempPath = `${RNFS.CachesDirectoryPath}/shared_video.mp4`

    try {
      const result = await RNFS.downloadFile({
        fromUrl: videoUrl,
        toFile: tempPath,
      }).promise

      if (result.statusCode === 200) {
        await Share.open({
          url: `file://${tempPath}`,
          type: 'video/mp4',
        })
      } else {
        Alert.alert('エラー', '動画のダウンロードに失敗しました。')
      }
    } catch (error) {
      console.log('Share error:', error)
      Alert.alert('共有エラー', '共有中にエラーが発生しました。')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>動画のプレビュー</Text>

        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat
          muted
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>保存</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>共有</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
