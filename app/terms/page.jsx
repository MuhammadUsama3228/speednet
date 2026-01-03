import TermsContent from './TermsContent';

export const metadata = {
    title: 'Terms of Service - ScanPing Internet Speed Test Guidelines',
    description: 'Read ScanPing\'s terms of service. Understand usage guidelines for our free internet speed test, network diagnostics tool, and online speed checker.',
    keywords: 'terms of service, internet speed test terms, network diagnostics guidelines, speed test usage policy, bandwidth test terms, ping test conditions, free speed test rules',
    alternates: {
        canonical: '/terms',
    },
    openGraph: {
        title: 'Terms of Service - ScanPing',
        description: 'Terms and conditions for using ScanPing\'s internet speed test and network diagnostics services.',
        url: 'https://scanpings.net/terms',
        siteName: 'ScanPing',
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'ScanPing Terms of Service',
            },
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export default function TermsPage() {
    return <TermsContent />;
}
