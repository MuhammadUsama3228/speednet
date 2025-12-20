"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Download, Upload, Activity, MapPin, Globe, CheckCircle, Moon, Sun } from 'lucide-react';
import SpeedTest from '@cloudflare/speedtest';
import { APP_STRINGS, API_ENDPOINTS, SPEEDTEST_CONFIG } from './constants/strings';

export default function SpeedTestComponent() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [history, setHistory] = useState([]);

  const speedTestRef = useRef(null);
  const stageIntervalRef = useRef(null);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    // Load history
    try {
      const savedHistory = JSON.parse(localStorage.getItem('speedTestHistory') || '[]');
      setHistory(savedHistory);
    } catch (e) {
      console.error('Failed to load history', e);
    }

    fetchIPInfo();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const fetchIPInfo = async () => {
    // Try primary API
    try {
      const response = await fetch(API_ENDPOINTS.IP_PRIMARY);
      if (response.ok) {
        const data = await response.json();
        setIp(data.ip || '');
        setLocation(APP_STRINGS.formatLocation(data.city, data.country_name) || '');
        return;
      }
    } catch (error) {
      console.log('Primary IP API failed, trying fallback...');
    }

    // Fallback to ip-api
    try {
      const response = await fetch(API_ENDPOINTS.IP_FALLBACK);
      if (response.ok) {
        const data = await response.json();
        setIp(data.query || '');
        setLocation(APP_STRINGS.formatLocation(data.city, data.country) || '');
        return;
      }
    } catch (error) {
      console.log('Fallback IP API also failed');
    }

    // Last resort - use Cloudflare trace
    try {
      const response = await fetch(API_ENDPOINTS.CLOUDFLARE_TRACE);
      const text = await response.text();
      const ipMatch = text.match(/ip=(.+)/);
      const locMatch = text.match(/loc=(.+)/);
      if (ipMatch) setIp(ipMatch[1]);
      if (locMatch) setLocation(locMatch[1]);
    } catch (error) {
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
        if (pingMs > 0) setPing(pingMs);

        const currentLive = dlMbps > ulMbps ? dlMbps : ulMbps;
        if (currentLive > 0) setLiveSpeed(parseFloat(currentLive));

        const downloadPoints = speedTest.results.getDownloadBandwidthPoints()?.length || 0;
        const uploadPoints = speedTest.results.getUploadBandwidthPoints()?.length || 0;
        const totalPoints = downloadPoints + uploadPoints;
        setProgress(Math.min(99, Math.round(totalPoints * 3)));
      } catch (e) {
        // Ignore errors during update
      }
    };

    let currentStage = APP_STRINGS.STAGE_LATENCY;
    setStage(currentStage);

    stageIntervalRef.current = setInterval(() => {
      try {
        const latency = speedTest.results.getUnloadedLatency();
        const downloadBw = speedTest.results.getDownloadBandwidth();

        if (latency > 0 && currentStage === APP_STRINGS.STAGE_LATENCY) {
          currentStage = APP_STRINGS.STAGE_DOWNLOAD;
          setStage(currentStage);
        } else if (downloadBw > 0 && currentStage === APP_STRINGS.STAGE_DOWNLOAD) {
          currentStage = APP_STRINGS.STAGE_UPLOAD;
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

        const finalDl = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
        const finalUl = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
        const finalPing = latency ? Math.round(latency) : 0;

        setDownloadSpeed(parseFloat(finalDl));
        setUploadSpeed(parseFloat(finalUl));
        setPing(finalPing);
        setProgress(100);
        setStage(APP_STRINGS.STAGE_COMPLETE);
        setLiveSpeed(0);
        setTesting(false);

        console.log(`%c${APP_STRINGS.CONSOLE_COMPLETE}`, 'color: #00ff00; font-size: 16px; font-weight: bold');
        console.log(`${APP_STRINGS.DOWNLOAD_LABEL}: ${finalDl} ${APP_STRINGS.SPEED_UNIT} | ${APP_STRINGS.UPLOAD_LABEL}: ${finalUl} ${APP_STRINGS.SPEED_UNIT} | ${APP_STRINGS.PING_LABEL}: ${finalPing} ${APP_STRINGS.PING_UNIT}`);

        // Save result to history
        const newResult = {
          date: new Date().toLocaleString(),
          dl: finalDl,
          ul: finalUl,
          ping: finalPing,
          provider: 'Cloudflare'
        };
        const updatedHistory = [newResult, ...history].slice(0, 50); // Keep last 50
        setHistory(updatedHistory);
        localStorage.setItem('speedTestHistory', JSON.stringify(updatedHistory));

      } catch (e) {
        setStage(APP_STRINGS.STAGE_COMPLETE);
        setTesting(false);
      }
    };

    speedTest.onError = (error) => {
      console.error(`${APP_STRINGS.CONSOLE_FAILED}`, error);
      setStage(APP_STRINGS.STAGE_FAILED);
      setTesting(false);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  };

  return (
    <main className={`min-h-screen p-4 flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      }`}>

      {/* Theme Switcher Button */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 ${theme === 'dark'
          ? 'bg-white/10 text-yellow-400 hover:bg-white/20'
          : 'bg-white text-slate-700 shadow-xl hover:bg-gray-100'
          }`}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="w-full max-w-2xl relative">

        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wifi className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} aria-hidden="true" />
            <h1 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.HEADER_TITLE}</h1>
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>{APP_STRINGS.HEADER_SUBTITLE}</p>
        </header>

        {/* Main Card */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border transition-colors duration-300 ${theme === 'dark'
          ? 'bg-white/10 border-white/20 shadow-black/20'
          : 'bg-white/70 border-white/60 shadow-blue-500/10'
          }`}>

          {/* IP & Location */}
          <section aria-label="Connection Information" className={`flex justify-between items-center mb-8 pb-6 border-b text-sm ${theme === 'dark' ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'
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
          <section aria-label="Speed Test Results" className="grid grid-cols-3 gap-4 mb-8">
            {/* Download */}
            <div className={`rounded-2xl p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <Download className="w-8 h-8 text-green-400 mx-auto mb-3" aria-hidden="true" />
              <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {downloadSpeed > 0 ? downloadSpeed.toFixed(2) : '0.00'}
              </div>
              <div className={`text-xs uppercase ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{APP_STRINGS.DOWNLOAD_LABEL}</div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{APP_STRINGS.SPEED_UNIT}</div>
            </div>

            {/* Upload */}
            <div className={`rounded-2xl p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <Upload className="w-8 h-8 text-sky-400 mx-auto mb-3" aria-hidden="true" />
              <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {uploadSpeed > 0 ? uploadSpeed.toFixed(2) : '0.00'}
              </div>
              <div className={`text-xs uppercase ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{APP_STRINGS.UPLOAD_LABEL}</div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{APP_STRINGS.SPEED_UNIT}</div>
            </div>

            {/* Ping */}
            <div className={`rounded-2xl p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <Activity className="w-8 h-8 text-amber-400 mx-auto mb-3" aria-hidden="true" />
              <div className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {ping > 0 ? ping : '0'}
              </div>
              <div className={`text-xs uppercase ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{APP_STRINGS.PING_LABEL}</div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{APP_STRINGS.PING_UNIT}</div>
            </div>
          </section>

          {/* Progress */}
          {testing && (
            <div className="mb-6">
              <div
                className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Test Progress"
              >
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className={`text-center text-sm mt-3 font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`} aria-live="polite">{stage}</p>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={runTest}
            disabled={testing}
            aria-label={testing ? 'Test in progress' : 'Start Speed Test'}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg text-white mb-6 ${testing
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-[1.02] active:scale-95'
              }`}
          >
            {testing ? APP_STRINGS.BUTTON_TESTING : APP_STRINGS.BUTTON_START}
          </button>

          {/* Test History */}
          {!testing && history.length > 0 && (
            <div className={`mt-6 p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
              <h3 className={`font-bold mb-3 flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                <span>Test History</span>
                <button
                  onClick={clearHistory}
                  className={`text-xs px-2 py-1 rounded hover:bg-red-500/10 ${theme === 'dark' ? 'text-blue-300 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                >
                  Clear
                </button>
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {history.map((test, index) => (
                  <div key={index} className={`flex items-center justify-between text-sm p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{test.date}</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{test.dl} ↓ / {test.ul} ↑</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>{test.ping} ms</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{test.provider}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <p>• {APP_STRINGS.RESULTS_LATENCY} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatPing(ping)}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={`text-center mt-6 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`}>
          <p>{APP_STRINGS.FOOTER_TEXT}</p>
        </footer>
      </div>
    </main>
  );
}
