"use client";

import { useTheme } from '../context/ThemeContext';
import { FileText, Scale, Users } from 'lucide-react';
import SimpleFooter from '../components/SimpleFooter';

export default function TermsContent() {
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
                        Terms of Service
                    </h1>
                    <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-blue-100' : 'text-slate-800'}`}>
                        These terms govern your use of ScanPing's <strong>internet speed test</strong> and <strong>network diagnostics</strong> services. By using our tool, you agree to these guidelines.
                    </p>
                </section>

                {/* Key Terms */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <FileText className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Free Service</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>ScanPing is completely free to use. No registration, no payment required for speed tests.</p>
                    </div>
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <Scale className="w-8 h-8 text-green-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Fair Use</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>Use our speed test responsibly. Excessive automated testing may be limited to ensure service quality.</p>
                    </div>
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <Users className="w-8 h-8 text-purple-500 mb-4 mx-auto" />
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>User Responsibility</h3>
                        <p className={`text-sm ${isDark ? 'opacity-80' : 'text-slate-600'}`}>You are responsible for your internet connection and any actions taken based on test results.</p>
                    </div>
                </div>

                {/* Detailed Terms */}
                <section>
                    <h2 className={`text-3xl font-black mb-8 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Service Terms
                    </h2>
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Accuracy & Limitations</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                ScanPing provides accurate <strong>download speed test</strong>, <strong>upload speed test</strong>, <strong>ping test</strong>, <strong>jitter test</strong>, and <strong>bandwidth test</strong> results using Cloudflare's global network. However, results may vary based on your network conditions, device, and other factors. We strive for maximum accuracy but cannot guarantee 100% precision.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Prohibited Uses</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                Do not use ScanPing for illegal activities, automated testing that disrupts service quality, or any purpose that violates applicable laws. Respect fair usage limits to ensure all users can access accurate <strong>network diagnostics</strong>.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Data & Privacy</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                Your privacy is protected. We don't store personal data permanently. See our <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a> for complete details on how we handle temporary IP detection and test data during your <strong>internet speed test</strong>.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Service Availability</h3>
                            <p className={`leading-relaxed ${isDark ? 'opacity-90' : 'text-slate-600'}`}>
                                ScanPing is provided "as is" without warranties. We strive for 99.9% uptime but cannot guarantee uninterrupted service. Speed test results are for informational purposes only.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                    <h2 className={`text-2xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Questions About These Terms?
                    </h2>
                    <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                        If you have questions about our terms of service or need clarification about using ScanPing's speed test tools, please contact our support team.
                    </p>
                    <a href="/contact" className={`inline-block px-6 py-3 rounded-full font-bold transition-all hover:scale-105 ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                        Contact Support
                    </a>
                </section>

                <SimpleFooter />
            </div>
        </main>
    );
}
