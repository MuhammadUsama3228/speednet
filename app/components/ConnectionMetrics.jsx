"use client";
import React from 'react';
import { AlertTriangle, TrendingUp, Info, Zap, Gauge, Network, Wifi, CheckCircle } from 'lucide-react';

export default function ConnectionMetrics({ downloadSpeed, uploadSpeed, ping, jitter, theme = 'light' }) {
  const isDark = theme === 'dark';
  
  const qualityScore = Math.max(
    100 - (ping / 2) - (jitter * 2) - (downloadSpeed < 50 ? 20 : 0) - (uploadSpeed < 10 ? 20 : 0),
    0
  );
  
  const qualityInfo =
    qualityScore > 80
      ? { label: 'Excellent', color: isDark ? 'text-emerald-400' : 'text-emerald-700', bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50', borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-300', iconBg: isDark ? 'bg-emerald-900/40' : 'bg-emerald-100' }
      : qualityScore > 60
      ? { label: 'Good', color: isDark ? 'text-blue-400' : 'text-blue-700', bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50', borderColor: isDark ? 'border-blue-500/30' : 'border-blue-300', iconBg: isDark ? 'bg-blue-900/40' : 'bg-blue-100' }
      : qualityScore > 40
      ? { label: 'Fair', color: isDark ? 'text-amber-400' : 'text-amber-700', bgColor: isDark ? 'bg-amber-900/20' : 'bg-amber-50', borderColor: isDark ? 'border-amber-500/30' : 'border-amber-300', iconBg: isDark ? 'bg-amber-900/40' : 'bg-amber-100' }
      : { label: 'Poor', color: isDark ? 'text-red-400' : 'text-red-700', bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50', borderColor: isDark ? 'border-red-500/30' : 'border-red-300', iconBg: isDark ? 'bg-red-900/40' : 'bg-red-100' };
  
  const estimatedPacketLoss = Math.max(
    Math.round((jitter / (downloadSpeed + uploadSpeed + 1)) * 100),
    0
  );
  
  const speedRatio = downloadSpeed / (uploadSpeed || 1);
  const connectionType = downloadSpeed > 1000 ? 'Fiber' :
    downloadSpeed > 100 ? 'Cable' :
    downloadSpeed > 50 ? 'DSL' :
    downloadSpeed > 25 ? '4G/5G' : 'Slow';
  
  const connectionInfo = {
    'Fiber': { color: isDark ? 'text-emerald-400' : 'text-emerald-700', bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50', borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-300', iconBg: isDark ? 'bg-emerald-900/40' : 'bg-emerald-100' },
    'Cable': { color: isDark ? 'text-blue-400' : 'text-blue-700', bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50', borderColor: isDark ? 'border-blue-500/30' : 'border-blue-300', iconBg: isDark ? 'bg-blue-900/40' : 'bg-blue-100' },
    'DSL': { color: isDark ? 'text-purple-400' : 'text-purple-700', bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50', borderColor: isDark ? 'border-purple-500/30' : 'border-purple-300', iconBg: isDark ? 'bg-purple-900/40' : 'bg-purple-100' },
    '4G/5G': { color: isDark ? 'text-orange-400' : 'text-orange-700', bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-50', borderColor: isDark ? 'border-orange-500/30' : 'border-orange-300', iconBg: isDark ? 'bg-orange-900/40' : 'bg-orange-100' },
    'Slow': { color: isDark ? 'text-red-400' : 'text-red-700', bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50', borderColor: isDark ? 'border-red-500/30' : 'border-red-300', iconBg: isDark ? 'bg-red-900/40' : 'bg-red-100' },
  };

  const packetLossInfo = estimatedPacketLoss > 5
    ? { color: isDark ? 'text-red-400' : 'text-red-700', bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50', borderColor: isDark ? 'border-red-500/30' : 'border-red-300', iconBg: isDark ? 'bg-red-900/40' : 'bg-red-100' }
    : estimatedPacketLoss > 1
    ? { color: isDark ? 'text-orange-400' : 'text-orange-700', bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-50', borderColor: isDark ? 'border-orange-500/30' : 'border-orange-300', iconBg: isDark ? 'bg-orange-900/40' : 'bg-orange-100' }
    : { color: isDark ? 'text-emerald-400' : 'text-emerald-700', bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50', borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-300', iconBg: isDark ? 'bg-emerald-900/40' : 'bg-emerald-100' };

  const speedRatioInfo = speedRatio > 5
    ? { color: isDark ? 'text-emerald-400' : 'text-emerald-700', bgColor: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50', borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-300', iconBg: isDark ? 'bg-emerald-900/40' : 'bg-emerald-100' }
    : speedRatio > 2
    ? { color: isDark ? 'text-blue-400' : 'text-blue-700', bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50', borderColor: isDark ? 'border-blue-500/30' : 'border-blue-300', iconBg: isDark ? 'bg-blue-900/40' : 'bg-blue-100' }
    : { color: isDark ? 'text-orange-400' : 'text-orange-700', bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-50', borderColor: isDark ? 'border-orange-500/30' : 'border-orange-300', iconBg: isDark ? 'bg-orange-900/40' : 'bg-orange-100' };

  const insights = [];
  if (ping > 100) insights.push({ type: 'warning', message: 'High ping may affect gaming and video calls.', icon: AlertTriangle });
  if (jitter > 30) insights.push({ type: 'warning', message: 'High jitter can cause instability in streaming.', icon: AlertTriangle });
  if (downloadSpeed < 25) insights.push({ type: 'warning', message: 'Download speed is below average.', icon: AlertTriangle });
  if (uploadSpeed < 5) insights.push({ type: 'warning', message: 'Upload speed is below average.', icon: AlertTriangle });
  if (qualityScore > 80) insights.push({ type: 'success', message: 'Your connection is excellent for most online activities.', icon: CheckCircle });

  return (
    <div className={`mt-8 p-6 sm:p-8 rounded-2xl border-2 transition-all ${
      isDark
        ? 'bg-white/5 border-white/10'
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 border-slate-400 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b-2" style={{
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(203, 213, 225)'
      }}>
        <div className={`p-2.5 rounded-lg ${isDark ? 'bg-blue-900/40' : 'bg-blue-200'}`}>
          <Wifi className={`w-6 h-6 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
        </div>
        <h3 className={`font-bold text-lg sm:text-xl ${isDark ? 'text-white' : 'text-black'}`}>
          Connection Analysis
        </h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Quality Score Card */}
        <div className={`p-5 rounded-xl border-2 transition-all ${qualityInfo.bgColor} ${isDark ? qualityInfo.borderColor : 'border-gray-300'} shadow-sm hover:shadow-md`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-lg ${qualityInfo.iconBg}`}>
              <Gauge className={`w-5 h-5 ${qualityInfo.color}`} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${qualityInfo.color} ${qualityInfo.bgColor}`}>
              {qualityInfo.label}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {Math.round(qualityScore)}
          </div>
          <div className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
            Quality Score
          </div>
          <div className={`text-xs mt-3 pt-3 border-t ${isDark ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'}`}>
            Overall connection quality
          </div>
        </div>

        {/* Packet Loss Card */}
        <div className={`p-5 rounded-xl border-2 transition-all ${packetLossInfo.bgColor} ${isDark ? packetLossInfo.borderColor : 'border-gray-300'} shadow-sm hover:shadow-md`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-lg ${packetLossInfo.iconBg}`}>
              <AlertTriangle className={`w-5 h-5 ${packetLossInfo.color}`} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              estimatedPacketLoss > 5 ? 'text-red-700 bg-red-100' : estimatedPacketLoss > 1 ? 'text-orange-700 bg-orange-100' : 'text-emerald-700 bg-emerald-100'
            } ${isDark ? 'text-white/90' : ''}`}>
              {estimatedPacketLoss > 1 ? 'Alert' : 'Good'}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {estimatedPacketLoss}%
          </div>
          <div className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
            Est. Packet Loss
          </div>
          <div className={`text-xs mt-3 pt-3 border-t ${isDark ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'}`}>
            Data loss estimation
          </div>
        </div>

        {/* Speed Ratio Card */}
        <div className={`p-5 rounded-xl border-2 transition-all ${speedRatioInfo.bgColor} ${isDark ? speedRatioInfo.borderColor : 'border-gray-300'} shadow-sm hover:shadow-md`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-lg ${speedRatioInfo.iconBg}`}>
              <TrendingUp className={`w-5 h-5 ${speedRatioInfo.color}`} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${speedRatioInfo.color} ${speedRatioInfo.bgColor}`}>
              {speedRatio > 5 ? 'Balanced' : speedRatio > 2 ? 'Asymmetric' : 'Unbalanced'}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            1:{Math.round(speedRatio) || '∞'}
          </div>
          <div className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
            Download/Upload Ratio
          </div>
          <div className={`text-xs mt-3 pt-3 border-t ${isDark ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'}`}>
            Speed proportion
          </div>
        </div>

        {/* Connection Type Card */}
        <div className={`p-5 rounded-xl border-2 transition-all ${connectionInfo[connectionType].bgColor} ${isDark ? connectionInfo[connectionType].borderColor : 'border-gray-300'} shadow-sm hover:shadow-md`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-lg ${connectionInfo[connectionType].iconBg}`}>
              <Network className={`w-5 h-5 ${connectionInfo[connectionType].color}`} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${connectionInfo[connectionType].color} ${connectionInfo[connectionType].bgColor}`}>
              {connectionType}
            </span>
          </div>
          <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {connectionType}
          </div>
          <div className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
            Connection Type
          </div>
          <div className={`text-xs mt-3 pt-3 border-t ${isDark ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'}`}>
            Detected technology
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <div className={`flex items-center gap-2 font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Zap className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
            Performance Insights
          </div>
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 flex items-start gap-3 transition-all ${
                  insight.type === 'success'
                    ? isDark
                      ? 'bg-emerald-900/20 border-emerald-500/30'
                      : 'bg-emerald-100 border-emerald-400 shadow-sm'
                    : insight.type === 'warning'
                    ? isDark
                      ? 'bg-orange-900/20 border-orange-500/30'
                      : 'bg-orange-100 border-orange-400 shadow-sm'
                    : isDark
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-blue-100 border-blue-400 shadow-sm'
                }`}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  insight.type === 'success'
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                    : insight.type === 'warning'
                    ? isDark ? 'text-orange-400' : 'text-orange-700'
                    : isDark ? 'text-blue-400' : 'text-blue-700'
                }`} />
                <span className={`text-sm font-semibold ${
                  insight.type === 'success'
                    ? isDark ? 'text-emerald-300' : 'text-emerald-900'
                    : insight.type === 'warning'
                    ? isDark ? 'text-orange-300' : 'text-orange-900'
                    : isDark ? 'text-blue-300' : 'text-blue-900'
                }`}>
                  {insight.message}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
