/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    unoptimized: false,
  },
  // Remove output: 'standalone' for Vercel deployment
  // output: 'standalone',
}

export default nextConfig
