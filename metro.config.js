const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add TypeScript support and additional extensions
config.resolver.sourceExts.push('ts', 'tsx', 'mjs', 'cjs');

// Explicitly set the Babel transformer
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

module.exports = config;