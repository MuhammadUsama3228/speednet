export default function sitemap() {
    const baseUrl = 'https://scanpings.net';

    const blogPosts = [
        'speed-test-accuracy-and-benchmarks',
        'latency-vs-jitter-gaming',
        'video-streaming-requirements',
        'gaming-speed-test',
        'packet-loss-test',
        'netflix-speed-test',
        'bufferbloat-test',
        'how-to-check-internet-speed'
    ];

    const blogRoutes = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...blogRoutes
    ];
}
