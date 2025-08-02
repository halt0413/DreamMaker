import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/types'
import { styles } from './HomeStyles'

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>()

  const handleStart = () => {
    navigation.navigate('Gallery')
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud, { top: 10, left: -50 }]} />
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud, { top: 100, right: -60 }]} />
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud, { bottom: 50, left: 10 }]} />

      <View style={styles.overlay}>
        <Text style={styles.title}>DreamMaker</Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>はじめる</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
