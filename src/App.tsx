import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './features/home/HomeScreen'
import GalleryScreen from './features/gallery/GalleryScreen'
import { RootStackParamList } from './navigation/types'
import { NavigationContainer } from '@react-navigation/native'
import  MovieScreen  from './features/movie/MovieScreen'
import SavedScreen from './features/saved/SavedScreen'
import MypageScreen from './features/mypage/MypageScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name='Mypage' component={MypageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
