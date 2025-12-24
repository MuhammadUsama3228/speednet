"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ResultCard({ icon: Icon, value, label, unit, colorClass, theme }) {
    const isDark = theme === 'dark';

    return (
        <div className={`rounded-2xl p-4 md:p-6 text-center border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'
            }`}>
            <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorClass} mx-auto mb-3`} aria-hidden="true" />
            <div className={`text-2xl md:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {value}
            </div>
            <div className={`text-[10px] md:text-xs uppercase ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>
                {label}
            </div>
            <div className={`text-[10px] md:text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-slate-400'}`}>
                {unit}
            </div>
        </div>
    );
}
