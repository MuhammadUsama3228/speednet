"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Download, Upload, Activity, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [calculationDetails, setCalculationDetails] = useState(null);

  // Critical: Use refs to track actual bytes and time
  const bytesRef = useRef(0);
  const startTimeRef = useRef(0);
  const isTestingRef = useRef(false);

  useEffect(() => {
    fetchIPInfo();
  }, []);

  const fetchIPInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setIp(data.ip);
      setLocation(`${data.city}, ${data.country_name}`);
    } catch (error) {
      setIp('Unable to detect');
      setLocation('Unknown');
    }
  };

  const measurePing = async () => {
    const pings = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        // Ping to Cloudflare's CDN
        await fetch('https://cloudflare.com/cdn-cgi/trace', {
          method: 'HEAD',
          cache: 'no-store'
        });
        pings.push(performance.now() - start);
      } catch (e) {
        console.error('Ping error:', e);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    pings.sort((a, b) => a - b);
    const middle = pings.slice(1, -1);
    return middle.length > 0 ? Math.round(middle.reduce((a, b) => a + b) / middle.length) : 0;
  };

  const downloadTest = async () => {
    console.log('=== DOWNLOAD TEST START ===');
    console.log('Using Cloudflare CDN for accurate internet speed measurement');

    bytesRef.current = 0;
    startTimeRef.current = 0;
    isTestingRef.current = true;

    const TEST_DURATION = 10000; // 10 seconds
    const WARMUP = 2000; // 2 second warmup
    const testStart = performance.now();

    const speedInterval = setInterval(() => {
      if (startTimeRef.current > 0 && bytesRef.current > 0) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        if (elapsed > 0) {
          const mbps = (bytesRef.current * 8) / (elapsed * 1000000);
          setLiveSpeed(mbps);
        }
      }
    }, 300);

    // Start 6 parallel downloads from Cloudflare CDN
    const workers = [];
    for (let i = 0; i < 6; i++) {
      workers.push((async () => {
        while (isTestingRef.current && performance.now() - testStart < TEST_DURATION) {
          try {
            // CRITICAL: Use external CDN, not local endpoints!
            const uniqueId = `${Date.now()}-${Math.random()}-${i}`;
            const url = `https://speed.cloudflare.com/__down?bytes=25000000&r=${uniqueId}`;

            const response = await fetch(url, {
              cache: 'no-store',
              headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();

            while (isTestingRef.current) {
              const { done, value } = await reader.read();
              if (done) break;

              const now = performance.now();
              const elapsed = now - testStart;

              // After warmup, start counting
              if (elapsed > WARMUP) {
                if (startTimeRef.current === 0) {
                  startTimeRef.current = now;
                  bytesRef.current = 0;
                  console.log('✓ Warmup complete, now measuring actual download speed...');
                }
                bytesRef.current += value.length;
              }

              if (elapsed >= TEST_DURATION) {
                reader.cancel();
                break;
              }
            }
          } catch (e) {
            console.error(`Download worker ${i} error:`, e);
            await new Promise(r => setTimeout(r, 100));
          }
        }
      })());
    }

    await Promise.race([
      Promise.all(workers),
      new Promise(r => setTimeout(r, TEST_DURATION + 1000))
    ]);

    isTestingRef.current = false;
    clearInterval(speedInterval);

    // Calculate final result
    if (startTimeRef.current > 0 && bytesRef.current > 0) {
      const totalSeconds = (performance.now() - startTimeRef.current) / 1000;
      const totalMB = bytesRef.current / 1000000;
      const totalMegabits = (bytesRef.current * 8) / 1000000;
      const mbps = totalMegabits / totalSeconds;

      console.log('=== DOWNLOAD COMPLETE ===');
      console.log(`📊 Downloaded: ${totalMB.toFixed(3)} MB`);
      console.log(`⏱️  Time measured: ${totalSeconds.toFixed(3)} seconds`);
      console.log(`📈 Calculation: (${totalMB.toFixed(3)} MB × 8 bits/byte) ÷ ${totalSeconds.toFixed(3)}s`);
      console.log(`📈 = ${totalMegabits.toFixed(3)} Mb ÷ ${totalSeconds.toFixed(3)}s`);
      console.log(`🎯 = ${mbps.toFixed(3)} Mbps`);
      console.log('');

      setCalculationDetails({
        type: 'download',
        bytes: bytesRef.current,
        mb: totalMB,
        seconds: totalSeconds,
        mbps: mbps
      });

      return Math.min(Math.max(mbps, 0), 10000);
    }

    return 0;
  };

  const uploadTest = async () => {
    console.log('=== UPLOAD TEST START ===');
    console.log('Using Cloudflare CDN for accurate upload measurement');

    bytesRef.current = 0;
    startTimeRef.current = 0;
    isTestingRef.current = true;

    const TEST_DURATION = 8000;
    const WARMUP = 1500;
    const testStart = performance.now();

    // Generate 1MB chunks for upload
    const chunkSize = 1000000;
    const uploadData = new Uint8Array(chunkSize);
    crypto.getRandomValues(uploadData);

    const speedInterval = setInterval(() => {
      if (startTimeRef.current > 0 && bytesRef.current > 0) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        if (elapsed > 0) {
          const mbps = (bytesRef.current * 8) / (elapsed * 1000000);
          setLiveSpeed(mbps);
        }
      }
    }, 300);

    const workers = [];
    for (let i = 0; i < 4; i++) {
      workers.push((async () => {
        while (isTestingRef.current && performance.now() - testStart < TEST_DURATION) {
          try {
            // CRITICAL: Use external CDN endpoint!
            await fetch('https://speed.cloudflare.com/__up', {
              method: 'POST',
              body: uploadData,
              cache: 'no-store',
              headers: { 'Content-Type': 'application/octet-stream' }
            });

            const now = performance.now();
            const elapsed = now - testStart;

            if (elapsed > WARMUP) {
              if (startTimeRef.current === 0) {
                startTimeRef.current = now;
                bytesRef.current = 0;
                console.log('✓ Warmup complete, now measuring actual upload speed...');
              }
              bytesRef.current += uploadData.length;
            }

            if (elapsed >= TEST_DURATION) break;
          } catch (e) {
            console.error(`Upload worker ${i} error:`, e);
            await new Promise(r => setTimeout(r, 100));
          }
        }
      })());
    }

    await Promise.race([
      Promise.all(workers),
      new Promise(r => setTimeout(r, TEST_DURATION + 1000))
    ]);

    isTestingRef.current = false;
    clearInterval(speedInterval);

    if (startTimeRef.current > 0 && bytesRef.current > 0) {
      const totalSeconds = (performance.now() - startTimeRef.current) / 1000;
      const totalMB = bytesRef.current / 1000000;
      const totalMegabits = (bytesRef.current * 8) / 1000000;
      const mbps = totalMegabits / totalSeconds;

      console.log('=== UPLOAD COMPLETE ===');
      console.log(`📊 Uploaded: ${totalMB.toFixed(3)} MB`);
      console.log(`⏱️  Time measured: ${totalSeconds.toFixed(3)} seconds`);
      console.log(`📈 Calculation: (${totalMB.toFixed(3)} MB × 8) ÷ ${totalSeconds.toFixed(3)}s`);
      console.log(`🎯 = ${mbps.toFixed(3)} Mbps`);
      console.log('');

      setCalculationDetails({
        type: 'upload',
        bytes: bytesRef.current,
        mb: totalMB,
        seconds: totalSeconds,
        mbps: mbps
      });

      return Math.min(Math.max(mbps, 0), 10000);
    }

    return 0;
  };

  const runTest = async () => {
    setTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setLiveSpeed(0);
    setCalculationDetails(null);

    console.clear();
    console.log('%c🚀 SpeedNet - Accurate Internet Speed Test', 'color: #00ff00; font-size: 18px; font-weight: bold');
    console.log('%c⚠️  Using Cloudflare CDN to measure real internet speed', 'color: #ffaa00; font-size: 14px');
    console.log('');

    try {
      // Ping
      setStage('Measuring latency...');
      setProgress(10);
      const pingResult = await measurePing();
      setPing(pingResult);
      console.log(`✅ Ping: ${pingResult}ms\n`);
      setProgress(20);
      await new Promise(r => setTimeout(r, 300));

      // Download
      setStage('Testing download speed...');
      setLiveSpeed(0);
      const dlSpeed = await downloadTest();
      setDownloadSpeed(dlSpeed);
      setProgress(60);
      await new Promise(r => setTimeout(r, 500));

      // Upload
      setStage('Testing upload speed...');
      setLiveSpeed(0);
      const ulSpeed = await uploadTest();
      setUploadSpeed(ulSpeed);
      setProgress(100);

      setStage('Complete!');
      console.log('%c✅ TEST COMPLETE!', 'color: #00ff00; font-size: 16px; font-weight: bold');
      console.log(`Download: ${dlSpeed.toFixed(2)} Mbps`);
      console.log(`Upload: ${ulSpeed.toFixed(2)} Mbps`);
      console.log(`Ping: ${pingResult}ms`);

    } catch (error) {
      console.error('❌ Test failed:', error);
      setStage('Test failed');
    } finally {
      isTestingRef.current = false;
      setLiveSpeed(0);
      setTimeout(() => {
        setTesting(false);
        setStage('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wifi className="w-10 h-10 text-blue-300" />
            <h1 className="text-5xl font-bold text-white">
              SpeedNet
            </h1>
          </div>
          <p className="text-blue-200 text-lg">Accurate Internet Speed Test</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">

          {/* IP Info */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10 text-sm">
            <div className="flex items-center gap-2 text-blue-200">
              <Activity className="w-4 h-4" />
              <span>IP: {ip || '...'}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin className="w-4 h-4" />
              <span>{location || '...'}</span>
            </div>
          </div>

          {/* Live Speed */}
          {testing && liveSpeed > 0 && (
            <div className="text-center mb-8 animate-pulse">
              <div className="text-6xl font-bold text-white">
                {liveSpeed.toFixed(2)}
              </div>
              <div className="text-blue-200 text-lg mt-2">Mbps (Live)</div>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Download className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {downloadSpeed.toFixed(2)}
              </div>
              <div className="text-blue-200 text-xs uppercase">Download</div>
              <div className="text-blue-300 text-xs mt-1">Mbps</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Upload className="w-8 h-8 text-sky-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {uploadSpeed.toFixed(2)}
              </div>
              <div className="text-blue-200 text-xs uppercase">Upload</div>
              <div className="text-blue-300 text-xs mt-1">Mbps</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Activity className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {ping}
              </div>
              <div className="text-blue-200 text-xs uppercase">Ping</div>
              <div className="text-blue-300 text-xs mt-1">ms</div>
            </div>
          </div>

          {/* Progress */}
          {testing && (
            <div className="mb-6">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-blue-300 text-sm mt-3 font-medium">{stage}</p>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={runTest}
            disabled={testing}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg ${testing
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-[1.02] text-white'
              }`}
          >
            {testing ? 'Testing...' : 'START SPEED TEST'}
          </button>

          {/* Results with Calculation */}
          {!testing && downloadSpeed > 0 && (
            <>
              <div className="mt-6 p-5 bg-green-500/10 rounded-2xl border border-green-500/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Test Complete
                </h3>
                <div className="text-blue-200 text-sm space-y-2">
                  <p>• Download: <span className="text-white font-bold">{downloadSpeed.toFixed(2)} Mbps</span> = {(downloadSpeed / 8).toFixed(2)} MB/s</p>
                  <p>• Upload: <span className="text-white font-bold">{uploadSpeed.toFixed(2)} Mbps</span> = {(uploadSpeed / 8).toFixed(2)} MB/s</p>
                  <p>• Latency: <span className="text-white font-bold">{ping} ms</span></p>
                </div>
              </div>

              {/* Calculation Details */}
              {calculationDetails && (
                <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    How We Calculated {calculationDetails.type === 'download' ? 'Download' : 'Upload'} Speed
                  </h4>
                  <div className="font-mono text-xs text-blue-200 space-y-1">
                    <p>Data transferred: <span className="text-white">{calculationDetails.mb.toFixed(3)} MB</span></p>
                    <p>Time measured: <span className="text-white">{calculationDetails.seconds.toFixed(3)} seconds</span></p>
                    <p className="pt-2 border-t border-blue-500/20">Calculation:</p>
                    <p className="text-blue-100">
                      ({calculationDetails.mb.toFixed(3)} MB × 8 bits) ÷ {calculationDetails.seconds.toFixed(3)}s = <span className="text-white font-bold">{calculationDetails.mbps.toFixed(2)} Mbps</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Debug Tip */}
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-300">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">F12</kbd> to see detailed logs with step-by-step calculations
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-300 text-sm">
          <p>Powered by Cloudflare CDN • Measures real internet speed • Excludes warmup</p>
        </div>
      </div>
    </div>
  );
}
