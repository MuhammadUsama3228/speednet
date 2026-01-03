import PrivacyContent from './PrivacyContent';

export const metadata = {
    title: 'Privacy Policy - How We Protect Your Data | ScanPing',
    description: 'Learn about ScanPing\'s privacy-first approach. We don\'t store your IP, sell data, or use tracking. Your internet speed test results stay private and secure.',
    keywords: 'privacy policy, data protection, internet speed test privacy, no data storage, privacy-first speed test, secure network diagnostics, IP protection, data security',
    alternates: {
        canonical: '/privacy',
    },
    openGraph: {
        title: 'Privacy Policy - ScanPing Data Protection',
        description: 'Your privacy matters. Discover how ScanPing protects your data during speed tests, network diagnostics, and connection analysis.',
        url: 'https://scanpings.net/privacy',
        siteName: 'ScanPing',
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'ScanPing Privacy Policy',
            },
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export default function PrivacyPage() {
    return <PrivacyContent />;
}