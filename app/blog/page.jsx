"use client";

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Wifi, Zap, Activity } from 'lucide-react';
import { APP_STRINGS } from '../constants/strings';

export default function BlogIndex() {
    const { theme } = useTheme();

    const posts = [
        {
            slug: 'latency-vs-jitter-gaming',
            title: 'Latency vs Jitter: The Ultimate Guide for Gamers',
            excerpt: 'Why having high download speed doesn\'t mean zero lag. Learn the difference between Ping and Jitter and how to fix them.',
            date: 'Dec 21, 2025',
            category: 'Gaming',
            icon: <Activity className="w-6 h-6" />
        },
        // Future posts will be added here
    ];

    return (
        <main className={`min-h-screen pt-24 px-4 transition-colors duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
                : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
            }`}>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        ScanPing Blog
                    </h1>
                    <p className={`text-xl ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                        Expert guides on internet speed, network diagnostics, and gaming performance.
                    </p>
                </header>

                <div className="grid gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={`group block p-8 rounded-3xl border transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-blue-400/50'
                                    : 'bg-white border-slate-200 hover:shadow-xl hover:border-blue-300'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {post.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-4 text-sm mb-2 opacity-70">
                                        <span className={`font-bold px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                            }`}>{post.category}</span>
                                        <span className={theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}>{post.date}</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        {post.title}
                                    </h2>
                                    <p className={theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}>
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className={`p-2 rounded-full transition-transform group-hover:translate-x-2 ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'
                                    }`}>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className={`text-center mt-20 mb-12 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`}>
                    <p>{APP_STRINGS.FOOTER_TEXT}</p>
                </footer>
            </div>
        </main>
    );
}
