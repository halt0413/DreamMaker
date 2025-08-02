import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import Share from 'react-native-share'
import Video from 'react-native-video'
import { styles } from './MovieStyles'
import CalendarModal from './CalenderModal'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../navigation/types'

type MovieScreenRouteProp = RouteProp<RootStackParamList, 'Movie'>

export default function MovieScreen() {
  const route = useRoute<MovieScreenRouteProp>()
  const { videoUrl } = route.params
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isCalendarVisible, setCalendarVisible] = useState<boolean>(false)

  const handleShare = async () => {
    if (!selectedDate || !videoUrl) return
    try {
      await Share.open({
        message: `選択した日付: ${selectedDate}\n動画: ${videoUrl}`,
        url: videoUrl,
      })
    } catch (error) {
      console.log('Share error:', error)
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
          style={[styles.button, !selectedDate && styles.touchableopacity]}
          onPress={() => selectedDate && console.log('保存:', selectedDate)}
          disabled={!selectedDate}
        >
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !selectedDate && styles.touchableopacity]}
          onPress={handleShare}
          disabled={!selectedDate}
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
