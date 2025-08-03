import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { styles } from './MypageStyles'

export default function MypageScreen() {
  const navigation = useNavigation()

  const items = [
    { icon: require('../../assets/images/animal_lover.png'), label: '動物好きプロフィール' },
    { icon: require('../../assets/images/city_wanderer.png'), label: '街を旅する人の記録' },
    { icon: require('../../assets/images/fist_creation.png'), label: '創造する力' },
    { icon: require('../../assets/images/frequent_creator.png'), label: '常連クリエイター' },
    { icon: require('../../assets/images/gourmet_explorer.png'), label: 'グルメ探検家' },
    { icon: require('../../assets/images/human_storyteller.png'), label: '物語を紡ぐ人' },
    { icon: require('../../assets/images/memory_keeper.png'), label: '思い出を残す人' },
    { icon: require('../../assets/images/monochrome_vision.png'), label: 'モノクロ視点' },
    { icon: require('../../assets/images/morning_creater.png'), label: '朝のクリエイター' },
    { icon: require('../../assets/images/nature_collector.png'), label: '自然コレクター' },
    { icon: require('../../assets/images/neon_enthusiast.png'), label: 'ネオン愛好家' },
    { icon: require('../../assets/images/nighttime_artist.png'), label: '夜のアーティスト' },
    { icon: require('../../assets/images/save_master.png'), label: '保存の達人' },
    { icon: require('../../assets/images/shared_with_love.png'), label: '愛を込めて共有' },
  ]

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
    </View>
  )
}
