import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import Share from 'react-native-share'
import Video from 'react-native-video'
import { styles } from './MovieStyles'
import CalendarModal from './CalenderModal'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../navigation/types'
import RNFS from 'react-native-fs'

type MovieScreenRouteProp = RouteProp<RootStackParamList, 'Movie'>

export default function MovieScreen() {
  const route = useRoute<MovieScreenRouteProp>()
  const { videoUrl } = route.params
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isCalendarVisible, setCalendarVisible] = useState<boolean>(false)

   const handleSave = async () => {
    if (!videoUrl) return

    const fileName = `video_${Date.now()}.mp4`
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`

    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: videoUrl,
        toFile: destPath,
      }).promise

      if (downloadResult.statusCode === 200) {
        Alert.alert('保存完了', `保存しました:\n${destPath}`)
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
    <View style={styles.container}>
      <Text style={styles.title}>
        選択した日付: {selectedDate || '未選択'}
      </Text>

      <TouchableOpacity
        style={styles.calemderbutton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.buttonText}>カレンダーを開く</Text>
      </TouchableOpacity>

      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button]}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>共有</Text>
        </TouchableOpacity>
      </View>

      <CalendarModal
        isVisible={isCalendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={setSelectedDate}
      />
    </View>
  )
}
