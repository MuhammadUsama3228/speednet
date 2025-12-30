"use client";
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SpeedChart({ downloadData, uploadData, theme, isVisible }) {
  const chartRef = useRef(null);

  const isDark = theme === 'dark';

  // Determine total points for the X-axis
  const totalPoints = downloadData.length + uploadData.length;
  // Pad upload data with nulls so it starts AFTER download finishes
  const paddedUploadData = [...Array(downloadData.length).fill(null), ...uploadData];

  // Generate labels 1..N
  // Use a max to ensure we always have at least some grid
  const labelCount = Math.max(totalPoints, 10);
  const labels = Array.from({ length: labelCount }, (_, i) => i + 1);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Download (Mbps)',
        data: downloadData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false, // Don't bridge gaps
      },
      {
        label: 'Upload (Mbps)',
        data: paddedUploadData,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: isDark ? '#94a3b8' : '#64748b',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: window.innerWidth < 640 ? 10 : 20,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
            weight: '600'
          }
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#ffffff' : '#000000',
        bodyColor: isDark ? '#e0e7ff' : '#374151',
        borderColor: isDark ? '#3b82f6' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (seconds)',
          color: isDark ? '#e0e7ff' : '#6b7280',
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#e0e7ff' : '#6b7280',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Speed (Mbps)',
          color: isDark ? '#e0e7ff' : '#6b7280',
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#e0e7ff' : '#6b7280',
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 0, // Disable animations for real-time updates
    },
  };

  if (!isVisible || (downloadData.length === 0 && uploadData.length === 0)) {
    return null;
  }

  return (
    <div className={`mt-6 p-5 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
      <h3 className={`font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Real-Time Speed Graph
      </h3>
      <div className="h-48 md:h-64 w-full">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
