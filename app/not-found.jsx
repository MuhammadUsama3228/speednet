"use client";

import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function NotFound() {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-20 flex flex-col items-center justify-center p-4 transition-colors duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white'
                : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-800'
            }`}>
            <div className={`text-center max-w-lg p-8 rounded-3xl backdrop-blur-xl border shadow-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/70 border-white/60'
                }`}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-500'
                    }`}>
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
                <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <Link
                    href="/"
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 ${theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl'
                        }`}
                >
                    <Home className="w-5 h-5" />
                    Return Home
                </Link>
            </div>
        </div>
    );
}
