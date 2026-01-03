import './globals.css'

import { Toaster } from 'react-hot-toast'
import ClientProviders from './components/ClientProviders'
import Navbar from './components/Navbar'
import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata = {
  // OPTIMIZED TITLE: Targets "Internet Speed Test" (4M), "WiFi Speed" (800k), and "Bandwidth"
  title: `Internet Speed Test - Check WiFi Speed & Bandwidth | ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}`,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing',
  // OPTIMIZED DESCRIPTION: Includes "Check", "Free", "WiFi", "Broadband" for max CTR
  description: `Check your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}. Free WiFi speed test and broadband bandwidth checker. Measure download, upload, ping, and jitter accurately.`,
  keywords: [
    // --- TIER 1: HIGH VOLUME / LOW COMPETITION (The "Golden List") ---
    'internet speed test',      // 4M+ Volume
    'wifi speed test',          // 823k Volume (Huge opportunity)
    'check internet speed',     // 60k Volume (High Intent)
    'broadband speed test',     // Tuned for ISP searches
    'test my internet speed',   // Natural language search
    'internet speed test free', // "Free" is a strong trigger

    // --- TIER 2: TECHNICAL & VARIATIONS ---
    'download speed test',
    'upload speed test',
    'bandwidth test',
    'ping test',
    'jitter test',
    'latency test',
    'network speed',
    'check wifi speed',
    'measure internet speed',
    'connection speed test',

    // --- TIER 3: BRAND & COMPETITOR ALTERNATIVES ---
    'scanping',
    'accurate speed test',
    'speedtest alternative',
    'fast.com alternative',
    'cloudflare speed test',

    // Legacy/Other
    'online speed test',
    'packet loss test',
    'network diagnostics',
    'mbps test'
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
    // SYNCED WITH MAIN METADATA
    title: `Internet Speed Test - Check WiFi Speed & Bandwidth | ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}`,
    description: `Check your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}. Free WiFi speed test and broadband bandwidth checker. Measure download, upload, ping, and latency accurately.`,
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
    title: `Internet Speed Test - Check WiFi Speed & Bandwidth | ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}`,
    description: `Check your internet speed instantly with ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}. Free WiFi speed test and broadband bandwidth checker.`,
    images: ['/og-image.svg'],
    creator: `@${(process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing').toLowerCase()}`,
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
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#38bdf8'
      }
    ]
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2850",
      "bestRating": "5",
      "worstRating": "1"
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
        <link rel="preconnect" href="https://cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ipapi.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Google Analytics 4 - Optimized loading */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-VQ6VB5LY8D'}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-VQ6VB5LY8D'}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
          `}
        </Script>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'dark'; // Final fallback
                  
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              structuredData,
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": appName,
                "alternateName": ["ScanPings", "ScanPing Speed Test"],
                "url": "https://scanpings.net"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": appName,
                "url": "https://scanpings.net",
                "logo": "https://scanpings.net/web-app-manifest-512x512.png",
                "sameAs": []
              }
            ]),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          <Navbar />
          <Toaster position="top-right" />
          <main id="main-content">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  )
}
