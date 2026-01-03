import React from 'react';
import { HelpCircle, Zap, Activity, Info, Wifi, Globe, Shield, TrendingUp } from 'lucide-react';

export default function SEOContent() {
    return (
        <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-blue-200">

            {/* Introduction & Guide */}
            <section className="mb-12 text-center">
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-800 dark:text-white uppercase tracking-tight">
                    Fast Speed Test & Internet Speedometer
                </h2>
                <p className="max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    Want to know <strong>how fast is my internet</strong>? ScanPing provides an <strong>accurate internet speed test free</strong> of ads and bloat. Our <strong>internet speedometer</strong> measures your <strong>wifi speed test</strong> results, <strong>download speed</strong>, and <strong>ping test</strong> metrics using the same high-concurrency technology as a <strong>Netflix speed test</strong> or <strong>Cloudflare speed test</strong>.
                </p>
            </section>

            {/* What Makes Our Speed Test Different */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-black mb-8 text-center text-slate-800 dark:text-white uppercase tracking-tight">
                    Why Choose Our Internet Speedometer?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="p-6 rounded-2xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 text-center">
                        <Globe className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Global Network</h3>
                        <p className="text-sm leading-relaxed">Uses Cloudflare's worldwide edge network for accurate measurements from 300+ cities.</p>
                    </div>
                    <div className="p-6 rounded-2xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 text-center">
                        <Zap className="w-8 h-8 text-yellow-500 mb-4 mx-auto" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Lightning Fast</h3>
                        <p className="text-sm leading-relaxed">Complete speed test in under 30 seconds with real-time progress tracking.</p>
                    </div>
                    <div className="p-6 rounded-2xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 text-center">
                        <Shield className="w-8 h-8 text-green-500 mb-4 mx-auto" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Privacy First</h3>
                        <p className="text-sm leading-relaxed">No data collection, no tracking pixels, completely anonymous speed testing.</p>
                    </div>
                    <div className="p-6 rounded-2xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 text-center">
                        <TrendingUp className="w-8 h-8 text-purple-500 mb-4 mx-auto" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Detailed Analysis</h3>
                        <p className="text-sm leading-relaxed">Beyond speeds - get connection quality scores and recommendations.</p>
                    </div>
                </div>
            </section>

            {/* Step-by-Step Guide Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="p-8 rounded-3xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                        <Wifi className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">1. Prepare Your Connection</h3>
                    <p className="text-sm leading-relaxed opacity-80">
                        For the most accurate wifi speed test results, ensure you're connected to your home network. Close bandwidth-heavy applications and connect via Ethernet for best results. This gives you a true measure of your internet service provider's performance.
                    </p>
                </div>
                <div className="p-8 rounded-3xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                        <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">2. Run Speed Test</h3>
                    <p className="text-sm leading-relaxed opacity-80">
                        Click the start button to begin your comprehensive internet speed test. Our speedometer will first measure your ping and latency, then perform download and upload speed tests using multiple concurrent connections for maximum accuracy.
                    </p>
                </div>
                <div className="p-8 rounded-3xl border bg-white border-blue-100 shadow-sm dark:bg-white/5 dark:border-white/10 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                        <Info className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">3. Analyze Results</h3>
                    <p className="text-sm leading-relaxed opacity-80">
                        Review your detailed speed test results including download speed, upload speed, ping latency, and jitter measurements. Use our connection analysis to understand if your speeds meet your needs for streaming, gaming, or work.
                    </p>
                </div>
            </div>

            {/* Understanding Your Speed Test Results */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-black mb-8 text-center text-slate-800 dark:text-white uppercase tracking-tight">
                    Understanding Speed Test Results
                </h2>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="p-6 rounded-xl border bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Download Speed</h3>
                        <p className="leading-relaxed mb-4">
                            Download speed measures how quickly data flows from the internet to your device. This is crucial for streaming videos, downloading files, and browsing websites. Most internet plans advertise download speeds, making this the most commonly referenced metric.
                        </p>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Good for:</strong> Netflix 4K (25+ Mbps), HD streaming (10+ Mbps), Web browsing (5+ Mbps)
                        </div>
                    </div>
                    <div className="p-6 rounded-xl border bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Upload Speed</h3>
                        <p className="leading-relaxed mb-4">
                            Upload speed measures how quickly data flows from your device to the internet. While often slower than download speeds, upload speed is essential for video conferencing, online gaming, and file sharing.
                        </p>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Good for:</strong> Zoom calls (3+ Mbps), Online gaming (2+ Mbps), File uploads (5+ Mbps)
                        </div>
                    </div>
                    <div className="p-6 rounded-xl border bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Ping (Latency)</h3>
                        <p className="leading-relaxed mb-4">
                            Ping measures the time it takes for data to travel from your device to a server and back. Lower ping times mean faster response times, which is critical for real-time applications like online gaming and video calls.
                        </p>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Excellent:</strong> &lt;20ms, <strong>Good:</strong> 20-50ms, <strong>Fair:</strong> 50-100ms
                        </div>
                    </div>
                    <div className="p-6 rounded-xl border bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Jitter</h3>
                        <p className="leading-relaxed mb-4">
                            Jitter measures the variation in ping over time. Consistent jitter can cause audio/video distortion in calls and lag spikes in games. Low jitter ensures smooth, stable connections for all your online activities.
                        </p>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>Excellent:</strong> &lt;5ms, <strong>Good:</strong> 5-15ms, <strong>Fair:</strong> 15-30ms
                        </div>
                    </div>
                </div>
            </section>

            {/* Speed Test Tips */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-black mb-8 text-center text-slate-800 dark:text-white uppercase tracking-tight">
                    Getting Accurate Speed Test Results
                </h2>
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">🏠 Test at Home</h4>
                                <p className="text-sm text-blue-800 dark:text-blue-200">Run speed tests from your home network to measure what you actually experience. Public WiFi or mobile data won't give you accurate results for your internet plan.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">🔌 Use Ethernet</h4>
                                <p className="text-sm text-green-800 dark:text-green-200">Connect your computer directly to your router with an Ethernet cable. WiFi introduces additional variables that can affect your speed test accuracy.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">⏰ Test at Different Times</h4>
                                <p className="text-sm text-purple-800 dark:text-purple-200">Internet speeds can vary throughout the day. Test during peak hours and off-peak hours to understand your connection's performance range.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                                <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">📱 Close Other Apps</h4>
                                <p className="text-sm text-orange-800 dark:text-orange-200">Shut down streaming services, downloads, and other bandwidth-intensive applications before running your speed test for the most accurate results.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">🔄 Multiple Tests</h4>
                                <p className="text-sm text-red-800 dark:text-red-200">Run your speed test 3-5 times and average the results. Single tests can be affected by temporary network conditions or server load.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                                <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-2">🌍 Use Local Servers</h4>
                                <p className="text-sm text-teal-800 dark:text-teal-200">Choose speed test servers geographically close to you. Testing against distant servers introduces unnecessary latency that doesn't reflect your actual experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-slate-800 dark:text-white">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <FAQItem
                        question="How does your internet speedometer work?"
                        answer="Our speed test uses advanced algorithms to measure multiple connection parameters simultaneously. We establish connections to nearby test servers and measure data transfer rates, response times, and connection stability to provide comprehensive internet speed analysis."
                    />
                    <FAQItem
                        question="Why do speed test results vary between different websites?"
                        answer="Different speed test services use different methodologies, server locations, and testing protocols. Our internet speedometer uses Cloudflare's global network for consistent, accurate measurements that reflect real-world performance."
                    />
                    <FAQItem
                        question="What internet speed do I need for different activities?"
                        answer="For basic web browsing: 5 Mbps, HD streaming: 10 Mbps, 4K streaming: 25 Mbps, online gaming: 10-25 Mbps with <50ms ping, video conferencing: 3-5 Mbps upload speed. Use our speed test to verify your connection meets your needs."
                    />
                    <FAQItem
                        question="How can I improve my internet speed test results?"
                        answer="Restart your router, use Ethernet instead of WiFi, close bandwidth-heavy applications, update your router firmware, and contact your ISP if speeds consistently fall below your plan. Our wifi checker helps identify the best testing conditions."
                    />
                </div>
            </section>

            {/* Keyword Rich Footer Content */}
            <section className="pt-16 pb-12 text-sm opacity-80 leading-relaxed border-t border-slate-200/50 dark:border-white/5">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-slate-900 dark:text-white">Advanced Internet Speedometer Technology</h4>
                        <p>
                            Experience the most accurate internet speed test available. Our wifi speed checker uses cutting-edge technology to measure download speeds, upload speeds, ping latency, and jitter with precision. Get detailed connection analysis and performance insights in seconds.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-slate-900 dark:text-white">Comprehensive Network Diagnostics</h4>
                        <p>
                            Beyond basic speed testing, our internet speedometer provides complete network diagnostics including latency analysis, jitter measurements, and connection quality scoring. Perfect for troubleshooting connectivity issues and optimizing your home network.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}

function FAQItem({ question, answer }) {
    return (
        <details className="group p-6 rounded-xl border bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
            <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">{question}</h3>
                <HelpCircle className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{answer}</p>
        </details>
    );
}

function FAQItem({ question, answer }) {
    return (
        <div className="p-6 rounded-xl border transition-all bg-white border-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                {question}
            </h3>
            <p
                className="leading-relaxed pl-7"
                dangerouslySetInnerHTML={{ __html: answer }}
            />
        </div>
    );
}
