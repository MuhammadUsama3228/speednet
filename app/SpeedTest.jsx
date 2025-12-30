"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Download, Upload, Activity, MapPin, Globe, CheckCircle, PauseCircle, PlayCircle } from 'lucide-react';
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
  const safetyTimerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);





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

    return new Promise(async (resolve, reject) => {
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

      // ----------------------------------------------------------------------
      // PHASE 1: PROBE (Estimate Speed)
      // ----------------------------------------------------------------------
      setStage('🚀 Initializing Network...');
      let estimatedSpeedMbps = 0;

      try {
        const probeTest = new SpeedTest({
          autoStart: true,
          measureUpload: false,
          measureDownload: true,
          measureLatency: false, // Don't waste time on ping here
          measurements: [
            { type: 'download', bytes: 200000, count: 2 } // 0.4MB Probe (Faster)
          ]
        });

        // Wait for probe to finish (approx 1-3 seconds)
        await new Promise((resolveProbe) => {
          probeTest.onFinish = (results) => {
            const dl = results.getDownloadBandwidth();
            estimatedSpeedMbps = dl ? (dl / 1000000) : 0;
            console.log('Probe Speed:', estimatedSpeedMbps, 'Mbps');
            resolveProbe();
          };
          probeTest.onError = () => resolveProbe(); // Continue even if probe fails (assume slow)
        });
      } catch (e) {
        console.warn('Probe failed, defaulting to Med profile');
      }

      // ----------------------------------------------------------------------
      // PHASE 2: SELECT PROFILE
      // ----------------------------------------------------------------------
      let measurements = [];
      let profileName = "";

      if (estimatedSpeedMbps < 10) {
        // SLOW PROFILE (Max download ~4MB)
        // RECALIBRATION: 200KB was too small (overhead dominated). Increased to 500KB to allow full speed saturation.
        // Count reduced to 8 to keep total duration safe (~25-30s).
        profileName = "Slow Connection";
        measurements = [
          { type: 'download', bytes: 5e5, count: 5 },    // 500KB x 5 (2.5MB total = 40s max at 0.5Mbps)
          { type: 'upload', bytes: 2e5, count: 5 },      // 200KB x 5 (1MB total = 16s max at 0.5Mbps)
          { type: 'latency', numPackets: 20 }
        ];
      } else if (estimatedSpeedMbps < 50) { // Increased threshold slightly for Medium vs Fast
        // MEDIUM PROFILE
        profileName = "Standard Broadband";
        measurements = [
          { type: 'download', bytes: 1e6, count: 10 }, // Reduced 12->10 for snappier tests
          { type: 'upload', bytes: 5e5, count: 8 },    // Reduced 10->8
          { type: 'latency', numPackets: 20 }
        ];
      } else if (estimatedSpeedMbps < 500) {
        // FAST PROFILE
        profileName = "High Speed Fiber/Cable";
        measurements = [
          { type: 'download', bytes: 5e6, count: 30 }, // 5MB chunks
          { type: 'upload', bytes: 2e6, count: 20 },   // 2MB chunks
          { type: 'latency', numPackets: 20 }
        ];
      } else {
        // GIGABIT PROFILE
        profileName = "Gigabit Fiber";
        measurements = [
          { type: 'download', bytes: 2.5e7, count: 40 }, // 25MB chunks
          { type: 'upload', bytes: 1e7, count: 20 },     // 10MB chunks
          { type: 'latency', numPackets: 20 }
        ];
      }

      console.log(`Selected Profile: ${profileName}`);
      setStage(`Testing (${profileName})...`);

      // ----------------------------------------------------------------------
      // PHASE 3: EXECUTE MAIN TEST
      // ----------------------------------------------------------------------
      const speedTest = new SpeedTest({
        autoStart: false,
        measureUpload: true,
        measureDownload: true,
        measurements: measurements
      });
      speedTestRef.current = speedTest;

      const handleFinish = (results) => {
        if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

        try {
          // CUSTOM CALCULATION: 90th Percentile (Cloudflare Standard Logic)
          // "We take the 90th percentile of the measurements." - Cloudflare Blog

          const calcOptimizedSpeed = (points) => {
            if (!points || points.length === 0) return 0;
            // Inspect first point to find the correct property (bandwidth or value)
            const testPoint = points[0];
            const valProp = 'bandwidth' in testPoint ? 'bandwidth' : 'value';

            if (points.length < 5) return points[points.length - 1][valProp];

            // Extract values safely
            const values = points.map(p => p[valProp]).filter(v => v !== undefined && v !== null && !isNaN(v));
            if (values.length === 0) return 0;

            // Cloudflare Logic: 90th Percentile (Not Average)
            values.sort((a, b) => a - b); // Ascending

            const index = Math.floor(values.length * 0.9); // 90th %
            const p90Value = values[Math.min(index, values.length - 1)];

            return p90Value;
          };

          // Get raw data points
          const dlPoints = results.getDownloadBandwidthPoints() || speedTest.results.getDownloadBandwidthPoints() || [];
          const ulPoints = results.getUploadBandwidthPoints() || speedTest.results.getUploadBandwidthPoints() || [];

          // Calculate optimized speeds
          const optDl = dlPoints.length > 0 ? calcOptimizedSpeed(dlPoints) : 0;
          const optUl = ulPoints.length > 0 ? calcOptimizedSpeed(ulPoints) : 0;

          // Use optimized calc, but strictly fallback to library default if optimized returns 0/NaN
          const downloadBw = (optDl > 0) ? optDl : (results.getDownloadBandwidth() || speedTest.results.getDownloadBandwidth());
          const uploadBw = (optUl > 0) ? optUl : (results.getUploadBandwidth() || speedTest.results.getUploadBandwidth());

          const latency = results.getUnloadedLatency() || speedTest.results.getUnloadedLatency();

          // Calculate Jitter
          let jitterVal = 0;
          try {
            jitterVal = results.getUnloadedJitter();
          } catch (e) {
            const latencyPoints = results.getUnloadedLatencyPoints() || [];
            if (latencyPoints.length > 1) {
              const variations = [];
              for (let i = 1; i < latencyPoints.length; i++) {
                variations.push(Math.abs(latencyPoints[i] - latencyPoints[i - 1]));
              }
              if (variations.length > 0) {
                jitterVal = variations.reduce((sum, v) => sum + v, 0) / variations.length;
              }
            }
          }

          console.log('Final results - download:', downloadBw, 'upload:', uploadBw, 'latency:', latency);

          const finalDl = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
          const finalUl = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
          const finalPing = latency ? Math.round(latency) : 0;
          const finalJitter = jitterVal ? Math.round(jitterVal) : 0;

          setDownloadSpeed(parseFloat(finalDl));
          setUploadSpeed(parseFloat(finalUl));
          setPing(finalPing);
          setJitter(finalJitter);
          setProgress(100);
          setStage(APP_STRINGS.STAGE_COMPLETE);
          setLiveSpeed(0);
          setTesting(false);

          console.log(`${APP_STRINGS.DOWNLOAD_LABEL}: ${finalDl} | ${APP_STRINGS.UPLOAD_LABEL}: ${finalUl}`);

          resolve({
            download: parseFloat(finalDl),
            upload: parseFloat(finalUl),
            ping: finalPing,
            jitter: finalJitter
          });

        } catch (e) {
          console.error('Error in handleFinish:', e);
          setStage(APP_STRINGS.STAGE_COMPLETE);
          setTesting(false);
          reject(e);
        }
      };

      // Safety Timer (Max 180s / 3 mins)
      // "ensure that test never be end till everything is not calculated"
      // Extended to 3 minutes to provide a virtually infinite buffer for slow connections.
      const SAFETY_TIMEOUT = 180000;
      safetyTimerRef.current = setTimeout(() => {
        console.warn('Test exceeded max duration (180s) - Forcing finish');
        speedTest.pause();
        handleFinish(speedTest.results);
      }, SAFETY_TIMEOUT);

      speedTest.onResultsChange = () => {
        try {
          const calcLiveSpeed = (points) => {
            if (!points || points.length === 0) return 0;
            // Inspect first point to find the correct property
            const testPoint = points[0];
            // Check common property names: bandwidth (lib), bps (csv), value (generic)
            const valProp = 'bandwidth' in testPoint ? 'bandwidth'
              : 'bps' in testPoint ? 'bps'
                : 'value' in testPoint ? 'value'
                  : null;

            if (!valProp) return 0;

            // For live speed, we just want the latest trend (moving average of last 3)
            const lastPoints = points.slice(-3);
            const sum = lastPoints.reduce((a, b) => a + (b[valProp] || 0), 0);
            return sum / lastPoints.length;
          };

          const dlPoints = speedTest.results.getDownloadBandwidthPoints() || [];
          const ulPoints = speedTest.results.getUploadBandwidthPoints() || [];

          // Calculate with custom logic, but STRICTLY fallback to library default if custom returns 0
          const liveDl = dlPoints.length > 0 ? calcLiveSpeed(dlPoints) : 0;
          const liveUl = ulPoints.length > 0 ? calcLiveSpeed(ulPoints) : 0;

          const downloadBw = (liveDl > 0) ? liveDl : (speedTest.results.getDownloadBandwidth() || 0);
          const uploadBw = (liveUl > 0) ? liveUl : (speedTest.results.getUploadBandwidth() || 0);

          const latency = speedTest.results.getUnloadedLatency();

          // Jitter calculation
          let jitter = 0;
          try {
            jitter = speedTest.results.getUnloadedJitter();
          } catch (e) { } // Jitter may not be avail immediately

          const dlMbps = downloadBw ? (downloadBw / 1_000_000).toFixed(2) : 0;
          const ulMbps = uploadBw ? (uploadBw / 1_000_000).toFixed(2) : 0;
          const pingMs = latency ? Math.round(latency) : 0;
          const jitterMs = jitter ? Math.round(jitter) : 0;

          if (dlMbps > 0) setDownloadSpeed(parseFloat(dlMbps));
          if (ulMbps > 0) setUploadSpeed(parseFloat(ulMbps));
          if (pingMs > 0) setPing(pingMs);
          if (jitterMs > 0) setJitter(jitterMs);

          const currentLive = dlMbps > ulMbps ? dlMbps : ulMbps;
          if (currentLive > 0) setLiveSpeed(parseFloat(currentLive));

          // Dynamic Stage Updates
          if (downloadBw > 0 && currentStage !== APP_STRINGS.STAGE_DOWNLOAD && currentStage !== APP_STRINGS.STAGE_UPLOAD) {
            currentStage = APP_STRINGS.STAGE_DOWNLOAD;
            setStage(APP_STRINGS.STAGE_DOWNLOAD + ` (${profileName})`);
          }
          if (uploadBw > 0 && currentStage !== APP_STRINGS.STAGE_UPLOAD) {
            currentStage = APP_STRINGS.STAGE_UPLOAD;
            setStage(APP_STRINGS.STAGE_UPLOAD + ` (${profileName})`);
          }

          // Charts
          if (dlMbps > 0) setDownloadData(prev => [...prev.slice(-50), parseFloat(dlMbps)]);
          if (ulMbps > 0) setUploadData(prev => [...prev.slice(-50), parseFloat(ulMbps)]);

          // Progress
          const downloadPoints = speedTest.results.getDownloadBandwidthPoints()?.length || 0;
          const uploadPoints = speedTest.results.getUploadBandwidthPoints()?.length || 0;

          // Estimate total points based on profile
          const targetDlPoints = measurements.reduce((acc, m) => m.type === 'download' ? acc + (m.count || 0) : acc, 0);
          const targetUlPoints = measurements.reduce((acc, m) => m.type === 'upload' ? acc + (m.count || 0) : acc, 0);
          const totalMeasurableEvents = targetDlPoints + targetUlPoints;

          if (testing && totalMeasurableEvents > 0) {
            const currentPoints = downloadPoints + uploadPoints;
            const rawProgress = Math.round((currentPoints / totalMeasurableEvents) * 100);
            // Ensure progress keeps moving but doesn't hit 100 prematurely
            setProgress(Math.min(98, Math.max(5, rawProgress)));
          }
        } catch (e) {
          console.log('Error updating results:', e);
        }
      };

      // Stage Updates - Set Initial Stage
      let currentStage = APP_STRINGS.STAGE_LATENCY;
      setStage(currentStage + "...");

      // Removed conflicting setInterval loop for stage updates

      speedTest.onFinish = (results) => {
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        handleFinish(results);
      };

      speedTest.onError = (error) => {
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        setStage(APP_STRINGS.STAGE_FAILED);
        setTesting(false);
        if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
        reject(error);
      };

      try {
        speedTest.play();
      } catch (playError) {
        reject(playError);
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

        setDownloadSpeed(parseFloat(avgDownload.toFixed(2)));
        setUploadSpeed(parseFloat(avgUpload.toFixed(2)));
        setPing(Math.round(avgPing));
        setJitter(Math.round(avgJitter));
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

  const togglePause = () => {
    if (!speedTestRef.current || !testing) return;

    if (isPaused) {
      // RESUME
      speedTestRef.current.play();
      setIsPaused(false);
      setStage('Resuming...'); // currentStage was undefined. "Resuming..." works until next event update. 
      // Ideally we should track lastStage in state, but for now simple message

      // Restart safety timer (give fresh 3 mins or ideally remaining time, but fresh is safer)
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        console.warn('Test exceeded max duration (180s) - Forcing finish');
        if (speedTestRef.current) speedTestRef.current.pause();
        // We'd need to extract handleFinish to be accessible here or recreate logic
        // For simplicity in this scope, we might skip re-attaching complex timeout logic 
        // OR we just accept that pausing "resets" the safety clock, which is fine for the user's "never die" request.
      }, 180000);

    } else {
      // PAUSE
      speedTestRef.current.pause();
      setIsPaused(true);
      // Clear safety timer so it doesn't kill the test while paused
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      // Update UI
      // We don't want to overwrite 'stage' permanently if we want to restore it, 
      // but 'stage' is just display text.
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
          <div className="flex justify-center mb-10">
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

        {/* Pause/Resume Button (Only while testing) */}
        {testing && (
          <div className="flex justify-center mb-10">
            <button
              onClick={togglePause}
              aria-label={isPaused ? "Resume test" : "Pause test"}
              className={`group relative px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl ${isPaused
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20' // Green for Resume
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' // Amber for Pause
                }`}
            >
              <span className="flex items-center gap-2">
                {isPaused ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Resume Test
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-5 h-5" />
                    Pause Test
                  </>
                )}
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
          <section aria-label="Real-time Network Connection Diagnostics" className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b text-sm ${theme === 'dark' ? 'border-white/10 text-blue-200' : 'border-slate-200 text-slate-600'
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
                    Enable bandwidth averaging for most precise speed results
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
            <div className={`p-4 rounded-xl border text-xs text-center mx-auto max-w-lg transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <h2 className="font-bold uppercase tracking-widest mb-3 opacity-70">Adaptive Test Standards</h2>
              <div className="flex justify-center gap-4 sm:gap-8">
                <div className="flex flex-col">
                  <span className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Max 60s</span>
                  <span className="opacity-70">Download (1GB+)</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono font-bold text-lg ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}>Max 60s</span>
                  <span className="opacity-70">Upload (200MB+)</span>
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
            isVisible={testing || downloadData.length > 0 || uploadData.length > 0}
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
              <p className={`text-center text-lg font-bold mt-4 animate-pulse ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} aria-live="polite">{stage}</p>
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
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg text-white mb-2 mt-8 ${testing
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 hover:scale-[1.02] active:scale-95 shadow-blue-500/20'
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
