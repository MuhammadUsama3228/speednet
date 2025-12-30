/**
 * Schema generators for blog SEO
 * Centralizes all structured data creation
 */

export function createBlogPostingSchema(metadata) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: metadata.title,
        description: metadata.description,
        image: metadata.image || 'https://scanpings.net/og-image.svg',
        datePublished: metadata.datePublished,
        dateModified: metadata.dateModified || metadata.datePublished,
        author: {
            '@type': 'Organization',
            name: 'ScanPing Team',
            url: 'https://scanpings.net'
        },
        publisher: {
            '@type': 'Organization',
            name: 'ScanPing',
            logo: {
                '@type': 'ImageObject',
                url: 'https://scanpings.net/logo.svg'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': metadata.url
        },
        articleSection: metadata.section || 'Network Guides',
        wordCount: metadata.wordCount || 1200
    };
}

export function createFAQSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

export function createHowToSchema(howTo) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howTo.name,
        description: howTo.description,
        totalTime: howTo.totalTime || 'PT5M',
        step: howTo.steps.map((step, index) => ({
            '@type': 'HowToStep',
            name: step.name,
            text: step.text,
            url: step.url,
            position: index + 1
        }))
    };
}
