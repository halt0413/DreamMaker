module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-video|@react-native-camera-roll|react-native-image-resizer)/)',
  ],
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/env.ts',
  },
}
