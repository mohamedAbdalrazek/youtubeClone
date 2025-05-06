import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
            },
            {
                protocol: 'https',
                hostname: 'i9.ytimg.com',
            },

            {
                protocol: 'https',
                hostname: "lh3.googleusercontent.com",
                port: '',
                pathname: '/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: "fakeimg.pl",
                port: '',
                pathname: '/**',
                search: '',
            }
        ],
    }
};

export default nextConfig;
