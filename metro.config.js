const {getDefaultConfig} = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

config.resolver.sourceExts.push('sql'); // <--- add this

module.exports = wrapWithReanimatedMetroConfig(config);
