import './globals.css'

import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Free Online Internet Speed Test | Fast & Accurate Results`,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
  description: `Test your internet speed with ${process.env.NEXT_PUBLIC_APP_NAME} - the fastest, most accurate online speed test. Measure download, upload speeds, ping, and jitter. Get detailed results in seconds.`,
  keywords: [
    'scanping',
    'ping test',
    'packet loss test',
    'jitter test',
    'internet speed test',
    'download speed',
    'upload speed',
    'bandwidth test',
    'internet speed checker',
    'latency test',
    'wifi speed test',
    'network diagnostics',
    'online speed test',
    'free speed test'
  ],
  authors: [{ name: `${process.env.NEXT_PUBLIC_APP_NAME} Team` }],
  creator: process.env.NEXT_PUBLIC_APP_NAME,
  publisher: process.env.NEXT_PUBLIC_APP_NAME,
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
    title: `${process.env.NEXT_PUBLIC_APP_NAME} - Free Online Internet Speed Test`,
    description: `Test your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME}. Get accurate download, upload, ping, and jitter measurements. Fast, reliable, and free.`,
    url: 'https://scanpings.net',
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME} Internet Speed Test`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${process.env.NEXT_PUBLIC_APP_NAME} - Free Online Internet Speed Test`,
    description: `Test your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME}. Get accurate download, upload, ping, and jitter measurements.`,
    images: ['/og-image.svg'],
    creator: `@${process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase()}`,
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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
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
      "name": appName
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}
