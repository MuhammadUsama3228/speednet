import AboutContent from './AboutContent';

export const metadata = {
    title: `About ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - FAQ & Speed Test Guide`,
    description: 'Learn how ScanPing tests your internet speed, understand Ping, Jitter, and Latency, and find answers to common network questions.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: `About ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'} - FAQ & Guide`,
        description: 'Everything you need to know about internet speed testing, latency, and network diagnostics.',
        url: 'https://scanpings.net/about',
    }
};

export default function AboutPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is ScanPing?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ScanPing is a free, high-performance internet speed test tool that measures your download speed, upload speed, ping (latency), and jitter to provide a comprehensive analysis of your network connection."
                }
            },
            {
                "@type": "Question",
                "name": "How is Jitter different from Ping?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ping measures the time it takes for data to travel to a server and back (latency), while Jitter measures the consistency of that time. High jitter means your connection is unstable, which can cause lag spikes in gaming."
                }
            },
            {
                "@type": "Question",
                "name": "What is a good internet speed?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A good speed depends on your needs. For streaming 4K video, 25 Mbps is recommended. For online gaming, anything above 10-20 Mbps is usually fine, but low Ping (<50ms) and low Jitter are more important."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <AboutContent />
        </>
    );
}
