import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9c4', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloud: {
    position: 'absolute',
    width: 300,
    height: 250,
    opacity: 0.6,
    resizeMode: 'contain',
    top: 10, 
    left: -50,
  },
  cloud1: {
    position: 'absolute',
    width: 300,
    height: 250,
    opacity: 0.6,
    resizeMode: 'contain',
    top: 100, 
    right: -60,
  },
  cloud2: {
    position: 'absolute',
    width: 300,
    height: 250,
    opacity: 0.6,
    resizeMode: 'contain',
    bottom: 50, 
    left: 10,
  },
  overlay: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6b4f1d',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    paddingHorizontal: 75,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  savedbutton: {
    marginTop: 20,
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  Mypagebutton: {
    marginTop: 20,
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 25,
  }
})
