import BlogLayout from '../components/BlogLayout';
import { createBlogPostingSchema, createFAQSchema, createHowToSchema } from '../utils/schemas';
import { BlogCTA, QuickAnswer, InfoBox, RelatedArticles } from '../components/BlogComponents';

export const metadata = {
    title: 'How to Check Internet Speed in 2025 (Step-by-Step Guide)',
    description: 'Learn how to check your internet speed in 3 simple steps. Compare ScanPings, Speedtest.net, and Fast.com. Find out if your ISP is delivering promised speeds.',
    keywords: ['how to check internet speed', 'how to test internet speed', 'check my internet speed', 'test internet connection', 'internet speed test free'],
    alternates: {
        canonical: '/blog/how-to-check-internet-speed',
    },
    openGraph: {
        title: 'How to Check Your Internet Speed (2024 Guide)',
        description: 'Complete guide to testing your internet speed. Learn which tools to use and how to interpret results.',
        url: 'https://scanpings.net/blog/how-to-check-internet-speed',
        siteName: 'ScanPing',
        images: [
            {
                url: '/og-image.svg',
                width: 1200,
                height: 630,
                alt: 'How to Check Internet Speed Guide',
            },
        ],
        locale: 'en_US',
        type: 'article'
    }
};

const faqs = [
    {
        question: 'How do I check my internet speed?',
        answer: 'To check your internet speed: 1) Go to ScanPings.net or another speed test site, 2) Click "Start Test", 3) Wait 30-60 seconds, 4) Review your download speed, upload speed, ping, and jitter results. Use ethernet instead of WiFi for most accurate results.'
    },
    {
        question: 'Which internet speed test is most accurate?',
        answer: 'ScanPings, Fast.com (by Netflix), and Speedtest.net (by Ookla) are all accurate. ScanPings uses Cloudflare\'s global network for precise measurements. Fast.com tests your speed to Netflix servers. For best results, test with multiple services and use ethernet.'
    },
    {
        question: 'Why is my speed test different from what I pay for?',
        answer: 'Speed tests may differ from advertised speeds due to: WiFi vs ethernet (WiFi is slower), network congestion, router limitations, device limitations, or ISP throttling. ISPs advertise "up to" speeds, not guaranteed speeds. Use ethernet for accurate testing.'
    },
    {
        question: 'Should I use WiFi or ethernet for speed tests?',
        answer: 'Always use ethernet (wired connection) for accurate speed tests. WiFi adds variable latency and can reduce speeds by 30-50% depending on signal strength, interference, and router quality. Ethernet tests your true internet connection, not your WiFi performance.'
    }
];

const relatedArticles = [
    {
        href: '/blog/speed-test-accuracy-and-benchmarks',
        category: 'Speed Guide',
        categoryColor: 'text-blue-600 dark:text-blue-400',
        title: 'What Internet Speed Do I Need?',
        excerpt: 'FCC 2024 benchmarks for all activities'
    },
    {
        href: '/blog/latency-vs-jitter-gaming',
        category: 'Gaming',
        categoryColor: 'text-green-600 dark:text-green-400',
        title: 'What is Good Jitter?',
        excerpt: 'Ping vs jitter explained for gamers'
    }
];

