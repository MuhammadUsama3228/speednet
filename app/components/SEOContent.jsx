"use client";

import React from 'react';
import { HelpCircle, Zap, Activity, Info } from 'lucide-react';

export default function SEOContent({ theme }) {
    const isDark = theme === 'dark';

    return (
        <div className={`w-full max-w-4xl mx-auto mt-16 px-4 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>

            {/* Introduction */}
            <section className="mb-10 text-center">
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Why ScanPing?
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed">
                    ScanPing is the advanced network diagnostic tool designed for the modern web.
                    Unlike traditional speed tests that focus only on download speed, we prioritize
                    <strong> Latency (Ping)</strong> and <strong>Jitter</strong>—the metrics that actually matter for
                    gaming, video calls, and real-time applications.
                </p>
            </section>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                    <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>True Speed</h3>
                    <p className="text-sm">
                        We measure your connection's true throughput using Cloudflare's massive global network, ensuring results that reflect real-world performance.
                    </p>
                </div>
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                    <Activity className="w-8 h-8 text-green-400 mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Gaming First</h3>
                    <p className="text-sm">
                        Gamers need low ping. Our sensitive latency test detects even micro-stutters and jitter that cause lag in competitive games like Valorant and CS:GO.
                    </p>
                </div>
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                    <Info className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Privacy Focused</h3>
                    <p className="text-sm">
                        No tracking pixel, no bloated ads. ScanPing runs entirely in your browser and connects directly to the nearest test server.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <section>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <FAQItem
                        question="What is a good ping for gaming?"
                        answer="For competitive gaming, a ping under 20ms is ideal. 20-50ms is considered good, while anything over 100ms may cause noticeable lag. ScanPing measures this precisely to help you optimize your setup."
                        isDark={isDark}
                    />
                    <FAQItem
                        question="Why is my upload speed slower than download?"
                        answer="Most residential internet connections are 'asymmetric', meaning ISPs prioritize download speed for streaming and browsing. Upload speed is mainly used for sending files or video calling."
                        isDark={isDark}
                    />
                    <FAQItem
                        question="What is Jitter and why does it matter?"
                        answer="Jitter is the variation in your ping over time. High jitter means your connection is unstable, which causes 'rubber-banding' in games even if your average ping looks low."
                        isDark={isDark}
                    />
                    <FAQItem
                        question="How can I improve my internet speed?"
                        answer="Try connecting via Ethernet cable instead of WiFi, moving closer to your router, or restarting your modem to clear its cache. Running a daily test on ScanPing helps track if these changes work."
                        isDark={isDark}
                    />
                </div>
            </section>

        </div>
    );
}

function FAQItem({ question, answer, isDark }) {
    return (
        <div className={`p-6 rounded-xl border transition-all hover:bg-opacity-50 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <HelpCircle className="w-5 h-5 text-blue-400" />
                {question}
            </h3>
            <p className="leading-relaxed pl-7">
                {answer}
            </p>
        </div>
    );
}
