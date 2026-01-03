"use client";

import { useTheme } from '../context/ThemeContext';
import { Shield, Eye, Lock } from 'lucide-react';
import SimpleFooter from '../components/SimpleFooter';

export default function PrivacyContent() {
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
                        Privacy Policy
                    </h1>
                    <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-blue-100' : 'text-slate-800'}`}>
                        At ScanPing, your privacy is our priority. We believe speed tests should be about connection quality, not data collection. Learn how we protect your information with our <strong>privacy-first speed test</strong> approach.
                    </p>
                </section>

                {/* Key Principles */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <Shield className="w-8 h-8 text-green-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Data Storage</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>We don't permanently store your IP address or location data after your speed test completes.</p>
                    </div>
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <Eye className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Tracking</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>No cookies, pixels, or third-party trackers. Your browsing remains completely private.</p>
                    </div>
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <Lock className="w-8 h-8 text-purple-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Secure Testing</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>All speed tests use encrypted HTTPS connections to Cloudflare's global network.</p>
                    </div>
                </div>

                {/* Detailed Policy */}
                <section>
                    <h2 className={`text-3xl font-black mb-8 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        What We Collect & Why
                    </h2>
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Temporary IP Detection</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                To provide accurate <strong>network diagnostics</strong>, we temporarily detect your IP address and geolocation during the speed test. This information is used only to select the optimal test server and is discarded immediately after your test completes. We do not log or store this data.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Test Results (Optional)</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                Your <strong>download speed</strong>, <strong>upload speed</strong>, <strong>ping</strong>, and <strong>jitter</strong> results are stored locally in your browser for the test history feature. This data never leaves your device unless you choose to share it manually.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Analytics & Performance</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                We use Google Analytics 4 for basic website performance metrics. This helps us improve the speed test tool, but we don't track individual users or collect personal information. You can opt out using your browser's privacy settings.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Data Sharing */}
                <section>
                    <h2 className={`text-3xl font-black mb-8 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        We Never Share Your Data
                    </h2>
                    <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-blue-100' : 'text-slate-800'}`}>
                        Unlike many speed test services, ScanPing does not sell, rent, or share your data with third parties. We don't use your connection information for advertising, marketing, or any commercial purposes. Your <strong>internet speed test</strong> is purely for your benefit.
                    </p>
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                            <strong>Privacy Promise:</strong> If we ever change our privacy practices, we'll update this policy and notify users prominently. Your trust is our most valuable asset.
                        </p>
                    </div>
                </section>

                <SimpleFooter />
            </div>
        </main>
    );
}
