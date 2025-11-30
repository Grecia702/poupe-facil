import 'dotenv/config';

export default () => ({
    expo: {
        name: 'poupefacil',
        slug: 'poupefacil',
        version: '1.0.0',
        orientation: 'portrait',
        extra: {
            API_URL: process.env.API_URL || "http://192.168.100.211:3000/api",
            eas: {
                projectId: process.env.PROJECT_ID,
            },
        },
        android: {
            package: 'com.anonymous.poupefacilapp',
        },
        assetBundlePatterns: [
            '**/*',
            '!backend/**/*',
        ],
    },

});
