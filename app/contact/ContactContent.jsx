"use client";

import { useTheme } from '../context/ThemeContext';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import SimpleFooter from '../components/SimpleFooter';

export default function ContactContent() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <main className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-300 ${isDark
            ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
            }`}>
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <section className="text-center">
                    <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Contact Us
                    </h1>
                    <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-blue-100' : 'text-slate-800'}`}>
                        Have questions about your <strong>internet speed test</strong> results? Need help understanding your <strong>ping</strong>, <strong>jitter</strong>, or <strong>latency</strong>? We're here to help with expert network diagnostics support. <a href="/about" className="text-blue-600 hover:text-blue-800 underline">Learn more about our mission</a> and how we provide accurate speed testing.
                    </p>
                </section>

                {/* Contact Methods */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-3xl backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-blue-100 shadow-xl'}`}>
                        <Mail className="w-10 h-10 text-blue-500 mb-6" />
                        <h2 className={`text-2xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Email Support
                        </h2>
                        <p className={`text-sm leading-relaxed ${isDark ? 'opacity-80' : 'text-slate-600'} mb-4`}>
                            For detailed questions about speed test accuracy, network diagnostics, or technical support, email our team. We typically respond within 24 hours.
                        </p>
                        <a href="mailto:support@scanpings.net" className={`inline-block px-6 py-3 rounded-full font-bold transition-all hover:scale-105 ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            support@scanpings.net
                        </a>
                    </div>

                    <div className={`p-8 rounded-3xl backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-blue-100 shadow-xl'}`}>
                        <MessageSquare className="w-10 h-10 text-green-500 mb-6" />
                        <h2 className={`text-2xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Community Forum
                        </h2>
                        <p className={`text-sm leading-relaxed ${isDark ? 'opacity-80' : 'text-slate-600'} mb-4`}>
                            Join our community of network enthusiasts. Share your speed test results, get tips on improving your connection, and discuss the latest in internet diagnostics.
                        </p>
                        <button className={`inline-block px-6 py-3 rounded-full font-bold transition-all hover:scale-105 ${isDark ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                            Join Community
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <section>
                    <h2 className={`text-3xl font-black mb-8 text-center uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Common Questions
                    </h2>
                    <div className="space-y-4">
                        <div className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Why is my download speed slower than expected?</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                                Many factors can affect your speed test results. Check for background downloads, WiFi interference, or ISP throttling. Our <strong>bandwidth test</strong> uses adaptive algorithms for maximum accuracy.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>What does high jitter mean for gaming?</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                                High jitter indicates unstable latency, which can cause lag spikes in online games. Our <strong>jitter test</strong> helps identify connection quality issues that affect gaming performance.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>How can I improve my ping?</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-80' : 'text-slate-600'}`}>
                                Lower ping requires proximity to game servers and stable connections. Use Ethernet over WiFi, close background apps, and consider a wired connection for best <strong>latency test</strong> results.
                            </p>
                        </div>
                    </div>
                </section>

                <SimpleFooter />
            </div>
        </main>
    );
}
