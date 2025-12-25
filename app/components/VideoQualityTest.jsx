"use client";
import React from 'react';
import { Monitor, Smartphone, Tv, Gamepad2 } from 'lucide-react';

export default function VideoQualityTest({ downloadSpeed, theme }) {
  const isDark = theme === 'dark';

  if (downloadSpeed <= 0) return null;

  const getVideoQualities = (speed) => {
    const qualities = [
      {
        name: '4K UHD',
        minSpeed: 25,
        recommended: speed >= 25,
        icon: Tv,
        description: 'Ultra HD streaming (Netflix, YouTube)',
        platforms: ['Netflix', 'YouTube', 'Amazon Prime']
      },
      {
        name: '1080p HD',
        minSpeed: 5,
        recommended: speed >= 5,
        icon: Monitor,
        description: 'Full HD streaming',
        platforms: ['All major platforms']
      },
      {
        name: '720p HD',
        minSpeed: 3,
        recommended: speed >= 3,
        icon: Smartphone,
        description: 'HD streaming on multiple devices',
        platforms: ['YouTube', 'Hulu', 'Disney+']
      },
      {
        name: '480p SD',
        minSpeed: 1.5,
        recommended: speed >= 1.5,
        icon: Smartphone,
        description: 'Standard definition',
        platforms: ['Most platforms']
      },
      {
        name: 'Gaming',
        minSpeed: 3,
        recommended: speed >= 3,
        icon: Gamepad2,
        description: 'Online gaming performance',
        platforms: ['Steam', 'Xbox Live', 'PlayStation Network']
      }
    ];

    return qualities.map(quality => ({
      ...quality,
      status: speed >= quality.minSpeed ? 'recommended' : 'not-recommended'
    }));
  };

  const qualities = getVideoQualities(downloadSpeed);

  return (
    <div className={`mt-6 p-5 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
      <h3 className={`font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Video Streaming Quality
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qualities.map((quality, index) => {
          const IconComponent = quality.icon;
          const isRecommended = quality.recommended;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                isRecommended
                  ? isDark
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-green-50 border-green-200'
                  : isDark
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconComponent
                  className={`w-5 h-5 ${
                    isRecommended ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {quality.name}
                </h4>
              </div>

              <p className={`text-sm mb-2 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                {quality.description}
              </p>

              <div className={`text-xs mb-2 ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
                Min: {quality.minSpeed} Mbps
              </div>

              <div className={`text-xs ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                <span className="font-medium">Platforms:</span> {quality.platforms.join(', ')}
              </div>

              <div className={`mt-2 text-xs font-medium ${
                isRecommended ? 'text-green-600' : 'text-red-600'
              }`}>
                {isRecommended ? '✓ Recommended' : '✗ Not recommended'}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 p-3 rounded-lg text-sm ${
        isDark ? 'bg-blue-500/10 text-blue-200' : 'bg-blue-50 text-blue-800'
      }`}>
        <strong>Note:</strong> These recommendations are based on your download speed.
        Actual streaming quality may vary based on device, network congestion, and platform settings.
      </div>
    </div>
  );
}
