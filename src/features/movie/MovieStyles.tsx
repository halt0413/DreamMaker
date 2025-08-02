import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
  calemderbutton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal:10,
    borderRadius: 8,
  },
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
    width: -50,
  },
  touchableopacity: {
    opacity: 0.5,
  }
})
