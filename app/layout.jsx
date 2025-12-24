import './globals.css'

import { Toaster } from 'react-hot-toast'
import ClientProviders from './components/ClientProviders'
import Navbar from './components/Navbar'
import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - Free Online Internet Speed Test | Fast & Accurate Results`,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing',
  description: `Test your internet speed with ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - the fastest, most accurate online speed test. Measure download, upload speeds, ping, jitter, and detect your IP address and location.`,
  keywords: [
    // Core high-volume keywords (highest search intent & volume, e.g., "speed test" ~9-10M monthly global)
    'speed test',
    'internet speed test',
    'online speed test',
    'free speed test',
    'test my internet speed',
    'check internet speed',
    'broadband speed test',
    'wifi speed test',
    'download speed test',
    'upload speed test',
    'check my ip',
    'what is my ip',
    'ip address location',

    // Brand & unique strengths (your differentiators)
    'scanping',
    'cloudflare speed test',
    'accurate speed test',
    'best internet speed test',
    'location speed test',

    // Competitor/alternative terms (capture users seeking options)
    'speedtest.net alternative',
    'fast.com alternative',
    'ookla speedtest alternative',
    'speedtest net alternative',
    'fast com speed test',

    // Technical/diagnostic terms (your existing + refined)
    'ping test',
    'jitter test',
    'packet loss test',
    'latency test',
    'bandwidth test',
    'network speed test',
    'internet speed checker',
    'mbps test',
    'ip lookup',
    'geoip test',

    // Long-tail & user-intent phrases (lower competition, high conversion)
    'what is my internet speed',
    'test internet speed',
    'measure internet speed',
    'connection speed test',
    'internet speed meter',
    'broadband test',
    'network diagnostics',
    'librespeed speed test',
    'real time speed test',
    'mobile internet speed test',
    'fastest speed test',
    'internet quality test',
    'stability test'
  ],
  authors: [{ name: `${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} Team` }],
  creator: process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing',
  publisher: process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://scanpings.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - Free Online Internet Speed Test`,
    description: `Test your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}. Get accurate download, upload, ping, and jitter measurements. Fast, reliable, and free.`,
    url: 'https://scanpings.net',
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} Internet Speed Test`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - Accurate Speed Test`,
    description: 'Test your internet speed with our free, accurate, and easy-to-use tool. Fast.com alternative powered by Cloudflare.',
    images: ['https://scanpings.net/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/web-app-manifest-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg', // Browsers often use SVG for pinned tabs
        color: '#1e40af' // Matches theme-color
      }
    ]
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": appName,
    "description": `Free online internet speed test tool that measures download speed, upload speed, ping, and jitter`,
    "url": "https://scanpings.net",
    "applicationCategory": "Utility",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Download Speed Test",
      "Upload Speed Test",
      "Ping Test",
      "Jitter Measurement",
      "IP Detection",
      "Location Lookup",
      "Real-time Results",
      "Detailed Analytics",
      "Mobile Friendly",
      "No Registration Required"
    ],
    "screenshot": "/og-image.svg",
    "author": {
      "@type": "Organization",
      "name": `${appName} Team`
    },
    "publisher": {
      "@type": "Organization",
      "name": appName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://scanpings.net/logo.svg"
      }
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://scanpings.net",
      "description": "Test your internet speed"
    }
  }

  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-VQ6VB5LY8D'}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-VQ6VB5LY8D'}');
          `}
        </Script>
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="xp+7TLRdbxql1OUhd77S2w"
          strategy="afterInteractive"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              structuredData,
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "ScanPing",
                "alternateName": "ScanPings",
                "url": "https://scanpings.net",
                "logo": "https://scanpings.net/logo.svg",
                "image": "https://scanpings.net/logo.svg"
              }
            ]),
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <Toaster position="top-right" />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
