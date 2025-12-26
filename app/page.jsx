"use client"

import SpeedTest from './SpeedTest'

export default function Page(){
  return (
    <>
      <div className="max-w-2xl mx-auto text-center mb-8 text-base text-slate-700 dark:text-blue-200">
        ScanPing is a free, fast, and accurate internet speed test. Instantly check your download, upload, ping, and latency. No registration required.
      </div>
      <SpeedTest />
    </>
  )
}
