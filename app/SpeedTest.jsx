"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Download, Upload, Activity, MapPin, Globe, CheckCircle } from 'lucide-react';
import { APP_STRINGS, API_ENDPOINTS, SPEEDTEST_CONFIG, TEST_SERVERS } from './constants/strings';
import { useTheme } from './context/ThemeContext';
import dynamic from 'next/dynamic';
const SpeedChart = dynamic(() => import('./components/SpeedChart'), { ssr: false, loading: () => <div className="text-center py-8">Loading chart...</div> });
const SpeedGauge = dynamic(() => import('./components/SpeedGauge'), { ssr: false, loading: () => <div className="text-center py-8">Loading gauge...</div> });
import VideoQualityTest from './components/VideoQualityTest';
import ConnectionMetrics from './components/ConnectionMetrics';
import TestInsightsTabs from './components/TestInsightsTabs';

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
  const isDark = theme === 'dark';
  const [history, setHistory] = useState([]);

  // Chart data
  const [downloadData, setDownloadData] = useState([]);
  const [uploadData, setUploadData] = useState([]);

  // Automatic server selection
  const [selectedServer, setSelectedServer] = useState(null);

  // Multi-test averaging
  const [multiTestEnabled, setMultiTestEnabled] = useState(false);
  const [currentTestNumber, setCurrentTestNumber] = useState(1);
  const [totalTests, setTotalTests] = useState(3);
  const [testResults, setTestResults] = useState([]);

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

  // Remove ipify and ipapi fetches, use only /api/ip-info
  const fetchIPInfo = async () => {
    try {
      let apiUrl = '/api/ip-info';
      // If running on localhost, use a test US IP for dev
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        apiUrl = '/api/ip-info?ip=8.8.8.8'; // Google Public DNS (US)
      }
      const localApiResponse = await fetch(apiUrl);
      if (localApiResponse.ok) {
        const data = await localApiResponse.json();
        setIp(data.ip || '');
        setLocation(APP_STRINGS.formatLocation(data.city, data.country_name));
        return;
      }
    } catch (error) {
      console.warn('Local /api/ip-info failed:', error);
    }
    // Optionally fallback to Cloudflare trace if needed and allowed by CSP
    try {
      const response = await fetch('https://cloudflare.com/cdn-cgi/trace');
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

  const selectBestServer = (countryCode, city) => {
    // Since Cloudflare automatically selects the best server,
    // we'll just show a generic server based on region for display purposes
    const regionDisplay = {
      // North America
      'US': { name: 'North America', location: 'Optimized for your location' },
      'CA': { name: 'North America', location: 'Optimized for your location' },
      'MX': { name: 'North America', location: 'Optimized for your location' },

      // South America
      'BR': { name: 'South America', location: 'Optimized for your location' },
      'AR': { name: 'South America', location: 'Optimized for your location' },

      // Europe
      'GB': { name: 'Europe', location: 'Optimized for your location' },
      'DE': { name: 'Europe', location: 'Optimized for your location' },
      'FR': { name: 'Europe', location: 'Optimized for your location' },

      // Asia Pacific
      'SG': { name: 'Asia Pacific', location: 'Optimized for your location' },
      'JP': { name: 'Asia Pacific', location: 'Optimized for your location' },
      'AU': { name: 'Asia Pacific', location: 'Optimized for your location' },
    };

    const displayInfo = regionDisplay[countryCode] || { name: 'Global Network', location: 'Optimized for your location' };

    // Create a virtual server object for display
    const virtualServer = {
      id: 'auto',
      name: displayInfo.name,
      location: displayInfo.location,
      host: 'auto',
      distance: 0,
      region: 'auto'
    };

    setSelectedServer(virtualServer);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('speedTestHistory');
  };

  const runSingleTest = async () => {
    console.log('runSingleTest called');
    const { default: SpeedTest } = await import('@cloudflare/speedtest');

    return new Promise((resolve, reject) => {
      setDownloadSpeed(0);
      setUploadSpeed(0);
      setPing(0);
      setProgress(0);
      setLiveSpeed(0);
      setDownloadData([]);
      setUploadData([]);
      setStage(APP_STRINGS.STAGE_INIT);

      console.clear();
      console.log(`%c${APP_STRINGS.CONSOLE_START}`, 'color: #00ff00; font-size: 18px; font-weight: bold');
      console.log(`%c${APP_STRINGS.CONSOLE_ENGINE}`, 'color: #ffaa00; font-size: 14px');
      console.log('');

      const speedTest = new SpeedTest({
        autoStart: false,
        measureUpload: true,
        measureDownload: true,
        measurements: [
          { type: 'latency', numPackets: 10 }, // Reduced latency checks
          { type: 'download', bytes: 5e5, count: 16 }, // Lightweight: 500KB x 16 = 8MB Max (Super fast, no stuck tests)
          { type: 'upload', bytes: 5e5, count: 8 },   // Lightweight: 500KB x 8 = 4MB Max
          { type: 'latency', numPackets: 5 }
        ]
      });
      speedTestRef.current = speedTest;

      console.log('Speed test initialized:', speedTest);

      speedTest.onResultsChange = () => {
        console.log('Results changed callback triggered');
        try {
          const downloadBw = speedTest.results.getDownloadBandwidth();
          const uploadBw = speedTest.results.getUploadBandwidth();
          const latency = speedTest.results.getUnloadedLatency();

          // Try different jitter methods
          let jitter = 0;
          try {
            jitter = speedTest.results.getUnloadedJitter();
          } catch (e) {
            console.log('getUnloadedJitter failed, trying alternatives');
            // Try to calculate jitter from latency points
            const latencyPoints = speedTest.results.getUnloadedLatencyPoints();
            if (latencyPoints && latencyPoints.length > 1) {
              const variations = [];
              for (let i = 1; i < latencyPoints.length; i++) {
                variations.push(Math.abs(latencyPoints[i] - latencyPoints[i - 1]));
              }
              if (variations.length > 0) {
                jitter = variations.reduce((sum, v) => sum + v, 0) / variations.length;
              }
            }
          }

          console.log('Raw results - download:', downloadBw, 'upload:', uploadBw, 'latency:', latency, 'jitter:', jitter);

          const dlMbps = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
          const ulMbps = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
          const pingMs = latency ? Math.round(latency) : 0;
          const jitterMs = jitter ? Math.round(jitter) : 0;

          console.log('Converted results - download:', dlMbps, 'upload:', ulMbps, 'ping:', pingMs, 'jitter:', jitterMs);

          if (dlMbps > 0) setDownloadSpeed(parseFloat(dlMbps));
          if (ulMbps > 0) setUploadSpeed(parseFloat(ulMbps));
          if (pingMs > 0) setPing(pingMs);
          if (jitterMs > 0) setJitter(jitterMs); // Update jitter during test

          const currentLive = dlMbps > ulMbps ? dlMbps : ulMbps;
          if (currentLive > 0) setLiveSpeed(parseFloat(currentLive));

          // Update chart data
          if (dlMbps > 0) {
            setDownloadData(prev => [...prev.slice(-50), parseFloat(dlMbps)]);
          }
          if (ulMbps > 0) {
            setUploadData(prev => [...prev.slice(-50), parseFloat(ulMbps)]);
          }

          const downloadPoints = speedTest.results.getDownloadBandwidthPoints()?.length || 0;
          const uploadPoints = speedTest.results.getUploadBandwidthPoints()?.length || 0;
          const totalPoints = downloadPoints + uploadPoints;
          if (testing) {
            setProgress(Math.min(99, Math.round(totalPoints * 3)));
          }
        } catch (e) {
          console.log('Error updating results:', e);
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
        } catch (e) {
          // Ignore errors during stage updates
        }
      }, 1000);

      speedTest.onFinish = (results) => {
        console.log('Speed test finished:', results);
        if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

        try {
          const downloadBw = results.getDownloadBandwidth();
          const uploadBw = results.getUploadBandwidth();
          const latency = results.getUnloadedLatency();

          // Try different jitter methods
          let jitterVal = 0;
          try {
            jitterVal = results.getUnloadedJitter();
          } catch (e) {
            console.log('getUnloadedJitter failed in onFinish, trying alternatives');
            // Try to calculate jitter from latency points
            const latencyPoints = results.getUnloadedLatencyPoints();
            if (latencyPoints && latencyPoints.length > 1) {
              const variations = [];
              for (let i = 1; i < latencyPoints.length; i++) {
                variations.push(Math.abs(latencyPoints[i] - latencyPoints[i - 1]));
              }
              if (variations.length > 0) {
                jitterVal = variations.reduce((sum, v) => sum + v, 0) / variations.length;
              }
            }
          }

          console.log('Final results - download:', downloadBw, 'upload:', uploadBw, 'latency:', latency, 'jitter:', jitterVal);

          const finalDl = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
          const finalUl = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
          const finalPing = latency ? Math.round(latency) : 0;
          const finalJitter = jitterVal ? Math.round(jitterVal) : 0;

          console.log('Final converted - download:', finalDl, 'upload:', finalUl, 'ping:', finalPing, 'jitter:', finalJitter);

          setDownloadSpeed(parseFloat(finalDl));
          setUploadSpeed(parseFloat(finalUl));
          setPing(finalPing);
          setJitter(finalJitter);
          setProgress(100);
          setStage(APP_STRINGS.STAGE_COMPLETE);
          setLiveSpeed(0);
          setTesting(false);
          if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

          console.log(`%c${APP_STRINGS.CONSOLE_COMPLETE}`, 'color: #00ff00; font-size: 16px; font-weight: bold');
          console.log(`${APP_STRINGS.DOWNLOAD_LABEL}: ${APP_STRINGS.formatSpeed(finalDl)} | ${APP_STRINGS.UPLOAD_LABEL}: ${APP_STRINGS.formatSpeed(finalUl)} | ${APP_STRINGS.PING_LABEL}: ${finalPing} ${APP_STRINGS.PING_UNIT} | ${APP_STRINGS.JITTER_LABEL}: ${finalJitter} ${APP_STRINGS.PING_UNIT}`);

          resolve({
            download: parseFloat(finalDl),
            upload: parseFloat(finalUl),
            ping: finalPing,
            jitter: finalJitter
          });

        } catch (e) {
          console.error('Error in onFinish:', e);
          setStage(APP_STRINGS.STAGE_COMPLETE);
          setTesting(false);
          reject(e);
        }
      };

      speedTest.onError = (error) => {
        console.error('Speed test error:', error);
        setStage(APP_STRINGS.STAGE_FAILED);
        setTesting(false);
        if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
        reject(error);
      };

      // Start the actual speed test
      try {
        speedTest.play();
        console.log('Speed test started successfully');
      } catch (playError) {
        console.error('Error starting speed test:', playError);
        reject(playError);
        return;
      }
    });
  };

  const runTest = async () => {
    console.log('runTest called, multiTestEnabled:', multiTestEnabled);
    console.log('Current testing state:', testing);
    if (multiTestEnabled) {
      // Multi-test mode
      setTesting(true);
      setTestResults([]);
      setCurrentTestNumber(1);

      const results = [];
      for (let i = 1; i <= totalTests; i++) {
        setCurrentTestNumber(i);
        setStage(`Test ${i} of ${totalTests}`);

        try {
          const result = await runSingleTest();
          results.push(result);

          // Small delay between tests
          if (i < totalTests) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`Test ${i} failed:`, error);
          // Continue with other tests
        }
      }

      // Calculate averages
      if (results.length > 0) {
        const avgDownload = results.reduce((sum, r) => sum + r.download, 0) / results.length;
        const avgUpload = results.reduce((sum, r) => sum + r.upload, 0) / results.length;
        const avgPing = results.reduce((sum, r) => sum + r.ping, 0) / results.length;
        const avgJitter = results.reduce((sum, r) => sum + r.jitter, 0) / results.length;

        setDownloadSpeed(avgDownload);
        setUploadSpeed(avgUpload);
        setPing(avgPing);
        setJitter(avgJitter);
        setTestResults(results);
        setStage(`Average of ${results.length} tests`);
        setTesting(false);

        // Save averaged result to history
        const newResult = {
          date: new Date().toLocaleString(),
          dl: APP_STRINGS.formatSpeed(avgDownload),
          ul: APP_STRINGS.formatSpeed(avgUpload),
          ping: Math.round(avgPing),
          jitter: Math.round(avgJitter),
          provider: 'Scanpings.net',
          multiTest: true,
          testCount: results.length
        };
        const updatedHistory = [newResult, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('speedTestHistory', JSON.stringify(updatedHistory));
      } else {
        setStage(APP_STRINGS.STAGE_FAILED);
        setTesting(false);
      }
    } else {
      // Single test mode
      setTesting(true);
      try {
        const result = await runSingleTest();

        // Save result to history
        const newResult = {
          date: new Date().toLocaleString(),
          dl: APP_STRINGS.formatSpeed(result.download),
          ul: APP_STRINGS.formatSpeed(result.upload),
          ping: result.ping,
          jitter: result.jitter,
          provider: 'Scanpings.net'
        };
        const updatedHistory = [newResult, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('speedTestHistory', JSON.stringify(updatedHistory));

      } catch (error) {
        setStage(APP_STRINGS.STAGE_FAILED);
        setTesting(false);
      }
    }
  };

  return (
    <main className={`min-h-screen pt-20 p-4 flex items-center justify-center transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      }`}>

      <div className="w-full max-w-3xl relative">

        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wifi className={`w-8 h-8 md:w-9 md:h-9 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} aria-hidden="true" />
            <h1 className={`text-3xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.HEADER_TITLE}</h1>
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>{APP_STRINGS.HEADER_SUBTITLE}</p>
        </header>

        {/* Start Button */}
        {!testing && (
          <div className="flex justify-center mb-12">
            <button
              onClick={() => {
                console.log('Button clicked');
                runTest().catch(error => {
                  console.error('runTest error:', error);
                });
              }}
              aria-label="Start internet speed test"
              className={`group relative px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                : 'bg-white text-blue-600 shadow-xl hover:shadow-2xl'
                }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 group-hover:animate-pulse" />
                {APP_STRINGS.START_BUTTON}
              </span>
            </button>
          </div>
        )}

        {/* Main Card */}
        <section className={`rounded-3xl p-8 shadow-2xl border transition-colors duration-300 ${theme === 'dark'
          ? 'backdrop-blur-xl bg-white/10 border-white/20 shadow-black/20'
          : 'bg-white border-slate-200 shadow-sm'
          }`} aria-label="Speed Test Panel">

          {/* IP & Location */}
          <section aria-label="Connection Information" className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b text-sm ${theme === 'dark' ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'
            }`}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" aria-hidden="true" focusable="false" />
              <span>{APP_STRINGS.IP_LABEL} <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{ip || APP_STRINGS.IP_DETECTING}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" focusable="false" />
              <span>{location || APP_STRINGS.LOCATION_DETECTING}</span>
            </div>
          </section>

          {/* Selected Server Display */}
          {selectedServer && (
            <div className={`mb-6 p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                  <div>
                    <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Test Server
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                      Automatically selected for optimal performance
                    </p>
                  </div>
                </div>
                <div className={`text-right ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
                  <div className="font-semibold">{selectedServer.name}</div>
                  <div className="text-sm opacity-75">{selectedServer.location}</div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Test Toggle */}
          <div className={`mb-6 p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                <div>
                  <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Multi-Test Mode
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                    Run multiple tests for more accurate results
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={multiTestEnabled}
                  onChange={(e) => setMultiTestEnabled(e.target.checked)}
                  className="sr-only peer"
                  disabled={testing}
                  id="multiTestToggle"
                  aria-checked={multiTestEnabled}
                  aria-label="Enable multi-test averaging"
                />
                <span className="sr-only">Enable multi-test averaging</span>
                <div className={`w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 transition-all ${multiTestEnabled
                  ? 'bg-blue-600 peer-focus:ring-blue-800'
                  : isDark ? 'bg-gray-600' : 'bg-gray-200'
                  } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>
          </div>



          {/* Results Grid */}
          <section aria-label="Speed Test Results" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-live="polite">
            {/* Download Gauge */}
            <div className={`rounded-2xl p-4 md:p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <SpeedGauge
                value={Number(downloadSpeed).toFixed(2)}
                maxValue={200}
                label="Download"
                colorClass="text-green-400"
                theme={theme}
                size={140}
              />
            </div>

            {/* Upload Gauge */}
            <div className={`rounded-2xl p-4 md:p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <SpeedGauge
                value={Number(uploadSpeed).toFixed(2)}
                maxValue={50}
                label="Upload"
                colorClass="text-sky-400"
                theme={theme}
                size={140}
              />
            </div>

            {/* Ping */}
            <div className={`rounded-2xl p-5 md:p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <SpeedGauge
                value={Number(ping).toFixed(2)}
                maxValue={100}
                label="Ping"
                unit="ms"
                colorClass="text-amber-400"
                theme={theme}
                size={140}
              />
            </div>

            {/* Jitter */}
            <div className={`rounded-2xl p-5 md:p-6 text-center border transition-all ${theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-blue-100 shadow-sm'
              }`}>
              <SpeedGauge
                value={Number(jitter).toFixed(2)}
                maxValue={50}
                label="Jitter"
                unit="ms"
                colorClass="text-purple-400"
                theme={theme}
                size={140}
              />
            </div>
          </section>

          {/* Test Standards Info */}
          {!testing && !stage && (
            <div className={`mb-8 p-4 rounded-xl border text-xs text-center mx-auto max-w-lg transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <h2 className="font-bold uppercase tracking-widest mb-3 opacity-70">Adaptive Test Standards</h2>
              <div className="flex justify-center gap-4 sm:gap-8">
                <div className="flex flex-col">
                  <span className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Adaptive</span>
                  <span className="opacity-70">Download (~8MB)</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}>Adaptive</span>
                  <span className="opacity-70">Upload (~4MB)</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>20x</span>
                  <span className="opacity-70">Latency Samples</span>
                </div>
              </div>
            </div>
          )}

          {/* Speed Chart */}
          <SpeedChart
            downloadData={downloadData}
            uploadData={uploadData}
            theme={theme}
            isVisible={testing}
          />

          {/* Progress */}
          {testing && (
            <section className="mb-6" aria-label="Test Progress Section">
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
            </section>
          )}

          {/* Test Button */}
          <button
            onClick={() => {
              console.log('Button clicked, calling runTest');
              runTest().catch(error => {
                console.error('runTest error:', error);
              });
            }}
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
              <h2 className={`font-bold mb-3 flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                <span>Test History</span>
                <button
                  onClick={clearHistory}
                  className={`text-xs px-2 py-1 rounded hover:bg-red-500/10 ${theme === 'dark' ? 'text-blue-300 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                >
                  Clear
                </button>
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {history.map((test, index) => (
                  <div key={index} className={`flex items-center justify-between text-xs p-2 rounded-md ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <div className="flex flex-col">
                      <span className={`font-mono text-[10px] ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>{test.date}</span>
                      <span className={`font-bold mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{test.dl} ↓ / {test.ul} ↑</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>{test.ping} ms</span>
                      {/* Force display ScanPing to correct old history */}
                      <span className={`text-[10px] ${theme === 'dark' ? 'text-blue-300' : 'text-slate-400'}`}>Scanpings.net</span>
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
              <h2 className={`font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
                {APP_STRINGS.RESULTS_TITLE}
              </h2>
              <div className={`text-sm space-y-2 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                <p>• {APP_STRINGS.RESULTS_DOWNLOAD} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatSpeedWithBytes(downloadSpeed)}</span></p>
                <p>• {APP_STRINGS.RESULTS_UPLOAD} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatSpeedWithBytes(uploadSpeed)}</span></p>
                <p>• {APP_STRINGS.RESULTS_LATENCY} <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatPing(ping)}</span> <span className="opacity-50">|</span> Jitter: <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{APP_STRINGS.formatPing(jitter)}</span></p>
              </div>
            </div>
          )}

          {/* Test Insights Tabs (Video, Analysis, Gaming, Insights) */}
          {!testing && downloadSpeed > 0 && (
            <TestInsightsTabs
              downloadSpeed={downloadSpeed}
              uploadSpeed={uploadSpeed}
              ping={ping}
              jitter={jitter}
              qualityScore={20}
              packetLoss={'5.00%'}
              speedRatio={'1:1'}
              likelyType={'Slow'}
            />
          )}
        </section>

        {/* SEO Content removed (moved to About page) */}

        {/* Footer */}
        <footer className={`text-center mt-12 mb-8 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`} role="contentinfo">
          <p>{APP_STRINGS.FOOTER_TEXT}</p>
        </footer>
      </div>
    </main>
  );
}
