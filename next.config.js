/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'streetspot.s3.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
