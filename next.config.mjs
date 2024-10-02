/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{hostname:'dummyimage.com'}]
    },
    reactStrictMode: false,
};

export default nextConfig;
