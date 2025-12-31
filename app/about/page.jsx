import AboutContent from './AboutContent';

export const metadata = {
    title: `Our Mission & Technology: Why We Built the ScanPing Tool`,
    description: `Learn about the mission behind ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}—providing radical transparency in network diagnostics using Cloudflare edge intelligence and a privacy-first manifesto.`,
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: `Our Mission & Technology - Why We Built ${process.env.NEXT_PUBLIC_APP_NAME || 'ScanPing'}`,
        description: 'Discover why we prioritize latency transparency and how we use global edge intelligence to provide the most accurate speed test results.',
        url: 'https://scanpings.net/about',
        siteName: 'ScanPing',
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'About ScanPing - Our Mission & Technology',
            },
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export default function AboutPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the mission of ScanPing?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ScanPing aims to provide radical transparency in network diagnostics, focusing on quality metrics like Ping and Jitter that traditional speed tests often overlook."
                }
            },
            {
                "@type": "Question",
                "name": "How does ScanPing technology work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ScanPing utilizes thousands of Cloudflare edge nodes globally, connecting users to the nearest possible point of presence for scientifically accurate latency and bandwidth measurements."
                }
            },
            {
                "@type": "Question",
                "name": "Is my data private on ScanPing?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. ScanPing follows a strict Privacy Manifesto: we do not store IP addresses permanently, do not sell metadata, and use no tracking pixels."
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
