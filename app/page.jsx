import SpeedTest from './SpeedTest'
import Script from 'next/script'

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ScanPing Internet Speed Test',
    operatingSystem: 'Any',
    applicationCategory: 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Test your internet speed with ScanPing - accurately measure download, upload, ping and jitter instantly.',
    softwareVersion: '2.0.0',
    author: {
      '@type': 'Organization',
      name: 'ScanPing',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpeedTest />
    </>
  );
}
