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
      console.error('Error fetching IP:', error);
    }
  };

  const measurePing = async () => {
    const measurements = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
          method: 'HEAD',
          cache: 'no-store'
        });
        const end = performance.now();
        measurements.push(end - start);
      } catch (error) {
        console.error('Ping measurement failed:', error);
      }
    }
    return measurements.length > 0
      ? measurements.reduce((a, b) => a + b) / measurements.length
      : 0;
  };

  const measureDownloadSpeed = async () => {
    const testDuration = 10000; // 10 seconds
    const warmupTime = 2000; // 2 seconds warmup
    const numConnections = 6; // Multiple parallel connections

    // Use our own optimized Vercel Edge endpoints
    const testUrls = [
      '/api/librespeed/garbage?ckSize=4',
      '/api/librespeed/garbage?ckSize=4',
      '/api/librespeed/garbage?ckSize=4',
      '/api/librespeed/garbage?ckSize=4',
      '/api/librespeed/garbage?ckSize=4',
      '/api/librespeed/garbage?ckSize=4'
    ];

    let totalBytes = 0;
    let validMeasurements = 0;
    const startTime = performance.now();
    let isWarmup = true;

    const downloadPromises = testUrls.slice(0, numConnections).map(async (url, index) => {
      let connectionBytes = 0;

      while (performance.now() - startTime < testDuration) {
        try {
          const cacheBuster = `${Date.now()}-${Math.random()}`;
          const response = await fetch(`${url}&cacheBuster=${cacheBuster}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          });

          const reader = response.body.getReader();
          let receivedLength = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            receivedLength += value.length;

            // Only count bytes after warmup period
            if (performance.now() - startTime > warmupTime) {
              if (isWarmup && index === 0) {
                isWarmup = false;
                totalBytes = 0;
                validMeasurements = 0;
              }
              connectionBytes += value.length;
            }
          }
        } catch (error) {
          console.error('Download error:', error);
          break;
        }
      }

      return connectionBytes;
    });

    const results = await Promise.all(downloadPromises);
    totalBytes = results.reduce((sum, bytes) => sum + bytes, 0);

    const actualTestTime = testDuration - warmupTime;
    const mbps = (totalBytes * 8) / (actualTestTime / 1000) / 1000000;

    return Math.max(mbps, 0);
  };

  const measureUploadSpeed = async () => {
    const testDuration = 8000; // 8 seconds
    const warmupTime = 1500; // 1.5 seconds warmup
    const numConnections = 4;

    // Generate random data to upload
    const chunkSize = 64000; // 64KB chunks (safe for crypto.getRandomValues)
    const generateData = () => {
      const array = new Uint8Array(chunkSize);
      crypto.getRandomValues(array);
      return array;
    };

    let totalBytes = 0;
    const startTime = performance.now();
    let isWarmup = true;

    const uploadPromises = Array(numConnections).fill(0).map(async () => {
      let connectionBytes = 0;

      while (performance.now() - startTime < testDuration) {
        try {
          const data = generateData();

          await fetch('/api/librespeed/empty', {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/octet-stream' }
          });

          if (performance.now() - startTime > warmupTime) {
            if (isWarmup) {
              isWarmup = false;
              totalBytes = 0;
            }
            connectionBytes += data.length;
          }
        } catch (error) {
          console.error('Upload error:', error);
          break;
        }
      }

      return connectionBytes;
    });

    const results = await Promise.all(uploadPromises);
    totalBytes = results.reduce((sum, bytes) => sum + bytes, 0);

    const actualTestTime = testDuration - warmupTime;
    const mbps = (totalBytes * 8) / (actualTestTime / 1000) / 1000000;

    return Math.max(mbps, 0);
  };

  const runTest = async () => {
    setTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);

    try {
      // Measure ping
      setStage('Measuring latency...');
      setProgress(10);
      const pingResult = await measurePing();
      setPing(Math.round(pingResult));
      setProgress(20);

      // Measure download speed
      setStage('Testing download speed...');
      const downloadResult = await measureDownloadSpeed();
      setDownloadSpeed(downloadResult);
      setProgress(60);

      // Measure upload speed
      setStage('Testing upload speed...');
      const uploadResult = await measureUploadSpeed();
      setUploadSpeed(uploadResult);
      setProgress(100);

      setStage('Complete!');
    } catch (error) {
      console.error('Speed test error:', error);
      setStage('Error - Please try again');
    } finally {
      setTimeout(() => {
        setTesting(false);
        setStage('');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wifi className="w-8 h-8 text-blue-300" />
            <h1 className="text-4xl font-bold text-white">SpeedNet</h1>
          </div>
          <p className="text-blue-200">Accurate Internet Speed Test</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">

          {/* IP and Location Info */}
          <div className="flex justify-between items-center mb-8 text-sm">
            <div className="flex items-center gap-2 text-blue-200">
              <Activity className="w-4 h-4" />
              <span>IP: {ip || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin className="w-4 h-4" />
              <span>{location || 'Loading...'}</span>
            </div>
          </div>

          {/* Speed Display */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Download */}
            <div className="text-center">
              <Download className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-white mb-1">
                {downloadSpeed.toFixed(2)}
              </div>
              <div className="text-blue-200 text-sm">Mbps Download</div>
            </div>

            {/* Upload */}
            <div className="text-center">
              <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-4xl font-bold text-white mb-1">
                {uploadSpeed.toFixed(2)}
              </div>
              <div className="text-blue-200 text-sm">Mbps Upload</div>
            </div>
          </div>

          {/* Ping */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-white mb-1">{ping} ms</div>
            <div className="text-blue-200 text-sm">Ping</div>
          </div>

          {/* Progress Bar */}
          {testing && (
            <div className="mb-6">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-blue-200 text-sm mt-2">{stage}</p>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={runTest}
            disabled={testing}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${testing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
              } text-white shadow-lg`}
          >
            {testing ? 'Testing...' : 'Start Speed Test'}
          </button>

          {/* Tips */}
          {!testing && (downloadSpeed > 0 || uploadSpeed > 0) && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-2">Tips for Accurate Results:</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Close other apps using internet</li>
                <li>• Use wired connection for best results</li>
                <li>• Test multiple times at different hours</li>
                <li>• Results may vary based on server distance</li>
              </ul>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="text-center mt-6 text-blue-200 text-sm">
          <p>Uses Cloudflare's infrastructure for accurate measurements</p>
          <p className="mt-1">Results show real-world speeds excluding warmup periods</p>
        </div>
      </div>
    </div>
  );
}
