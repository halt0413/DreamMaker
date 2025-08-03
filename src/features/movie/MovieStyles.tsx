import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff9c4',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  video: {
    aspectRatio: 10 / 16,
    width: width - 20,
    height: 550,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  homeButton: {
    alignSelf: 'center',
    marginBottom: 40,
  },
})
