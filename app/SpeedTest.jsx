"use client"
import { useEffect, useRef, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

function formatMbps(bytesPerSec){
  if(!isFinite(bytesPerSec) || bytesPerSec <= 0) return 0
  return +(bytesPerSec * 8 / 1024 / 1024).toFixed(1)
}

function useAbortableFetch(){
  const controllerRef = useRef()
  useEffect(() => {}, [])
  const get = useCallback(async (url, opts={})=>{
    controllerRef.current = new AbortController()
    const res = await fetch(url, { signal: controllerRef.current.signal, ...opts })
    return res
  }, [])
  return { get }
}

function Logo() {
  return (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* WiFi signal waves */}
      <path d="M20 70 Q50 50 80 70" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M25 75 Q50 60 75 75" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 80 Q50 70 70 80" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="50" cy="85" r="3" fill="url(#logoGradient)"/>
      {/* Speed lines */}
      <path d="M15 40 L35 40" stroke="url(#logoGradient)" strokeWidth="2"/>
      <path d="M65 40 L85 40" stroke="url(#logoGradient)" strokeWidth="2"/>
      <path d="M40 15 L40 35" stroke="url(#logoGradient)" strokeWidth="2"/>
      <path d="M40 65 L40 85" stroke="url(#logoGradient)" strokeWidth="2"/>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function SpeedTest(){
  const [running, setRunning] = useState(false)
  const [download, setDownload] = useState(null)
  const [upload, setUpload] = useState(null)
  const [unloadedPing, setUnloadedPing] = useState(null)
  const [loadedPing, setLoadedPing] = useState(null)
  const [gauge, setGauge] = useState(0)
  const [error, setError] = useState(null)
  const [clientInfo, setClientInfo] = useState(null)
  const [progress, setProgress] = useState({ download: 0, upload: 0 })
  const { get } = useAbortableFetch()

  useEffect(() => {
    // Fetch client info on mount
    fetch('/api/client-info')
      .then(r => r.json())
      .then(data => setClientInfo(data))
      .catch(() => setClientInfo({
        ip: 'Unknown',
        version: 'Unknown',
        city: 'Unknown',
        country_name: 'Unknown',
        region: 'Unknown',
        isp: 'Unknown',
        status: 'error',
        reason: 'Connection failed'
      }))
  }, [])

  const runTest = useCallback(async ()=>{
    setRunning(true)
    setDownload(null); setUpload(null); setUnloadedPing(null); setLoadedPing(null); setGauge(0); setError(null); setProgress({ download: 0, upload: 0 })

    // Ping (unloaded)
    try{
      const t0 = performance.now()
      const r = await fetch('/api/ping')
      const t1 = performance.now()
      if(!r.ok) throw new Error('Ping failed')
      const ping = Math.round(t1 - t0)
      setUnloadedPing(ping)
    }catch(err){
      setError('Ping failed')
      toast.error('Ping failed — check your connection')
      setRunning(false)
      return
    }

    // Download test
    try{
      const start = performance.now()
      const resp = await get('/api/download')
      if(!resp.ok) throw new Error('Download request failed')
      const reader = resp.body.getReader()
      let received = 0
      const total = Number(resp.headers.get('Content-Length')) || 10*1024*1024
      while(true){
        const { done, value } = await reader.read()
        if(done) break
        received += value.length
        const elapsed = (performance.now() - start) / 1000
        const bps = received / Math.max(elapsed, 0.001)
        const mbps = formatMbps(bps)
        setDownload(mbps)
        setGauge(Math.min(mbps, 1000))
        setProgress(prev => ({ ...prev, download: (received / total) * 100 }))
      }
    }catch(err){
      setError('Download failed')
      toast.error('Download failed — offline or blocked')
      setRunning(false)
      return
    }

    // Upload test: send a 5MB blob
    try{
      setProgress(prev => ({ ...prev, upload: 10 }))
      const size = 5 * 1024 * 1024
      const chunk = new Uint8Array(1024)
      for(let i=0;i<chunk.length;i++) chunk[i]=i%256
      const parts = []
      let sent = 0
      while(sent < size){
        const remaining = Math.min(chunk.length, size - sent)
        parts.push(chunk.slice(0, remaining))
        sent += remaining
        setProgress(prev => ({ ...prev, upload: (sent / size) * 90 + 10 }))
      }
      const blob = new Blob(parts)
      setProgress(prev => ({ ...prev, upload: 100 }))
      const upStart = performance.now()
      const res = await fetch('/api/upload', { method: 'POST', body: blob })
      const upEnd = performance.now()
      if(!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      const durationSec = (upEnd - upStart) / 1000
      const bps = (json.bytes || blob.size) / Math.max(durationSec, 0.001)
      setUpload(formatMbps(bps))
    }catch(err){
      setError('Upload failed')
      toast.error('Upload failed — unable to send data')
      setRunning(false)
      return
    }

    // Ping (loaded)
    try{
      const t0 = performance.now()
      const r = await fetch('/api/ping')
      const t1 = performance.now()
      if(!r.ok) throw new Error('Ping failed')
      const ping = Math.round(t1 - t0)
      setLoadedPing(ping)
    }catch(err){
      // Ignore loaded ping error
    }

    setRunning(false)
    toast.success('Test complete')
  }, [get])

  useEffect(()=>{
    // Auto-start on mount
    runTest()
  }, [runTest])

  const share = async ()=>{
    const text = `My speed: ${download ?? '-'} Mbps down / ${upload ?? '-'} Mbps up / ${unloadedPing ?? '-'} ms ping`
    try{
      await navigator.clipboard.writeText(text)
      toast.success('Results copied to clipboard')
    }catch(err){
      toast.error('Copy failed')
    }
  }

  return (
    <div className="text-center p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-4xl mx-auto">
      <div className="flex items-start gap-6 mb-8">
        <Logo className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0" /> {/* Fixed logo size */}

        <div className="flex-1 min-w-0 -translate-x-[6.2%]">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
            Fast, reliable internet speed test
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="gauge-container">
          <Gauge value={download || 0} />
          {running && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm text-slate-500"></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <Metric icon="↓" label="Download" value={download ? `${download} Mbps` : running ? 'Testing…' : '-'} progress={progress.download} />
          <Metric icon="↑" label="Upload" value={upload ? `${upload} Mbps` : running ? 'Testing…' : '-'} progress={progress.upload} />
          <Metric icon="⚡" label="Latency" value={unloadedPing ? `${unloadedPing} ms` : running ? 'Testing…' : '-'} subValue={loadedPing ? `${loadedPing} ms` : null} />
        </div>

        {(clientInfo || unloadedPing) && (
          <div className="metric-card w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Client Information</div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="font-medium">IP Address:</span>
                    <span>{clientInfo ? clientInfo.ip : 'Loading…'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Version:</span>
                    <span>{clientInfo ? clientInfo.version : 'Loading…'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{clientInfo ? `${clientInfo.city}, ${clientInfo.region}` : 'Loading…'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{clientInfo ? clientInfo.country_name : 'Loading…'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ISP:</span>
                    <span>{clientInfo ? clientInfo.isp : 'Loading…'}</span>
                  </div>
                  {clientInfo && clientInfo.status === 'error' && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
                      <strong>Note:</strong> {clientInfo.reason || 'Unable to detect client information'}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Server Information</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <div>Local Server</div>
                  <div className="mt-2 text-xs text-slate-500">Running on your device</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button onClick={runTest} disabled={running} className="btn-primary flex items-center gap-2">
            {running ? <span className="spinner" aria-hidden /> : <PlayIcon />}
            {running ? 'Testing...' : 'Start Speed Test'}
          </button>
          <button onClick={share} className="btn-secondary flex items-center gap-2">
            <ShareIcon />
            Share Results
          </button>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        © {process.env.NEXT_PUBLIC_APP_NAME}
      </footer>
    </div>
  )
}

function Gauge({ value }) {
  return (
    <motion.div
      className="relative w-48 h-48 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.min(value / 100, 1) }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform="rotate(-90 100 100)"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Mbps</div>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ icon, label, value, progress = 0, subValue = null }){
  return (
    <div className="metric-card text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{value}</div>
      {subValue && <div className="text-sm text-slate-500">{subValue}</div>}
      {progress > 0 && progress < 100 && (
        <div className="mt-2 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  )
}

function PlayIcon(){
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  )
}

function ShareIcon(){
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}
