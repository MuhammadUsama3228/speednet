/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@maxmind/geoip2-node'],
    outputFileTracingIncludes: {
      '/api/ip-info': ['./GeoLite2-City.mmdb'],
    },
  },
  images: {
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://scanpings.net https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://ipapi.co https://ipwho.is https://cloudflare.com https://*.cloudflare.com https://*.cloudflaretest.com https://www.google-analytics.com; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
