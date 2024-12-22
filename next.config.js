/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false 
  },
  // Remove export configuration to enable dynamic routes and API
}

module.exports = nextConfig;
