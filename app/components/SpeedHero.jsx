import React from 'react';
import { Rocket } from 'lucide-react';
import { APP_STRINGS } from '../constants/strings';

export default function SpeedHero() {
    return (
        <div className="text-center mb-8 md:mb-12 pt-4">
            <div className="inline-block p-2 md:p-3 rounded-2xl bg-blue-500/10 mb-3 md:mb-4 animate-float will-change-transform">
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight text-slate-900 dark:text-white">
                {APP_STRINGS.HERO_TITLE}
            </h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto px-6 text-slate-600 dark:text-blue-200">
                {APP_STRINGS.HERO_SUBTITLE}
            </p>
        </div>
    );
}
