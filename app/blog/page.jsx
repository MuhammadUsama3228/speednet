import BlogList from './BlogList';
import { APP_STRINGS } from '../constants/strings';

export const metadata = {
    title: `ScanPing Blog - Network Guides & Gaming Tips`,
    description: 'Expert guides on lowering ping, fixing packet loss, and understanding internet speed. Learn how to optimize your connection for gaming.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'ScanPing Blog: Internet Speed Tips & Network Guide 2025',
        description: 'Expert guides on internet speed and gaming performance.',
        url: 'https://scanpings.net/blog',
    }
};

export default function BlogPage() {
    return <BlogList />;
}
