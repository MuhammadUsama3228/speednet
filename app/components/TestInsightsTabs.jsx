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
      {/* Tabs */}
      <nav
        className={`flex gap-1 border-b mb-4 ${isDark ? 'border-white/10' : 'border-blue-200 bg-white'}`}
        role="tablist"
      >
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-md transition-all focus:outline-none ${
                activeTab === tab.key
                  ? isDark
                    ? 'border-b-4 border-blue-400 text-white bg-blue-900/40'
                    : 'border-b-4 border-blue-600 text-blue-900 bg-white shadow-md'
                  : isDark
                    ? 'text-blue-200/70 hover:text-white'
                    : 'text-gray-500 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Panel */}
      <div
        className={`rounded-xl p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-200 shadow-xl'}`}
      >
        {/* Analysis */}
        {activeTab === 'analysis' && (
          <div>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-blue-900'}`}>Connection Analysis</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                ['Quality Score', metrics.qualityScore],
                ['DL/UL Ratio', `${metrics.speedRatio}x`],
                ['Packet Loss', `${metrics.packetLoss}%`],
                ['Type', metrics.connectionType],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200 shadow-sm'}`}
                >
                  <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{value}</div>
                  <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>{label}</div>
                </div>
              ))}
            </div>
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-500/30 text-white' : 'bg-blue-100 border-blue-300 text-blue-900 shadow'}`}>Insights: {metrics.qualityScore > 80 ? 'Excellent connection for all activities.' : metrics.qualityScore > 60 ? 'Good for most uses, but may struggle with 4K streaming.' : metrics.qualityScore > 40 ? 'Fair, expect some issues with gaming/video.' : 'Poor, upgrade recommended.'}</div>
          </div>
        )}
        {/* Video */}
        {activeTab === 'video' && (
          <div className="space-y-3">
            {VIDEO_QUALITY_REQUIREMENTS.map((v, i) => {
              const ok = downloadSpeed >= v.minSpeed;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${isDark ? (ok ? 'bg-green-900/20 border-green-500/30 text-white' : 'bg-red-900/20 border-red-500/30 text-white') : (ok ? 'bg-green-50 border-green-300 text-green-900 shadow-sm' : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm')}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{v.quality}</div>
                      <div className="text-sm opacity-80">{v.description}</div>
                    </div>
                    {ok ? (
                      <CheckCircle className="text-emerald-600" />
                    ) : (
                      <AlertCircle className="text-rose-600" />
                    )}
                  </div>
                  <div className="mt-2 text-xs opacity-80">{ok ? 'Supported' : 'Not supported at current speed.'}</div>
                </div>
              );
            })}
          </div>
        )}
        {/* Gaming */}
        {activeTab === 'gaming' && (
          <div className="space-y-4">
            {GAMING_REQUIREMENTS.map((g, i) => {
              const ok = downloadSpeed >= g.minSpeed && ping <= g.maxPing;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${isDark ? (ok ? 'bg-green-900/20 border-green-500/30 text-white' : 'bg-red-900/20 border-red-500/30 text-white') : (ok ? 'bg-green-50 border-green-300 text-green-900 shadow-sm' : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm')}`}
                >
                  <div className="font-semibold">{g.game}</div>
                  <div className="text-sm opacity-80">{g.description}</div>
                  <div className="mt-2 text-xs opacity-80">{ok ? 'Great experience expected.' : 'Performance may be limited.'}</div>
                </div>
              );
            })}
          </div>
        )}
        {/* Insights */}
        {activeTab === 'insights' && (
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-900/30 border-blue-500/50 text-white' : 'bg-blue-50 border-blue-300 text-blue-900 shadow'}`}>
            <h4 className="font-bold mb-2">Summary</h4>
            <p className="text-sm">Overall quality score: <strong>{metrics.qualityScore}/100</strong></p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Download: <span className="font-semibold">{downloadSpeed} Mbps</span></li>
              <li>Upload: <span className="font-semibold">{uploadSpeed} Mbps</span></li>
              <li>Ping: <span className="font-semibold">{ping} ms</span></li>
              <li>Jitter: <span className="font-semibold">{jitter} ms</span></li>
              <li>Packet Loss: <span className="font-semibold">{metrics.packetLoss}%</span></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
