"use client";

import { useTheme } from '../context/ThemeContext';
import { Shield, Globe, Award, Heart } from 'lucide-react';
import SimpleFooter from '../components/SimpleFooter';

export default function AboutContent() {
    const { theme } = useTheme();

    return (
        <main className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
            }`}>
            <div className="max-w-4xl mx-auto space-y-20">
                {/* Mission Section */}
                <section className="text-center">
                    <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Our Mission
                    </h1>
                    <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${theme === 'dark' ? 'text-blue-100' : 'text-slate-700'}`}>
                        ScanPing was born out of frustration with "inflated" speed tests. Our mission is to provide <strong>radical transparency</strong> in network diagnostics, prioritizing the quality metrics—Ping and Jitter—that determine your actual experience.
                    </p>
                </section>

                {/* Technology & Trust Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-3xl backdrop-blur-md border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-blue-100 shadow-xl'}`}>
                        <Globe className="w-10 h-10 text-blue-500 mb-6" />
                        <h2 className={`text-2xl font-black mb-4 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Edge Intelligence
                        </h2>
                        <p className="text-sm leading-relaxed opacity-80">
                            We don't use middleman servers. ScanPing utilizes thousands of Cloudflare edge nodes globally. When you hit "Start", you're connecting to the closest possible point of presence, ensuring that your <strong>download speed test</strong> results are as accurate as physics allows.
                        </p>
                    </div>

                    <div className={`p-8 rounded-3xl backdrop-blur-md border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-blue-100 shadow-xl'}`}>
                        <Shield className="w-10 h-10 text-emerald-500 mb-6" />
                        <h2 className={`text-2xl font-black mb-4 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Privacy Manifesto
                        </h2>
                        <p className="text-sm leading-relaxed opacity-80">
                            Your connection data is your business. ScanPing does not store your IP address permanently, does not sell your location metadata, and does not use tracking pixels. We believe a tool should be a tool, not a data-mining operation.
                        </p>
                    </div>
                </div>

                {/* Community Section */}
                <section className={`p-10 rounded-3xl transition-all border text-center ${theme === 'dark' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-600 text-white'}`}>
                    <Heart className={`w-12 h-12 mx-auto mb-6 ${theme === 'dark' ? 'text-blue-400' : 'text-white animate-pulse'}`} />
                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Developed for the Modern Web</h2>
                    <p className="max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
                        Whether you're a competitive gamer, a remote worker, or a network engineer, ScanPing is built for you. We are constantly improving our algorithms to stay ahead of modern ISP traffic shaping.
                    </p>
                </section>

                <SimpleFooter />
            </div>
        </main>
    );
}
