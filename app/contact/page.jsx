import ContactContent from './ContactContent';

export const metadata = {
    title: 'Contact Us - Get Support for Internet Speed Test | ScanPing',
    description: 'Need help with your internet speed test? Contact ScanPing support for questions about download speed, upload speed, ping, jitter, and network diagnostics. Free expert assistance.',
    keywords: 'internet speed test support, network diagnostics help, ping test assistance, jitter troubleshooting, bandwidth test support, connection quality help, speed test FAQ',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact ScanPing - Internet Speed Test Support',
        description: 'Get expert help with your speed test results. Contact us for support on wifi speed test, broadband diagnostics, and network troubleshooting.',
        url: 'https://scanpings.net/contact',
        siteName: 'ScanPing',
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'Contact ScanPing Support',
            },
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export default function ContactPage() {
    return <ContactContent />;
}
