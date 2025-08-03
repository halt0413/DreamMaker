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

  const handleViewSaved = () => {
    navigation.navigate('Saved')
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud]} />
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud1]} />
      <Image source={require('../../assets/images/kumo.png')} style={[styles.cloud2]} />

      <View style={styles.overlay}>
        <Text style={styles.title}>DreamMaker</Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>はじめる</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={handleViewSaved}
        >
          <Text style={styles.buttonText}>保存した動画を見る</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
