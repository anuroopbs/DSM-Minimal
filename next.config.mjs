
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to enable middleware
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
}

export default nextConfig
