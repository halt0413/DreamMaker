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

export default function MovieScreen() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isCalendarVisible, setCalendarVisible] = useState<boolean>(false)

  const handleShare = async () => {
    if (!selectedDate) return
    try {
      await Share.open({
        message: `選択した日付: ${selectedDate}`,
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
        style={styles.button}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.buttonText}>カレンダーを開く</Text>
      </TouchableOpacity>

      <Video
        source={{ uri: '' }}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedDate && { opacity: 0.5 }]}
          onPress={() => selectedDate && console.log('保存:', selectedDate)}
          disabled={!selectedDate}
        >
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !selectedDate && { opacity: 0.5 }]}
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
