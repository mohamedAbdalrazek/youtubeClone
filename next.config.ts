import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },

};

export default nextConfig;
