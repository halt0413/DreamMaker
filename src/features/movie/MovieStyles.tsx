import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff9c4',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  video: {
    width: width - 40,
    height: 200,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  touchableopacity: {
    opacity: 0.5,
  }
})
