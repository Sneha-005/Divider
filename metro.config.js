const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  maxWorkers: 2,
  resetCache: false,
  resolver: {
    extraNodeModules: {
      '@data': path.resolve(__dirname, 'src/data/'),
      '@domain': path.resolve(__dirname, 'src/domain/'),
      '@presentation': path.resolve(__dirname, 'src/presentation/'),
      '@shared': path.resolve(__dirname, 'src/shared/'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
