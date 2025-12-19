"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ============================================================================
// SPEEDTEST CONFIGURATION
// ============================================================================
const CONFIG = {
  // Test durations
  time_dl_max: 20,
  time_ul_max: 16.5,
  time_dlGraceTime: 1.5,
  time_ulGraceTime: 1.5,
  count_ping: 20,

  // Parallel streams
  xhr_dlMultistream: 6,
  xhr_ulMultistream: 6,
  xhr_multistreamDelay: 50,

  // Endpoints
  url_dl: '/api/garbage',
  url_ul: '/api/proxy_upload',    // Proxy to Cloudflare
  url_ping: '/api/proxy_ping',    // Proxy to Cloudflare
  url_getIp: '/api/getip',

  // Chunk sizes
  downloadBytes: 5000000,  // 5MB
  uploadBytes: 5000000,     // 5MB (larger payload for accurate upload speed)
};

// ============================================================================
// SPEEDTEST COMPONENT
// ============================================================================
export default function SpeedTest() {
  // Test state
  const [testState, setTestState] = useState(-1);
  const [dlSpeed, setDlSpeed] = useState(null);
  const [ulSpeed, setUlSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [loadedLatency, setLoadedLatency] = useState(null);

  // Progress
  const [dlProgress, setDlProgress] = useState(0);
  const [ulProgress, setUlProgress] = useState(0);
  const [pingProgress, setPingProgress] = useState(0);

  // Connection info
  const [connectionInfo, setConnectionInfo] = useState(null);

  // Refs
  const xhrRef = useRef([]);
  const intervalRef = useRef(null);
  const abortedRef = useRef(false);

  // Load connection info on mount
  useEffect(() => {
    fetchConnectionInfo();
  }, []);

  const fetchConnectionInfo = async () => {
    try {
      const res = await fetch(CONFIG.url_getIp);
      const data = await res.json();
      setConnectionInfo(data);
    } catch (e) {
      console.error('Failed to fetch connection info:', e);
    }
  };

  // Cleanup
  const clearAll = useCallback(() => {
    xhrRef.current.forEach(xhr => {
      try { xhr.abort(); } catch (e) { }
    });
    xhrRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ============================================================================
  // HELPERS
  // ============================================================================
  const measureLoadedLatency = async () => {
    try {
      const url = CONFIG.url_ping + '?r=l' + Math.random();
      const start = performance.now();
      await fetch(url, { cache: 'no-store' });
      const end = performance.now();

      let elapsed = end - start;
      const entries = performance.getEntriesByName(new URL(url, window.location.href).href);
      if (entries.length > 0) {
        elapsed = entries[entries.length - 1].duration;
      }
      setLoadedLatency(elapsed.toFixed(1));
    } catch (e) { }
  };

  // ============================================================================
  // PING TEST
  // ============================================================================
  const runPingTest = useCallback(async () => {
    const pings = [];

    // Warmup
    for (let i = 0; i < 3; i++) {
      if (abortedRef.current) return;
      try {
        await fetch(CONFIG.url_ping + '?r=w' + Math.random(), { cache: 'no-store' });
      } catch (e) { }
    }

    for (let i = 0; i < CONFIG.count_ping; i++) {
      if (abortedRef.current) break;

      try {
        const url = CONFIG.url_ping + '?r=' + Math.random();
        const start = performance.now();
        await fetch(url, { cache: 'no-store' });
        const end = performance.now();

        let elapsed = end - start;

        // Try to use Resource Timing API for better precision
        // Note: Requires Timing-Allow-Origin header on the server response
        const entries = performance.getEntriesByName(new URL(url, window.location.href).href);
        if (entries.length > 0) {
          elapsed = entries[entries.length - 1].duration;
        }

        pings.push(elapsed);
        setPingProgress((i + 1) / CONFIG.count_ping);
      } catch (e) { }
    }

    if (pings.length > 0) {
      const minPing = Math.min(...pings);
      setPing(minPing.toFixed(1));

      if (pings.length > 1) {
        let jitterSum = 0;
        for (let i = 1; i < pings.length; i++) {
          jitterSum += Math.abs(pings[i] - pings[i - 1]);
        }
        setJitter((jitterSum / (pings.length - 1)).toFixed(1));
      }
    }
  }, []);

  // ============================================================================
  // DOWNLOAD TEST
  // ============================================================================
  const runDownloadTest = useCallback(() => {
    return new Promise((resolve) => {
      if (abortedRef.current) { resolve(); return; }

      let totalBytes = 0;
      let startTime = performance.now();
      let graceTimeDone = false;

      xhrRef.current = [];

      const startStream = (index, delay) => {
        setTimeout(() => {
          if (abortedRef.current) return;

          const xhr = new XMLHttpRequest();
          xhrRef.current[index] = xhr;
          let lastLoaded = 0;

          xhr.onprogress = (e) => {
            if (abortedRef.current) { xhr.abort(); return; }
            const diff = e.loaded - lastLoaded;
            if (diff > 0) {
              totalBytes += diff;
              lastLoaded = e.loaded;
            }
          };

          xhr.onload = () => {
            if (!abortedRef.current) startStream(index, 0);
          };

          xhr.onerror = () => {
            if (!abortedRef.current) startStream(index, 50);
          };

          xhr.responseType = 'arraybuffer';
          xhr.open('GET', `${CONFIG.url_dl}?bytes=${CONFIG.downloadBytes}&r=${Math.random()}`);
          xhr.send();
        }, delay);
      };

      for (let i = 0; i < CONFIG.xhr_dlMultistream; i++) {
        startStream(i, i * CONFIG.xhr_multistreamDelay);
      }

      let tickCount = 0;
      intervalRef.current = setInterval(() => {
        if (tickCount++ % 5 === 0) measureLoadedLatency();
        if (abortedRef.current) { clearAll(); resolve(); return; }

        const elapsed = (performance.now() - startTime) / 1000;

        if (!graceTimeDone && elapsed > CONFIG.time_dlGraceTime) {
          startTime = performance.now();
          totalBytes = 0;
          graceTimeDone = true;
          return;
        }

        if (graceTimeDone && elapsed > 0.2) {
          const mbps = (totalBytes * 8) / (elapsed * 1000000);
          setDlSpeed(mbps.toFixed(2));
          setDlProgress(Math.min(elapsed / CONFIG.time_dl_max, 1));

          if (elapsed >= CONFIG.time_dl_max) {
            clearAll();
            setDlProgress(1);
            resolve();
          }
        }
      }, 200);
    });
  }, [clearAll]);

  // ============================================================================
  // UPLOAD TEST - Fixed for accuracy
  // ============================================================================
  const runUploadTest = useCallback(() => {
    return new Promise((resolve) => {
      if (abortedRef.current) { resolve(); return; }

      let totalBytes = 0;
      let startTime = performance.now();
      let graceTimeDone = false;
      let activeStreams = 0;

      // Pre-generate upload blobs for each stream
      const createBlob = () => {
        const data = new Uint8Array(CONFIG.uploadBytes);
        const chunkSize = 65536; // Maximum bytes per getRandomValues call
        for (let i = 0; i < data.length; i += chunkSize) {
          const slice = data.subarray(i, i + chunkSize);
          crypto.getRandomValues(slice);
        }
        return new Blob([data]);
      };

      xhrRef.current = [];

      const startStream = (index, delay) => {
        setTimeout(() => {
          if (abortedRef.current) return;

          const xhr = new XMLHttpRequest();
          const blob = createBlob();
          xhrRef.current[index] = xhr;
          let lastLoaded = 0;
          activeStreams++;

          xhr.upload.onprogress = (e) => {
            if (abortedRef.current) { xhr.abort(); return; }
            const diff = e.loaded - lastLoaded;
            if (diff > 0 && !isNaN(diff)) {
              totalBytes += diff;
              lastLoaded = e.loaded;
            }
          };

          // Track when upload data is fully sent
          xhr.upload.onloadend = () => {
            activeStreams--;
            if (!abortedRef.current) {
              // Small delay before restarting to allow progress events to fire
              setTimeout(() => startStream(index, 0), 10);
            }
          };

          xhr.onerror = () => {
            activeStreams--;
            if (!abortedRef.current) {
              setTimeout(() => startStream(index, 50), 50);
            }
          };

          xhr.open('POST', `${CONFIG.url_ul}?r=${Math.random()}`);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.send(blob);
        }, delay);
      };

      // Start streams
      for (let i = 0; i < CONFIG.xhr_ulMultistream; i++) {
        startStream(i, i * CONFIG.xhr_multistreamDelay);
      }

      // Update speed display
      let tickCount = 0;
      intervalRef.current = setInterval(() => {
        if (tickCount++ % 5 === 0) measureLoadedLatency();
        if (abortedRef.current) { clearAll(); resolve(); return; }

        const elapsed = (performance.now() - startTime) / 1000;

        if (!graceTimeDone && elapsed > CONFIG.time_ulGraceTime) {
          startTime = performance.now();
          totalBytes = 0;
          graceTimeDone = true;
          return;
        }

        if (graceTimeDone && elapsed > 0.1) {
          const mbps = (totalBytes * 8) / (elapsed * 1000000);
          if (mbps > 0) {
            setUlSpeed(mbps.toFixed(2));
          }
          setUlProgress(Math.min(elapsed / CONFIG.time_ul_max, 1));

          if (elapsed >= CONFIG.time_ul_max) {
            clearAll();
            setUlProgress(1);
            resolve();
          }
        }
      }, 100); // More frequent updates
    });
  }, [clearAll]);

  // ============================================================================
  // MAIN TEST RUNNER
  // ============================================================================
  const startTest = useCallback(async () => {
    if (testState >= 0 && testState < 4) return;

    abortedRef.current = false;
    setTestState(0);
    setDlSpeed(null);
    setUlSpeed(null);
    setPing(null);
    setJitter(null);
    setDlProgress(0);
    setUlProgress(0);
    setPingProgress(0);

    try {
      // Refresh connection info
      await fetchConnectionInfo();

      // Ping test first
      if (!abortedRef.current) {
        setTestState(2);
        await runPingTest();
      }

      // Download test
      if (!abortedRef.current) {
        setTestState(1);
        await runDownloadTest();
      }

      // Upload test
      if (!abortedRef.current) {
        setTestState(3);
        await runUploadTest();
      }

      if (!abortedRef.current) {
        setTestState(4);
        toast.success('Speed test complete!');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed');
      setTestState(-1);
    }
  }, [testState, runDownloadTest, runPingTest, runUploadTest]);

  const abortTest = useCallback(() => {
    abortedRef.current = true;
    clearAll();
    setTestState(5);
    toast('Test aborted');
    setTimeout(() => setTestState(-1), 500);
  }, [clearAll]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  const isRunning = testState >= 0 && testState < 4;
  const isDone = testState === 4;

  const getPhase = () => {
    switch (testState) {
      case 0: return 'Initializing...';
      case 1: return 'Testing Download';
      case 2: return 'Testing Latency';
      case 3: return 'Testing Upload';
      case 4: return 'Complete';
      case 5: return 'Aborted';
      default: return 'Ready';
    }
  };

  const mainValue = testState === 3 ? ulSpeed : dlSpeed;
  const mainLabel = testState === 3 ? 'Upload' : 'Download';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            SpeedNet
          </h1>
          <span className="text-sm text-slate-500">Internet Speed Test</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Connection Info Card */}
          {connectionInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-slate-800/30 backdrop-blur rounded-2xl p-4 border border-slate-700/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">{connectionInfo.ip}</div>
                    <div className="text-sm text-slate-400">{connectionInfo.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-slate-500">ISP:</span>
                    <span className="text-slate-300 ml-2">{connectionInfo.ispInfo || connectionInfo.isp}</span>
                  </div>
                  {connectionInfo.asn && (
                    <div className="hidden md:block">
                      <span className="text-slate-500">ASN:</span>
                      <span className="text-slate-400 ml-2 text-xs">{connectionInfo.asn}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Test Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">

            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isRunning ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' :
                isDone ? 'bg-green-500/20 text-green-400' :
                  'bg-slate-700/50 text-slate-400'
                }`}>
                {getPhase()}
              </div>
            </div>

            {/* Big Speed Display */}
            <div className="text-center mb-10">
              <div
                className="flex flex-col items-center justify-center"
              >
                <div className="text-7xl md:text-9xl font-black text-white tracking-tighter tabular-nums leading-none">
                  {mainValue || '0'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-400">Mbps</span>
                  <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold px-2 py-0.5 bg-slate-800 rounded">{mainLabel}</div>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 mb-8"
                >
                  <ProgressBar label="Latency" progress={pingProgress} active={testState === 2} />
                  <ProgressBar label="Download" progress={dlProgress} active={testState === 1} />
                  <ProgressBar label="Upload" progress={ulProgress} active={testState === 3} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard
                icon="↓"
                label="Download"
                value={dlSpeed}
                unit="Mbps"
                active={testState === 1}
                color="cyan"
              />
              <MetricCard
                icon="↑"
                label="Upload"
                value={ulSpeed}
                unit="Mbps"
                active={testState === 3}
                color="purple"
              />
              <MetricCard
                icon="⚡"
                label="Ping"
                value={ping}
                unit="ms"
                active={testState === 2}
                color="green"
              />
              <MetricCard
                icon="〰"
                label="Jitter"
                value={jitter}
                unit="ms"
                active={testState === 2}
                color="yellow"
              />
            </div>

            {/* Control Button */}
            <div className="flex justify-center">
              {isRunning ? (
                <button
                  onClick={abortTest}
                  className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-bold border border-red-500/30 flex items-center gap-2 transition-all"
                >
                  <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                  Stop Test
                </button>
              ) : (
                <button
                  onClick={startTest}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  {isDone ? 'Test Again' : 'Start Test'}
                </button>
              )}
            </div>
          </div>

          {/* Extended Info - shown after test */}
          {isDone && connectionInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-slate-800/30 backdrop-blur rounded-2xl p-6 border border-slate-700/30"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Connection Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoItem label="IP Address" value={connectionInfo.ip} />
                <InfoItem label="City" value={connectionInfo.city} />
                <InfoItem label="Region" value={connectionInfo.region} />
                <InfoItem label="Country" value={connectionInfo.country} />
                <InfoItem label="ISP" value={connectionInfo.isp} />
                <InfoItem label="Organization" value={connectionInfo.org} />
                <InfoItem label="Timezone" value={connectionInfo.timezone} />
                <InfoItem label="Coordinates" value={connectionInfo.lat && connectionInfo.lon ? `${connectionInfo.lat}, ${connectionInfo.lon}` : '-'} />
              </div>
            </motion.div>
          )}
        </div>
      </main >

      {/* Footer */}

      < footer className="border-t border-slate-200/70 py-6 text-center text-slate-500 text-sm" >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-slate-600">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </span>

          <span className="hidden sm:inline">•</span>

          <span>Powered by LibreSpeed</span>

          <span className="hidden sm:inline">•</span>

          <span>Server: Cloudflare Edge</span>
        </div>
      </footer >

    </div >
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
function ProgressBar({ label, progress, active }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs w-20 ${active ? 'text-cyan-400' : 'text-slate-500'}`}>{label}</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${active ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-slate-600'}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 w-12 text-right">{Math.round(progress * 100)}%</span>
    </div>
  );
}


function DualMetricCard({ items, active, color = 'yellow' }) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 ring-cyan-500/50',
    purple: 'from-purple-500/20 to-purple-500/5 ring-purple-500/50',
    green: 'from-green-500/20 to-green-500/5 ring-green-500/50',
    yellow: 'from-yellow-500/20 to-yellow-500/5 ring-yellow-500/50',
  };

  return (
    <div className={`bg-gradient-to-b ${colorClasses[color]} rounded-xl p-4 transition-all ${active ? 'ring-2' : ''} flex items-stretch justify-between gap-0`}>
      {items.map((item, i) => (
        <div key={i} className={`flex-1 text-center flex flex-col justify-between ${i > 0 ? 'border-l border-white/10 pl-2' : 'pr-2'}`}>
          <div>
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider leading-tight">{item.label}</div>
          </div>
          <div className="font-bold text-white text-lg tabular-nums mt-1">
            {item.value || '-'}
            <span className="text-[10px] text-slate-400 font-normal ml-0.5">{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ icon, label, value, unit, active, color = 'cyan' }) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 ring-cyan-500/50',
    purple: 'from-purple-500/20 to-purple-500/5 ring-purple-500/50',
    green: 'from-green-500/20 to-green-500/5 ring-green-500/50',
    yellow: 'from-yellow-500/20 to-yellow-500/5 ring-yellow-500/50',
  };

  return (
    <div className={`bg-gradient-to-b ${colorClasses[color]} rounded-xl p-4 text-center transition-all ${active ? 'ring-2' : ''}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="font-bold text-white text-xl tabular-nums">
        {value || '-'}
        <span className="text-xs text-slate-400 font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="text-white">{value || '-'}</div>
    </div>
  );
}
