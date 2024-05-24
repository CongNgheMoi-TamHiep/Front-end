/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'chat.zalo.me',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'designs.vn',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'khanh2608-bucket01.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/**'
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, './'),
        };
        return config;
    },
    reactStrictMode: false,
}

module.exports = nextConfig
