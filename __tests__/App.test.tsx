/**
 * @format
 */

import React from 'react'
import ReactTestRenderer from 'react-test-renderer'

jest.mock('@react-native-camera-roll/camera-roll', () => ({
  CameraRoll: {
    getPhotos: jest.fn(() => Promise.resolve({ edges: [] })),
    save: jest.fn(),
  },
}))

jest.mock('react-native-video', () => 'Video')

jest.mock('@runwayml/sdk', () => ({
  RunwayML: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('react-native-share', () => ({
  default: {
    open: jest.fn(),
  },
}))

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '',
  downloadFile: jest.fn(() => ({ promise: Promise.resolve({ statusCode: 200 }) })),
}))

import App from '../src/App'

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
