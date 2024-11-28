/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`
    ],
  },
  experimental: {
    serverActions: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig