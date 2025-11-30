const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    '@assets': path.resolve(projectRoot, 'assets'),
};

config.watchFolders = [
    path.resolve(projectRoot, 'assets'),
];
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');
module.exports = config;