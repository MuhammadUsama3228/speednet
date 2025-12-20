"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Speedtest } from "./librespeed";

// ============================================================================
// SPEEDTEST CONFIGURATION
// ============================================================================
const DEFAULT_SERVER = {
  name: "Auto-selected Node",
  server: "/",
  dlURL: "api/librespeed/garbage",
  ulURL: "api/librespeed/empty",
  pingURL: "api/librespeed/empty",
  getIpURL: "api/librespeed/getip",
};

// ============================================================================
// SPEEDTEST COMPONENT
// ============================================================================
export default function SpeedTest() {
  // Test state
  const [testState, setTestState] = useState(-1); // -1=ready, 3=running, 4=done, 5=aborted
  const [internalState, setInternalState] = useState(-1); // 0=start, 1=dl, 2=ping, 3=ul, 4=done, 5=abort
  const [dlSpeed, setDlSpeed] = useState(null);
  const [ulSpeed, setUlSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [clientIp, setClientIp] = useState(null);
  const [loadedLatency, setLoadedLatency] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // Progress
  const [dlProgress, setDlProgress] = useState(0);
  const [ulProgress, setUlProgress] = useState(0);
  const [pingProgress, setPingProgress] = useState(0);

  // Refs
  const speedtestRef = useRef(null);
  const latencyIntervalRef = useRef(null);

  // Initialize
  useEffect(() => {
    fetchIP();
  }, []);

  const fetchIP = async () => {
    try {
      const res = await fetch(DEFAULT_SERVER.getIpURL);
      const data = await res.json();
      setClientIp(data.processedString);
    } catch (e) {
      console.error("IP fetch failed", e);
    }
  };

  const measureLoadedLatency = async () => {
    // Only measure during DL or UL phases
    if (!(speedtestRef.current?.testState === 1 || speedtestRef.current?.testState === 3)) return;

    try {
      const start = performance.now();
      await fetch(DEFAULT_SERVER.pingURL + "?r=" + Math.random(), { cache: 'no-store' });
      const end = performance.now();
      const val = end - start;
      setLoadedLatency(prev => {
        return prev ? (parseFloat(prev) * 0.7 + val * 0.3).toFixed(1) : val.toFixed(1);
      });
    } catch (e) { }
  };

  const startTest = useCallback(() => {
    if (testState === 3) return;

    const s = new Speedtest();
    speedtestRef.current = s;

    // Optimized for Vercel Edge: Higher parallelism to saturate bandwidth
    s.setParameter("test_order", "D_I_P_U");
    s.setParameter("time_dl_max", 15);
    s.setParameter("time_ul_max", 15);
    s.setParameter("xhr_dlMultistream", 10);
    s.setParameter("xhr_ulMultistream", 10);
    s.setParameter("telemetry_level", "basic");

    // Server selection
    s.setSelectedServer(DEFAULT_SERVER);
    setShowMore(false);
    setLoadedLatency(null);

    s.onupdate = (data) => {
      setInternalState(data.testState);
      setDlSpeed(data.dlStatus);
      setUlSpeed(data.ulStatus);
      setPing(data.pingStatus);
      setJitter(data.jitterStatus);
      setDlProgress(data.dlProgress);
      setUlProgress(data.ulProgress);
      setPingProgress(data.pingProgress);
      if (data.clientIp) setClientIp(data.clientIp);

      if (data.testState === 1 || data.testState === 3) {
        if (!latencyIntervalRef.current) {
          latencyIntervalRef.current = setInterval(measureLoadedLatency, 1000);
        }
      } else if (data.testState === 2) {
        // Keep it running
      } else {
        if (latencyIntervalRef.current) {
          clearInterval(latencyIntervalRef.current);
          latencyIntervalRef.current = null;
        }
      }
    };

    s.onend = (aborted) => {
      setTestState(aborted ? 5 : 4);
      if (latencyIntervalRef.current) {
        clearInterval(latencyIntervalRef.current);
        latencyIntervalRef.current = null;
      }

      if (!aborted) {
        if (parseFloat(dlSpeed) === 0 && internalState === 4) {
          toast.error("Test returned 0 Mbps. Possible API error on Vercel.");
        } else {
          toast.success("Test complete!");
        }
      }
    };

    setTestState(3);
    s.start();
  }, [testState]);

  const abortTest = useCallback(() => {
    if (speedtestRef.current) {
      speedtestRef.current.abort();
    }
  }, []);

  // UI Helpers
  const isRunning = testState === 3;
  const isDone = testState === 4;

  const getPhase = () => {
    switch (internalState) {
      case 0: return "Initializing...";
      case 1: return "Testing Download";
      case 2: return "Testing Latency";
      case 3: return "Testing Upload";
      case 4: return "Complete";
      case 5: return "Aborted";
      default: return "Ready";
    }
  };

  const currentVal = (internalState === 3 || (isDone && !isRunning)) ? (dlSpeed || "0") : (dlSpeed || "0");
  const currentLabel = "Download Speed";

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative z-10 px-8 py-6 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-black italic text-white">S</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">SpeedNet <span className="text-cyan-500 text-xs font-mono uppercase tracking-widest ml-1 text-white">Clone</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
            Production v1.0.0
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full gap-8">

        {/* Connection Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm flex items-center gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Network</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-mono text-slate-200">{clientIp || "Identifying Network..."}</span>
        </motion.div>

        {/* Hero Section */}
        <section className="w-full flex flex-col items-center gap-12">

          <div className="relative group">
            {/* Liquid Meter Ring */}
            <svg className="w-72 h-72 md:w-96 md:h-96 transform -rotate-90">
              <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="1" fill="none" className="text-white/5" />
              <motion.circle
                cx="50%" cy="50%" r="48%"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="100 100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - (internalState === 1 ? dlProgress : internalState === 3 ? ulProgress : 0) * 100 }}
                className="drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Values */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLabel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500/80 mb-2"
                >
                  {isRunning ? getPhase() : isDone ? "Your Internet Speed" : "Ready"}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums"
                  animate={{ scale: isRunning ? [1, 1.01, 1] : 1 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {dlSpeed || "0"}
                </motion.span>
              </div>

              <span className="text-xl font-bold text-slate-500 uppercase tracking-widest">Mbps</span>
            </div>
          </div>

          {/* Test Controls & "More Info" Trigger */}
          <div className="flex flex-col items-center gap-6">
            {!isRunning ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  id="start-button"
                  onClick={startTest}
                  className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl font-black text-lg shadow-[0_20px_40px_rgba(6,182,212,0.3)] hover:shadow-[0_25px_50px_rgba(6,182,212,0.4)] transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative flex items-center gap-3">
                    {isDone ? "TEST AGAIN" : "START ENGINE"}
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                </button>
                {isDone && (
                  <button
                    id="show-more-button"
                    onClick={() => setShowMore(!showMore)}
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-8"
                  >
                    {showMore ? "Show less info" : "Show more info"}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={abortTest}
                  className="px-10 py-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-3xl font-bold text-sm hover:bg-red-500/20 transition-all flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  ABORT TEST
                </button>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-sm font-bold text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-8"
                >
                  {showMore ? "Hide progress" : "Show more info"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Extended Metrics Grid - Fast.com Style */}
        <AnimatePresence>
          {(showMore || isRunning) && (
            <motion.section
              id="detailed-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full grid grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Latency Section */}
              <div className="col-span-2 lg:col-span-1 bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <span className="text-green-400">⚡</span> Latency
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{ping || "--"}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Unloaded</span>
                    <span className="text-[10px] text-slate-400 mt-1">{jitter || "--"} ms Jitter</span>
                  </div>
                  <div className="flex flex-col border-l border-white/5 pl-4">
                    <span className="text-3xl font-black text-purple-400">{loadedLatency || "--"}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Loaded</span>
                    <span className="text-[10px] text-slate-400 mt-1">Bufferbloat</span>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <span className="text-purple-400">↑</span> Upload
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-5xl font-black tracking-tight">{ulSpeed || "--"}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Mbps</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${ulProgress * 100}%` }}
                  />
                </div>
              </div>

              {/* Environment Info */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <span className="text-cyan-400">🌐</span> Server Info
                </div>
                <div className="mt-4">
                  <div className="text-sm font-bold text-slate-200 truncate">{DEFAULT_SERVER.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
                    Optimized Node Selection
                  </div>
                </div>
                <div className="text-[10px] font-mono text-cyan-500 mt-4 bg-cyan-500/10 px-2 py-1 rounded inline-block w-fit">
                  SSL SECURED
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>Protocol: HTTPS/2</span>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <span>Core: Librespeed Worker</span>
          </div>
          <div>Powered by <span className="text-slate-300">FastNet Engine</span></div>
          <div className="flex items-center gap-4">
            <span>Stable Build</span>
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
