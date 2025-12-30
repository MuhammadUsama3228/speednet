"use client";
import React, { useEffect, useRef } from 'react';
import { APP_STRINGS } from '../constants/strings';

export default function SpeedGauge({ value, maxValue = 100, label, unit, colorClass, theme, size: initialSize = 120 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const currentValueRef = useRef(0);
  const [size, setSize] = React.useState(initialSize);

  const isDark = theme === 'dark';

  // Adaptive sizing for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 380) {
        setSize(Math.min(initialSize, 100));
      } else if (window.innerWidth < 640) {
        setSize(Math.min(initialSize, 110));
      } else {
        setSize(initialSize);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialSize]);

  // Calculate dynamic unit and value
  const dynamicValue = APP_STRINGS.formatSpeedValue(value);
  const dynamicUnit = unit || APP_STRINGS.formatSpeedUnit(value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;

    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Enable high-quality text rendering
    ctx.imageSmoothingEnabled = true;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = (rect.width - 20) / 2;

    const animate = () => {
      // Smooth animation towards target value
      const diff = parseFloat(dynamicValue) - currentValueRef.current;
      const step = diff * 0.1; // Animation speed

      if (Math.abs(diff) > 0.01) {
        currentValueRef.current += step;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        currentValueRef.current = parseFloat(dynamicValue);
      }

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 6;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
      ctx.stroke();

      // Draw progress arc
      const progress = Math.min(value / maxValue, 1);
      const endAngle = -Math.PI / 2 + (progress * 2 * Math.PI); // Start from top

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.lineWidth = 6;
      ctx.strokeStyle = getColorFromClass(colorClass);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw center text (value)
      ctx.fillStyle = isDark ? '#ffffff' : '#111827';
      ctx.font = `bold ${Math.max(16, rect.width * 0.20)}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dynamicValue, centerX, centerY - rect.width * 0.10);

      // Draw unit (with more spacing)
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = `600 ${Math.max(12, rect.width * 0.14)}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillText(dynamicUnit, centerX, centerY + rect.width * 0.12);

      // Draw label (with more spacing from unit)
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = `500 ${Math.max(10, rect.width * 0.09)}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillText(label, centerX, centerY + rect.width * 0.28);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, maxValue, label, unit, colorClass, theme, size]);

  const getColorFromClass = (colorClass) => {
    const colorMap = {
      'text-green-400': '#22c55e',
      'text-sky-400': '#0ea5e9',
      'text-amber-400': '#f59e0b',
      'text-purple-400': '#a855f7',
      'text-red-400': '#ef4444',
      'text-blue-400': '#3b82f6',
    };
    return colorMap[colorClass] || '#3b82f6';
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="mb-2"
        aria-label={`${label}: ${APP_STRINGS.formatSpeed(value)}`}
      />
    </div>
  );
}