export default function Article() {
    const schemas = [
        createHowToSchema({
            name: 'How to Check Your Internet Speed',
            description: 'Step-by-step guide to testing your internet connection speed',
            totalTime: 'PT2M',
            steps: [
                {
                    name: 'Go to ScanPings.net',
                    text: 'Open your web browser and navigate to https://scanpings.net',
                    url: 'https://scanpings.net'
                },
                {
                    name: 'Click Start Test',
                    text: 'Click the "Start Test" button to begin measuring your download speed, upload speed, ping, and jitter'
                },
                {
                    name: 'Review Results',
                    text: 'Wait 30-60 seconds for the test to complete, then review your download/upload speeds, ping, and jitter metrics'
                }
            ]
        }),
        createBlogPostingSchema({
            title: metadata.title,
            description: metadata.description,
            url: 'https://scanpings.net/blog/how-to-check-internet-speed',
            datePublished: '2024-12-30',
            dateModified: '2024-12-30',
            section: 'Network Guides',
            wordCount: 1200
        }),
        createFAQSchema(faqs)
    ];

    return (
        <BlogLayout
            category="Network Guides"
            categoryColor="blue"
            title="How to Check Your Internet Speed (2024 Guide)"
            date="December 30, 2024"
            readTime="5 min read"
            schemas={schemas}
        >
            <p className="lead text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-8">
                <strong>How do you check your internet speed?</strong> It takes 2 minutes. This guide shows you exactly how to test your connection, which tools to use, and how to interpret the results to see if you're getting what you pay for.
            </p>

            <QuickAnswer>
                <ol className="space-y-2 m-0">
                    <li><strong>1.</strong> Go to <a href="/" className="underline font-bold">ScanPings.net</a></li>
                    <li><strong>2.</strong> Click "Start Test"</li>
                    <li><strong>3.</strong> Wait 30-60 seconds for results</li>
                    <li><strong>4.</strong> Compare results to your ISP plan</li>
                </ol>
            </QuickAnswer>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Method 1: Test with ScanPings (Recommended)</h2>
            <p>
                <strong>ScanPings</strong> uses <strong>Cloudflare's global edge network</strong> to give you the most accurate speed measurement. Unlike single-server tests, ScanPings tests against the closest server to you for real-world performance.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Step-by-Step Instructions:</h3>
            <ol className="list-decimal pl-6 space-y-4 mb-8">
                <li><strong>Close background apps:</strong> Windows Update, Steam downloads, and browser tabs with video can skew results.</li>
                <li><strong>Connect via Ethernet:</strong> WiFi adds 20-50ms latency and reduces bandwidth. For accurate testing, plug in directly.</li>
                <li><strong>Visit ScanPings.net:</strong> Open your browser and go to the homepage.</li>
                <li><strong>Click "Start Test":</strong> The test automatically measures:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Download Speed:</strong> How fast you receive data (watching videos, browsing)</li>
                        <li><strong>Upload Speed:</strong> How fast you send data (video calls, cloud backups)</li>
                        <li><strong>Ping (Latency):</strong> Response time in milliseconds (critical for gaming)</li>
                        <li><strong>Jitter:</strong> Ping stability over time (causes lag spikes)</li>
                    </ul>
                </li>
                <li><strong>Review Results:</strong> Compare your results to your ISP plan and the <a href="/blog/speed-test-accuracy-and-benchmarks" className="text-blue-600 dark:text-blue-400 hover:underline">FCC 2024 standard (100/20 Mbps)</a>.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Method 2: Test with Fast.com (Netflix)</h2>
            <p>
                <a href="https://fast.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Fast.com</a> is Netflix's speed test. It's simple, clean, and tests your connection specifically to Netflix servers. However, it <strong>only measures download speed</strong> by default.
            </p>
            <p>
                <strong>Pros:</strong> Extremely simple, no ads, shows Netflix-specific performance<br />
                <strong>Cons:</strong> Doesn't show ping or jitter, limited metrics
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Method 3: Test with Speedtest.net (Ookla)</h2>
            <p>
                <a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Speedtest.net</a> by Ookla is the most popular speed test. It's been around since 2006 and has servers worldwide.
            </p>
            <p>
                <strong>Pros:</strong> Huge server network, detailed history, mobile apps<br />
                <strong>Cons:</strong> Ads, requires app download for best features
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">How to Interpret Your Results</h2>

            <div className="overflow-x-auto my-8">
                <table className="w-full text-sm text-left border-collapse border border-slate-200 dark:border-slate-700">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800">
                            <th className="p-3 border border-slate-200 dark:border-slate-700">Metric</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700">What It Measures</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700">Good Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Download Speed</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700">Receiving data (streaming, browsing)</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 text-green-500 font-bold">100+ Mbps</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Upload Speed</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700">Sending data (video calls, uploads)</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 text-green-500 font-bold">20+ Mbps</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Ping (Latency)</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700">Response time</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 text-green-500 font-bold">&lt; 30ms</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold">Jitter</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700">Ping stability (variation)</td>
                            <td className="p-3 border border-slate-200 dark:border-slate-700 text-green-500 font-bold">&lt; 20ms</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <InfoBox type="warning" title="Why Results Vary">
                <p className="m-0">
                    Different speed tests can show different results because they test to different server locations, use different measurement methods, and may be affected by ISP traffic shaping. <strong>Always test multiple times and compare averages.</strong>
                </p>
            </InfoBox>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Common Speed Test Mistakes</h2>
            <ol className="list-decimal pl-6 space-y-3 mb-8">
                <li><strong>Testing Over WiFi:</strong> WiFi is slower and less stable than ethernet. Always test wired for accuracy.</li>
                <li><strong>Testing Once:</strong> Network performance varies throughout the day. Test at different times.</li>
                <li><strong>Not Closing Apps:</strong> Background downloads and updates consume bandwidth.</li>
                <li><strong>Using Old Devices:</strong> Older computers/phones may not support gigabit speeds.</li>
                <li><strong>Router Bottlenecks:</strong> Old routers (pre-2018) may cap speeds at 100 Mbps.</li>
            </ol>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Best Practices for Accurate Testing</h2>
            <ul className="list-disc pl-6 space-y-3 mb-8">
                <li><strong>Use Ethernet:</strong> Direct cable connection eliminates WiFi variables</li>
                <li><strong>Test Multiple Services:</strong> ScanPings, Fast.com, Speedtest.net for validation</li>
                <li><strong>Test Multiple Times:</strong> Morning, afternoon, evening to find patterns</li>
                <li><strong>Close Everything:</strong> No downloads, streams, or updates running</li>
                <li><strong>Reboot Router First:</strong> Fresh connection prevents cached issues</li>
            </ul>

            <InfoBox type="reference" title="Related Resources">
                <ul className="space-y-2 m-0 text-sm">
                    <li>• <a href="/blog/speed-test-accuracy-and-benchmarks" className="text-purple-600 dark:text-purple-400 hover:underline">What Internet Speed Do I Need?</a> — FCC 2024 benchmarks</li>
                    <li>• <a href="/blog/latency-vs-jitter-gaming" className="text-purple-600 dark:text-purple-400 hover:underline">Ping vs Jitter Explained</a> — Gaming performance guide</li>
                    <li>• <a href="/blog/video-streaming-requirements" className="text-purple-600 dark:text-purple-400 hover:underline">4K Streaming Requirements</a> — Netflix, YouTube speeds</li>
                </ul>
            </InfoBox>

            <hr className="my-12 border-slate-200 dark:border-slate-700" />

            <BlogCTA />

            <RelatedArticles articles={relatedArticles} />
        </BlogLayout>
    );
}
