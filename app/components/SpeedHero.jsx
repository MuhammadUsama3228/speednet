"use client";
import React from 'react';
import { Rocket } from 'lucide-react';
import { APP_STRINGS } from '../constants/strings';

export default function SpeedHero({ theme }) {
    const isDark = theme === 'dark';

    return (
        <div className="text-center mb-8 md:mb-12 pt-4">
            <div className="inline-block p-3 rounded-2xl bg-blue-500/10 mb-4 animate-bounce">
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            </div>
            <h1 className={`text-3xl md:text-6xl font-black mb-4 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {APP_STRINGS.HERO_TITLE}
            </h1>
            <p className={`text-base md:text-xl max-w-2xl mx-auto px-4 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                {APP_STRINGS.HERO_SUBTITLE}
            </p>
        </div>
    );
}
