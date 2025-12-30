import React, { useState, useMemo } from 'react';
import { TrendingUp, Video, Gamepad2, BarChart3, AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';

const TABS = [
  { key: 'analysis', label: 'Connection Analysis', icon: BarChart3 },
  { key: 'video', label: 'Video Streaming', icon: Video },
  { key: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { key: 'insights', label: 'Performance', icon: TrendingUp },
];

const VIDEO_QUALITY_REQUIREMENTS = [
  { quality: '4K UHD', minSpeed: 25, platforms: ['Netflix', 'YouTube', 'Amazon Prime'], description: 'Ultra HD streaming' },
  { quality: '1080p Full HD', minSpeed: 5, platforms: ['All platforms'], description: 'Full HD streaming' },
  { quality: '720p HD', minSpeed: 3, platforms: ['YouTube', 'Hulu', 'Disney+'], description: 'HD streaming' },
  { quality: '480p SD', minSpeed: 1.5, platforms: ['Most platforms'], description: 'Standard definition' },
];

const GAMING_REQUIREMENTS = [
  { game: 'Competitive Gaming', minSpeed: 5, maxPing: 50, description: 'Fast-paced games (CS:GO, Valorant)' },
  { game: 'Casual Gaming', minSpeed: 3, maxPing: 100, description: 'Online gaming (Steam, Xbox, PS)' },
  { game: 'Mobile Gaming', minSpeed: 1, maxPing: 150, description: 'Mobile games (PUBG, Fortnite)' },
];

export default function TestInsightsTabs({
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  qualityScore,
  packetLoss,
  speedRatio,
  likelyType,
  theme = 'dark'
}) {
  const [activeTab, setActiveTab] = useState('analysis');
  const isDark = theme === 'dark';

  const metrics = useMemo(() => {
    const qScore =
      qualityScore ??
      Math.min(
        100,
        Math.max(0, (downloadSpeed / 100) * 100 - (ping / 100) * 10 - (jitter / 50) * 5)
      );

    const sRatio = speedRatio ?? (downloadSpeed / (uploadSpeed || 1)).toFixed(1);
    const cType =
      likelyType ||
      (downloadSpeed > 100
        ? 'Fiber/5G'
        : downloadSpeed > 50
          ? 'High-Speed'
          : downloadSpeed > 25
            ? 'Good'
            : downloadSpeed > 10
              ? 'Fair'
              : 'Slow');

    const pLoss = packetLoss ?? Math.max(0, (jitter / 100) * 5).toFixed(2);
    const videoQuality =
      VIDEO_QUALITY_REQUIREMENTS.find(v => downloadSpeed >= v.minSpeed) ||
      VIDEO_QUALITY_REQUIREMENTS[VIDEO_QUALITY_REQUIREMENTS.length - 1];

    const gamingPerformance =
      ping <= 50 ? 'Excellent' : ping <= 100 ? 'Good' : ping <= 150 ? 'Fair' : 'Poor';

    const uploadQuality =
      uploadSpeed >= 5 ? 'Excellent' : uploadSpeed >= 2 ? 'Good' : uploadSpeed >= 1 ? 'Fair' : 'Poor';

    return {
      qualityScore: Math.round(qScore),
      speedRatio: sRatio,
      connectionType: cType,
      packetLoss: pLoss,
      videoQuality,
      gamingPerformance,
      uploadQuality,
    };
  }, [downloadSpeed, uploadSpeed, ping, jitter, qualityScore, packetLoss, speedRatio, likelyType]);

  return (
    <div className="mt-6 sm:mt-8">
      {/* Tabs Navigation */}
      <nav
        className={`flex gap-1 p-1.5 rounded-xl mb-4 overflow-x-auto no-scrollbar scroll-smooth ${isDark
          ? 'bg-slate-800/50 border border-white/10'
          : 'bg-white border border-slate-200 shadow-sm'
          }`}
        role="tablist"
      >
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-label={`View ${tab.label}`}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg
                transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${isActive
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-blue-600 text-white shadow-md'
                  : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }
              `}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Panel Container */}
      <div
        className={`rounded-xl p-6 border transition-all duration-300 ${isDark
          ? 'bg-slate-800/50 border-white/10'
          : 'bg-white border-slate-200 shadow-lg'
          }`}
      >
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="animate-fadeIn">
            <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Full Technical Network Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                ['Quality Score', metrics.qualityScore, metrics.qualityScore >= 70 ? 'text-emerald-600' : metrics.qualityScore >= 40 ? 'text-amber-600' : 'text-red-600'],
                ['DL/UL Ratio', `${metrics.speedRatio}x`, 'text-blue-600'],
                ['Packet Loss', `${String(metrics.packetLoss).replace(/%/g, '')}%`, parseFloat(metrics.packetLoss) < 1 ? 'text-emerald-600' : 'text-amber-600'],
                ['Type', metrics.connectionType, 'text-purple-600'],
              ].map(([label, value, colorClass], i) => (
                <div
                  key={i}
                  className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-default flex flex-col justify-center min-h-[85px] sm:min-h-[100px] ${isDark
                    ? 'bg-slate-700/30 border-white/[0.08] hover:bg-slate-700/50 hover:border-white/10 shadow-lg'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200'
                    }`}
                >
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? colorClass : colorClass.replace('-400', '-600')}`}>{value}</div>
                  <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
                </div>
              ))}
            </div>
            <div className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 transition-all shadow-xl ${isDark
              ? 'bg-blue-900/40 border-blue-500/20 shadow-blue-900/20'
              : 'bg-blue-50/50 border-blue-200 shadow-blue-500/5'
              }`}>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                <Info className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-100/90' : 'text-blue-800'}`}>
                {metrics.qualityScore > 80
                  ? 'Excellent WiFi speed test results! Your connection is perfect for all activities including 4K streaming and low-latency competitive gaming.'
                  : metrics.qualityScore > 60
                    ? 'Good internet speed. Your connection is fast for most uses, but may experience occasional buffering with high-bitrate 4K content.'
                    : metrics.qualityScore > 40
                      ? 'Fair connection performance. You might experience lag during online gaming or buffering in Ultra HD video streaming.'
                      : 'Poor connection quality. Consider checking your WiFi router or internet service provider for better bandwidth performance.'}
              </p>
            </div>
          </div>
        )}

        {/* Video Streaming Tab */}
        {activeTab === 'video' && (
          <div className="space-y-3 animate-fadeIn">
            <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              WiFi Video & 4K Streaming Quality Standards
            </h3>
            {VIDEO_QUALITY_REQUIREMENTS.map((v, i) => {
              const ok = downloadSpeed >= v.minSpeed;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] ${isDark
                    ? ok
                      ? 'bg-emerald-900/30 border-emerald-500/50 hover:bg-emerald-900/40'
                      : 'bg-red-900/30 border-red-500/50 hover:bg-red-900/40'
                    : ok
                      ? 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100'
                      : 'bg-red-50 border-red-400 hover:bg-red-100'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-bold text-base ${isDark
                        ? 'text-white'
                        : ok ? 'text-emerald-800' : 'text-red-800'
                        }`}>{v.quality}</div>
                      <div className={`text-sm mt-0.5 ${isDark
                        ? 'text-slate-300'
                        : ok ? 'text-emerald-700' : 'text-red-700'
                        }`}>{v.description}</div>
                      <div className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        Requires: {v.minSpeed} Mbps
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${ok
                      ? isDark ? 'bg-emerald-500/30' : 'bg-emerald-200'
                      : isDark ? 'bg-red-500/30' : 'bg-red-200'
                      }`}>
                      {ok ? (
                        <CheckCircle className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-700'}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gaming Tab */}
        {activeTab === 'gaming' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className={`font-bold mb-4 text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Real-time Online Gaming & Lag Analysis
            </h3>
            {GAMING_REQUIREMENTS.map((g, i) => {
              const ok = downloadSpeed >= g.minSpeed && ping <= g.maxPing;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] ${isDark
                    ? ok
                      ? 'bg-emerald-900/30 border-emerald-500/50 hover:bg-emerald-900/40'
                      : 'bg-red-900/30 border-red-500/50 hover:bg-red-900/40'
                    : ok
                      ? 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100'
                      : 'bg-red-50 border-red-400 hover:bg-red-100'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-bold flex items-center gap-2 text-base ${isDark
                        ? 'text-white'
                        : ok ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                        <Gamepad2 className="w-4 h-4" />
                        {g.game}
                      </div>
                      <div className={`text-sm mt-0.5 ${isDark
                        ? 'text-slate-300'
                        : ok ? 'text-emerald-700' : 'text-red-700'
                        }`}>{g.description}</div>
                      <div className={`text-xs mt-2 flex gap-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        <span>Min Speed: {g.minSpeed} Mbps</span>
                        <span>Max Ping: {g.maxPing} ms</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${ok
                      ? isDark ? 'bg-emerald-500/30' : 'bg-emerald-200'
                      : isDark ? 'bg-red-500/30' : 'bg-red-200'
                      }`}>
                      {ok ? (
                        <CheckCircle className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-700'}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Performance/Insights Tab */}
        {activeTab === 'insights' && (
          <div className="animate-fadeIn">
            <h3 className={`font-bold mb-4 text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Zap className="w-5 h-5 text-amber-500" />
              Internet Speed & Bandwidth Summary
            </h3>
            <div className={`p-5 rounded-xl border-2 ${isDark
              ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
              : 'bg-gradient-to-br from-slate-50 to-white border-slate-300'
              }`}>
              <div className={`text-3xl font-bold mb-3 ${metrics.qualityScore >= 70
                ? 'text-emerald-600'
                : metrics.qualityScore >= 40
                  ? 'text-amber-600'
                  : 'text-red-600'
                }`}>
                {metrics.qualityScore}/100
                <span className={`text-sm font-normal ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Quality Score
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Download', value: `${Number(downloadSpeed).toFixed(2)} Mbps`, icon: '↓', color: 'text-emerald-600' },
                  { label: 'Upload', value: `${Number(uploadSpeed).toFixed(2)} Mbps`, icon: '↑', color: 'text-blue-600' },
                  { label: 'Ping', value: `${Math.round(ping)} ms`, icon: '◉', color: 'text-amber-600' },
                  { label: 'Jitter', value: `${Math.round(jitter)} ms`, icon: '~', color: 'text-purple-600' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${isDark
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                    <div className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className={item.color}>{item.icon}</span> {item.label}
                    </div>
                    <div className={`text-base md:text-lg font-bold mt-1 truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <strong>Connection Type:</strong> {metrics.connectionType}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <strong>Packet Loss:</strong> {String(metrics.packetLoss).replace('%%', '%').replace(/%$/, '')}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
