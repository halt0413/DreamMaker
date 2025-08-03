import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff9c4',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 80,  
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    width: 130,   
    height: 130,
    marginRight: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a3f35',
    letterSpacing: 0.5,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -180 }], 
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
})
