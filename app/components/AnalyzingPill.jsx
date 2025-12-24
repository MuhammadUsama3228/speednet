"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyzingPill({ theme }) {
    const isDark = theme === 'dark';

    return (
        <div className="flex justify-center mb-8">
            <div className={`px-5 py-2 rounded-full border flex items-center gap-3 backdrop-blur-md shadow-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-200 shadow-blue-500/5'
                }`}>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                    ))}
                </div>
                <span className={`text-[10px] md:text-xs font-black tracking-widest uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                    Analyzing Network Data...
                </span>
            </div>
        </div>
    );
}
