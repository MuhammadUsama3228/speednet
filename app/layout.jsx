import './globals.css'

import { Toaster } from 'react-hot-toast'
import ClientProviders from './components/ClientProviders'
import Navbar from './components/Navbar'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Free Online Internet Speed Test | Fast & Accurate Results`,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
  description: `Test your internet speed with ${process.env.NEXT_PUBLIC_APP_NAME} - the fastest, most accurate online speed test. Measure download, upload speeds, ping, and jitter. Get detailed results in seconds.`,
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

    // Brand & unique strengths (your differentiators)
    'scanping',
    'cloudflare speed test',
    'accurate speed test',
    'best internet speed test',

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

    // Long-tail & user-intent phrases (lower competition, high conversion)
    'what is my internet speed',
    'test internet speed',
    'measure internet speed',
    'connection speed test',
    'internet speed meter',
    'broadband test',
    'network diagnostics',
    'librespeed speed test'
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
            __html: JSON.stringify([structuredData, {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "What is a good ping for gaming?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For competitive gaming, a ping under 20ms is ideal. 20-50ms is considered good, while anything over 100ms may cause noticeable lag."
                }
              }, {
                "@type": "Question",
                "name": "What is Jitter and why does it matter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Jitter is the variation in your ping over time. High jitter means your connection is unstable, which causes 'rubber-banding' in games."
                }
              }, {
                "@type": "Question",
                "name": "How can I improve my internet speed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Try connecting via Ethernet cable instead of WiFi, moving closer to your router, or restarting your modem to clear its cache."
                }
              }]
            }]),
          }}
        />
      </head>
      <body>
        <ClientProviders>
          <Navbar />
          <Toaster position="top-right" />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
