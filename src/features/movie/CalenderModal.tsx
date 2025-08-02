import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars'
import { styles } from './MovieStyles'

type Props = {
  isVisible: boolean
  onClose: () => void
  onSelectDate: (date: string) => void
}

export default function CalendarModal({ isVisible, onClose, onSelectDate }: Props) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>日付を選んでください</Text>
        <Calendar
          onDayPress={day => {
            onSelectDate(day.dateString)
            onClose()
          }}
          markedDates={{
            [new Date().toISOString().split('T')[0]]: {
              selected: true,
              selectedColor: '#f1c40f',
            },
          }}
        />
      </View>
    </Modal>
  )
}
