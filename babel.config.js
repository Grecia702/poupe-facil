module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            ['module-resolver', {
                root: ['./'],
                alias: {
                    '@context': './src/context',
                    '@components': './src/components',
                    '@utils': './src/utils',
                    '@hooks': './src/hooks',
                    '@screens': './src/screens',
                    '@assets': './assets',
                },
            }],
        ]
    };
};
