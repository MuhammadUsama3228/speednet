"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, Download, Upload, Activity, MapPin } from 'lucide-react';

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(0);

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
      setIp('Unable to fetch');
      setLocation('Unknown');
    }
  };

  const measurePing = async () => {
    const measurements = [];
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      try {
        // Use local endpoint to avoid CORS, but cache-busting ensures actual RTT
        await fetch('/api/librespeed/empty?r=' + Math.random(), {
          method: 'HEAD',
          cache: 'no-store'
        });
        const end = performance.now();
        measurements.push(end - start);
      } catch (error) {
        console.error('Ping failed:', error);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return measurements.length > 0
      ? Math.round(measurements.reduce((a, b) => a + b) / measurements.length)
      : 0;
  };

  const measureDownloadSpeed = async () => {
    return new Promise(async (resolve) => {
      const testDuration = 15000; // 15 seconds total
      const warmupDuration = 3000; // 3 second warmup
      let totalBytesAfterWarmup = 0;
      let testStartTime = null;
      let connections = [];
      const startTime = Date.now();

      // Create 6 parallel download streams for better saturation
      const numStreams = 6;

      for (let i = 0; i < numStreams; i++) {
        const downloadStream = async () => {
          while (Date.now() - startTime < testDuration) {
            try {
              // Use local proxy to avoid CORS. ckSize=8 requests 8MB chunks.
              const cacheBuster = Date.now() + Math.random();
              const url = `/api/librespeed/garbage?ckSize=8&r=${cacheBuster}`;

              const response = await fetch(url, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
              });

              if (!response.ok) throw new Error('Download failed');

              const reader = response.body.getReader();

              while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const currentTime = Date.now();
                const elapsed = currentTime - startTime;

                // Start counting bytes after warmup
                if (elapsed > warmupDuration) {
                  if (testStartTime === null) {
                    testStartTime = currentTime;
                    totalBytesAfterWarmup = 0;
                  }
                  totalBytesAfterWarmup += value.length;

                  // Calculate and display current speed
                  const testElapsed = (currentTime - testStartTime) / 1000;
                  if (testElapsed > 0) {
                    const currentMbps = (totalBytesAfterWarmup * 8) / (testElapsed * 1000000);
                    setCurrentSpeed(currentMbps);
                  }
                }

                // Stop if we've exceeded test duration
                if (currentTime - startTime >= testDuration) {
                  reader.cancel();
                  break;
                }
              }
            } catch (error) {
              // Connection error, will retry or finish
              await new Promise(r => setTimeout(r, 100));
            }
          }
        };

        connections.push(downloadStream());
      }

      // Wait for all connections to finish
      await Promise.all(connections);

      // Calculate final speed
      if (testStartTime && totalBytesAfterWarmup > 0) {
        const actualTestTime = (Date.now() - testStartTime) / 1000; // in seconds
        const megabits = (totalBytesAfterWarmup * 8) / 1000000;
        const mbps = megabits / actualTestTime;
        resolve(mbps);
      } else {
        resolve(0);
      }
    });
  };

  const measureUploadSpeed = async () => {
    return new Promise(async (resolve) => {
      const testDuration = 10000; // 10 seconds
      const warmupDuration = 2000; // 2 second warmup
      let totalBytesAfterWarmup = 0;
      let testStartTime = null;
      const startTime = Date.now();

      // Generate random data
      // FIXED: Reduced to 64KB to prevent browser crash (QuotaExceededError)
      const chunkSize = 64000;
      const testData = new Uint8Array(chunkSize);
      crypto.getRandomValues(testData);

      const numStreams = 4;
      const connections = [];

      for (let i = 0; i < numStreams; i++) {
        const uploadStream = async () => {
          while (Date.now() - startTime < testDuration) {
            try {
              // Use local proxy to avoid CORS
              await fetch('/api/librespeed/empty', {
                method: 'POST',
                body: testData,
                cache: 'no-store',
                headers: {
                  'Content-Type': 'application/octet-stream'
                }
              });

              const currentTime = Date.now();
              const elapsed = currentTime - startTime;

              // Count bytes after warmup
              if (elapsed > warmupDuration) {
                if (testStartTime === null) {
                  testStartTime = currentTime;
                  totalBytesAfterWarmup = 0;
                }
                totalBytesAfterWarmup += testData.length;

                // Calculate current speed
                const testElapsed = (currentTime - testStartTime) / 1000;
                if (testElapsed > 0) {
                  const currentMbps = (totalBytesAfterWarmup * 8) / (testElapsed * 1000000);
                  setCurrentSpeed(currentMbps);
                }
              }

              if (currentTime - startTime >= testDuration) {
                break;
              }
            } catch (error) {
              await new Promise(r => setTimeout(r, 100));
            }
          }
        };

        connections.push(uploadStream());
      }

      await Promise.all(connections);

      if (testStartTime && totalBytesAfterWarmup > 0) {
        const actualTestTime = (Date.now() - testStartTime) / 1000;
        const megabits = (totalBytesAfterWarmup * 8) / 1000000;
        const mbps = megabits / actualTestTime;
        resolve(mbps);
      } else {
        resolve(0);
      }
    });
  };

  const runTest = async () => {
    setTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentSpeed(0);

    try {
      // Ping test
      setStage('Measuring latency...');
      setProgress(10);
      const pingResult = await measurePing();
      setPing(pingResult);
      setProgress(25);
      await new Promise(r => setTimeout(r, 500));

      // Download test
      setStage('Testing download speed...');
      setCurrentSpeed(0);
      const downloadResult = await measureDownloadSpeed();
      setDownloadSpeed(downloadResult);
      setProgress(65);
      await new Promise(r => setTimeout(r, 500));

      // Upload test
      setStage('Testing upload speed...');
      setCurrentSpeed(0);
      const uploadResult = await measureUploadSpeed();
      setUploadSpeed(uploadResult);
      setProgress(100);

      setStage('Complete!');
    } catch (error) {
      console.error('Test error:', error);
      setStage('Test failed - please try again');
    } finally {
      setCurrentSpeed(0);
      setTimeout(() => {
        setTesting(false);
        setStage('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wifi className="w-10 h-10 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">SpeedNet</h1>
          </div>
          <p className="text-blue-300 text-lg">Professional Internet Speed Test</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">

          {/* IP Info */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-blue-200">
              <Activity className="w-4 h-4" />
              <span className="text-sm">IP: {ip || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location || 'Loading...'}</span>
            </div>
          </div>

          {/* Real-time Speed Display */}
          {testing && currentSpeed > 0 && (
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-white">
                {currentSpeed.toFixed(1)}
              </div>
              <div className="text-blue-300 mt-1">Mbps (Live)</div>
            </div>
          )}

          {/* Speed Results Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Download */}
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Download className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">
                {downloadSpeed.toFixed(1)}
              </div>
              <div className="text-blue-300 text-xs uppercase tracking-wide">Download</div>
              <div className="text-blue-400 text-xs mt-1">Mbps</div>
            </div>

            {/* Upload */}
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Upload className="w-8 h-8 text-sky-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">
                {uploadSpeed.toFixed(1)}
              </div>
              <div className="text-blue-300 text-xs uppercase tracking-wide">Upload</div>
              <div className="text-blue-400 text-xs mt-1">Mbps</div>
            </div>

            {/* Ping */}
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
              <Activity className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">
                {ping}
              </div>
              <div className="text-blue-300 text-xs uppercase tracking-wide">Ping</div>
              <div className="text-blue-400 text-xs mt-1">ms</div>
            </div>
          </div>

          {/* Progress Bar */}
          {testing && (
            <div className="mb-6">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out"
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
                : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:shadow-2xl hover:scale-[1.02] text-white'
              }`}
          >
            {testing ? 'Testing in Progress...' : 'START SPEED TEST'}
          </button>

          {/* Results Info */}
          {!testing && downloadSpeed > 0 && (
            <div className="mt-6 p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Test Complete
              </h3>
              <div className="text-blue-200 text-sm space-y-2">
                <p>• Your download speed is <strong className="text-white">{downloadSpeed.toFixed(1)} Mbps</strong></p>
                <p>• Your upload speed is <strong className="text-white">{uploadSpeed.toFixed(1)} Mbps</strong></p>
                <p>• Your latency is <strong className="text-white">{ping} ms</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-blue-300 text-sm mb-2">Powered by Optimized Edge Network</p>
          <p className="text-blue-400/60 text-xs">
            For best results: close other apps, use wired connection, test multiple times
          </p>
        </div>
      </div>
    </div>
  );
}
