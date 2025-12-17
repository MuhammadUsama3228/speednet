"use client"
import { useState, useEffect } from 'react'

export default function ThemeProvider({ children }){
  const [theme, setTheme] = useState('system')

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem('theme')
    const isDark = stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    if(theme === 'system'){
      localStorage.removeItem('theme')
      const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', sysDark)
    } else {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="sr-only">Theme</span>
            <select aria-label="Theme" value={theme} onChange={e => setTheme(e.target.value)} className="bg-transparent border rounded px-2 py-1 text-sm">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
}
