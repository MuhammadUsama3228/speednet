"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Activity, Globe, MapPin, Rocket, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import SpeedTest from '@cloudflare/speedtest';
import { APP_STRINGS, API_ENDPOINTS, SPEEDTEST_CONFIG } from './constants/strings';
import { useTheme } from './context/ThemeContext';
import ResultCard from './components/ResultCard';
import SpeedHero from './components/SpeedHero';

// Dynamic imports for improved FCP / LCP (non-critical components)
const TestHistory = dynamic(() => import('./components/TestHistory'), { ssr: false });
const AnalyzingPill = dynamic(() => import('./components/AnalyzingPill'), { ssr: false });

export default function SpeedTestComponent() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [liveSpeed, setLiveSpeed] = useState(0);
  const { theme } = useTheme();
  const [history, setHistory] = useState([]);

  const speedTestRef = useRef(null);
  const stageIntervalRef = useRef(null);

  useEffect(() => {
    // History init logic remains, theme logic removed (handled by context)
    try {
      const savedHistory = JSON.parse(localStorage.getItem('speedTestHistory') || '[]');
      setHistory(savedHistory);
    } catch (e) {
      console.error('Failed to load history', e);
    }

    fetchIPInfo();
  }, []);

  // Theme toggle function removed

  const fetchIPInfo = async () => {
    try {
      // Call your own API route (no CORS issues!)
      const response = await fetch(API_ENDPOINTS.IP_INFO);

      if (response.ok) {
        const data = await response.json();
        setIp(data.ip || '');
        setLocation(APP_STRINGS.formatLocation(data.city, data.country_name) || '');
        return;
      }
    } catch (error) {
      console.error('IP API failed:', error);
    }

    // Fallback: Cloudflare trace (always works, no CORS)
    try {
      const response = await fetch(API_ENDPOINTS.CLOUDFLARE_TRACE);
      const text = await response.text();
      const lines = text.split('\n');
      const data = {};

      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) data[key] = value.trim();
      });

      setIp(data.ip || 'Unknown');
      setLocation(data.loc || 'Unknown'); // Country code only
    } catch (error) {
      console.error('Fallback also failed:', error);
      setIp(APP_STRINGS.IP_ERROR);
      setLocation(APP_STRINGS.LOCATION_UNKNOWN);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('speedTestHistory');
  };

  const runTest = () => {
    setTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setLiveSpeed(0);
    setStage(APP_STRINGS.STAGE_INIT);

    console.clear();
    console.log(`%c${APP_STRINGS.CONSOLE_START}`, 'color: #00ff00; font-size: 18px; font-weight: bold');
    console.log(`%c${APP_STRINGS.CONSOLE_ENGINE}`, 'color: #ffaa00; font-size: 14px');
    console.log('');

    const speedTest = new SpeedTest(SPEEDTEST_CONFIG);
    speedTestRef.current = speedTest;

    speedTest.onResultsChange = () => {
      try {
        const downloadBw = speedTest.results.getDownloadBandwidth();
        const uploadBw = speedTest.results.getUploadBandwidth();
        const latency = speedTest.results.getUnloadedLatency();

        const dlMbps = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
        const ulMbps = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
        const pingMs = latency ? Math.round(latency) : 0;

        if (dlMbps > 0) setDownloadSpeed(parseFloat(dlMbps));
        if (ulMbps > 0) setUploadSpeed(parseFloat(ulMbps));

        // Lock Ping: only update during initial Ping stage or if not yet set
        const downloadPoints = speedTest.results.getDownloadBandwidthPoints()?.length || 0;
        if (pingMs > 0 && downloadPoints === 0) {
          setPing(pingMs);
        }

        const currentLive = dlMbps > ulMbps ? dlMbps : ulMbps;
        if (currentLive > 0) setLiveSpeed(parseFloat(currentLive));

        // Simplified progress calculation if needed elsewhere, but no longer showing the bar
        const uploadPoints = speedTest.results.getUploadBandwidthPoints()?.length || 0;
        const totalPoints = downloadPoints + uploadPoints;
        setProgress(Math.min(99, Math.round(totalPoints * 3)));
      } catch (e) {
        console.warn('Error in onResultsChange:', e);
      }
    };

    let currentStage = APP_STRINGS.STAGE_LATENCY;
    setStage(currentStage);

    stageIntervalRef.current = setInterval(() => {
      try {
        const latency = speedTest.results.getUnloadedLatency();
        const downloadBw = speedTest.results.getDownloadBandwidth();
        const uploadPoints = speedTest.results.getUploadBandwidthPoints()?.length || 0; // Define uploadPoints here

        if (latency > 0 && currentStage === APP_STRINGS.STAGE_LATENCY) {
          currentStage = APP_STRINGS.STAGE_DOWNLOAD;
          setStage(currentStage);
        } else if (downloadBw > 0 && currentStage === APP_STRINGS.STAGE_DOWNLOAD) {
          currentStage = APP_STRINGS.STAGE_UPLOAD;
          setStage(currentStage);
        } else if (uploadPoints > 15 && currentStage === APP_STRINGS.STAGE_UPLOAD) {
          // Transition to Jitter stage once upload is mostly done based on points
          currentStage = APP_STRINGS.STAGE_JITTER;
          setStage(currentStage);
        }
      } catch (e) { }
    }, 1000);

    speedTest.onFinish = (results) => {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

      try {
        const downloadBw = results.getDownloadBandwidth();
        const uploadBw = results.getUploadBandwidth();
        const latency = results.getUnloadedLatency();

        // ============================================
        // ACCURATE JITTER CALCULATION
        // ============================================

        let finalJitter = 0;

        // Try to get real jitter from Cloudflare first
        const realJitter = results.getUnloadedJitter();

        if (realJitter && realJitter > 0) {
          // We got real jitter from packet loss measurement
          finalJitter = Math.round(realJitter);
        } else {
          // Calculate accurate jitter from latency measurements
          const latencyPoints = results.getUnloadedLatencyPoints() || [];

          if (latencyPoints.length > 2) {
            // Method 1: Average Consecutive Differences (Most Accurate for Jitter)
            let consecutiveDiffs = [];
            for (let i = 1; i < latencyPoints.length; i++) {
              const diff = Math.abs(latencyPoints[i].latency - latencyPoints[i - 1].latency);
              consecutiveDiffs.push(diff);
            }

            // Average of consecutive differences
            const avgConsecutiveDiff = consecutiveDiffs.reduce((a, b) => a + b, 0) / consecutiveDiffs.length;

            // Method 2: Standard Deviation (for comparison)
            const latencies = latencyPoints.map(p => p.latency);
            const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            const variance = latencies.reduce((sum, l) => sum + Math.pow(l - avgLatency, 2), 0) / latencies.length;
            const stdDeviation = Math.sqrt(variance);

            // Use the average of both methods for better accuracy
            // Consecutive diff is more accurate for jitter, but std dev catches outliers
            const calculatedJitter = (avgConsecutiveDiff * 0.7) + (stdDeviation * 0.3);

            finalJitter = Math.round(calculatedJitter);

            // Ensure jitter is not higher than ping (sanity check)
            if (finalJitter > latency) {
              finalJitter = Math.round(latency * 0.1); // Cap at 10% of latency
            }
          }
        }

        const finalDl = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
        const finalUl = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
        const finalPing = latency ? Math.round(latency) : 0;

        setDownloadSpeed(parseFloat(finalDl));
        setUploadSpeed(parseFloat(finalUl));
        setPing(finalPing);
        setJitter(finalJitter);
        setProgress(100);
        setStage(APP_STRINGS.STAGE_COMPLETE);
        setLiveSpeed(0);
        setTesting(false);

        console.log(`%c${APP_STRINGS.CONSOLE_COMPLETE}`, 'color: #00ff00; font-size: 16px; font-weight: bold');
        console.log(`${APP_STRINGS.DOWNLOAD_LABEL}: ${finalDl} ${APP_STRINGS.SPEED_UNIT} | ${APP_STRINGS.UPLOAD_LABEL}: ${finalUl} ${APP_STRINGS.SPEED_UNIT} | ${APP_STRINGS.PING_LABEL}: ${finalPing} ${APP_STRINGS.PING_UNIT} | Jitter: ${finalJitter} ${APP_STRINGS.PING_UNIT}`);

        // Save result to history
        const newResult = {
          date: new Date().toLocaleString(),
          dl: finalDl,
          ul: finalUl,
          ping: finalPing,
          jitter: finalJitter,
          provider: 'Scanpings.net'
        };
        const updatedHistory = [newResult, ...history].slice(0, 50); // Keep last 50
        setHistory(updatedHistory);
        localStorage.setItem('speedTestHistory', JSON.stringify(updatedHistory));

      } catch (e) {
        console.error('Error in onFinish:', e);
        setStage(APP_STRINGS.STAGE_COMPLETE);
        setTesting(false);
      }
    };

    speedTest.onError = (error) => {
      // Ignore packet loss measurement errors (expected in localhost)
      const errorMsg = error?.message || error?.toString() || '';
      if (errorMsg.includes('packet loss') || errorMsg.includes('turn server') || errorMsg.includes('turn-creds')) {
        console.log('ℹ️ Packet loss measurement skipped (jitter calculated from latency)');
        return; // Don't treat as failure
      }

      console.error(`${APP_STRINGS.CONSOLE_FAILED}`, error);
      setStage(APP_STRINGS.STAGE_FAILED);
      setTesting(false);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };

    speedTest.play();
  };

  return (
    <main className={`min-h-screen pt-20 p-4 flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      }`}>

      <div className="w-full max-w-3xl lg:max-w-[851px] mx-auto">
        {/* Header Section */}
        <SpeedHero theme={theme} />
        {/* Start Button Removed - Using Main Button Inside Card */}

        {/* Main Card */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border transition-colors duration-300 ${theme === 'dark'
          ? 'bg-white/10 border-white/20 shadow-black/20'
          : 'bg-white/70 border-white/60 shadow-blue-500/10'
          }`}>

          {/* IP & Location */}
          <section aria-label="Connection Information" className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b text-sm ${theme === 'dark' ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'
            }`}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{APP_STRINGS.IP_LABEL} <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{ip || APP_STRINGS.IP_DETECTING}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{location || APP_STRINGS.LOCATION_DETECTING}</span>
            </div>
          </section>

          {/* Live Speed */}
          {testing && liveSpeed > 0 && (
            <div className="text-center mb-8" aria-live="polite">
              <div className={`text-6xl font-bold animate-pulse ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>
                {liveSpeed}
              </div>
              <div className={`text-lg mt-2 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{APP_STRINGS.LIVE_INDICATOR}</div>
            </div>
          )}

          {/* Results Grid */}
          <section aria-label="Live Speed Test Results" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ResultCard
              icon={Download}
              value={downloadSpeed > 0 ? downloadSpeed.toFixed(2) : '0.00'}
              label={APP_STRINGS.DOWNLOAD_LABEL}
              unit={APP_STRINGS.SPEED_UNIT}
              colorClass="text-green-400"
              theme={theme}
            />
            <ResultCard
              icon={Upload}
              value={uploadSpeed > 0 ? uploadSpeed.toFixed(2) : '0.00'}
              label={APP_STRINGS.UPLOAD_LABEL}
              unit={APP_STRINGS.SPEED_UNIT}
              colorClass="text-sky-400"
              theme={theme}
            />
            <ResultCard
              icon={Activity}
              value={ping > 0 ? ping : '0'}
              label={APP_STRINGS.PING_LABEL}
              unit={APP_STRINGS.PING_UNIT}
              colorClass="text-amber-400"
              theme={theme}
            />
            <ResultCard
              icon={Activity}
              value={jitter > 0 ? jitter : '0'}
              label={APP_STRINGS.JITTER_LABEL || 'Jitter'}
              unit={APP_STRINGS.PING_UNIT}
              colorClass="text-purple-400"
              theme={theme}
            />
          </section>

          {/* Analyzing Indicator */}
          {testing && <AnalyzingPill theme={theme} />}
          {/* Test Button */}
          <motion.button
            onClick={runTest}
            disabled={testing}
            whileHover={!testing ? { scale: 1.05, filter: "brightness(1.1)" } : {}}
            whileTap={!testing ? { scale: 0.95 } : {}}
            animate={!testing ? {
              boxShadow: ["0px 0px 0px 0px rgba(16, 185, 129, 0.7)", "0px 0px 0px 10px rgba(16, 185, 129, 0)"],
              transition: { duration: 2, repeat: Infinity }
            } : {}}
            aria-label={testing ? 'Test in progress' : 'Start Speed Test'}
            className={`giant-start-button flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg text-white mb-6 ${testing
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-[1.02] active:scale-95'
              }`}
          >
            {testing ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                {APP_STRINGS.BUTTON_TESTING}
              </>
            ) : (
              <>
                <Rocket className="w-8 h-8" />
                Test My Speed Now
              </>
            )}
          </motion.button>

          {/* Test History */}
          <TestHistory
            history={history}
            clearHistory={clearHistory}
            theme={theme}
          />

          {/* Results Summary */}
          {!testing && downloadSpeed > 0 && (
            <div className={`mt-6 p-5 rounded-2xl border ${theme === 'dark'
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-green-50 border-green-200'
              }`} role="status">
              <h3 className={`font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
                {APP_STRINGS.RESULTS_TITLE}
              </h3>
              <div className={`text-sm space-y-2 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                <p>• {APP_STRINGS.RESULTS_DOWNLOAD} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatSpeedWithBytes(downloadSpeed)}</span></p>
                <p>• {APP_STRINGS.RESULTS_UPLOAD} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatSpeedWithBytes(uploadSpeed)}</span></p>
                <p>• {APP_STRINGS.RESULTS_LATENCY} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatPing(ping)}</span> <span className="opacity-50">|</span> Jitter: <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatPing(jitter)}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content removed (moved to About page) */}

        {/* Footer */}
        <footer className={`text-center mt-12 mb-8 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`}>
          <p>{APP_STRINGS.FOOTER_TEXT}</p>
        </footer>
      </div>
    </main>
  );
}
