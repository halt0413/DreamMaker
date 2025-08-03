import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9c4',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  videoContainer: {
    marginBottom: 20,
    alignItems: 'center', 
  },
  video: {
    width: screenWidth * 0.9, 
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#6b4f1d',
    fontSize: 16,
  },
})
