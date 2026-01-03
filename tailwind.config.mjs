/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#06b6d4'
      }
    }
  },
  plugins: [],
  // Performance optimizations
  corePlugins: {
    preflight: true,
  },
  // Reduce bundle size by only including used colors
  safelist: [
    // Theme colors
    'text-slate-600',
    'text-slate-700',
    'text-slate-800',
    'text-slate-900',
    'text-blue-100',
    'text-blue-600',
    'text-blue-800',
    'text-white',
    'bg-blue-50',
    'bg-white',
    'bg-blue-900',
    'bg-blue-600',
    'border-blue-100',
    'border-blue-200',
    'border-slate-200',
    'border-white/10'
  ]
}
