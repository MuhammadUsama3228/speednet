import React from 'react';
import { APP_STRINGS } from '../constants/strings';

export default function SimpleFooter() {
    return (
        <footer className="py-8 pb-12 text-center" role="contentinfo">
            <p className="text-xs sm:text-sm font-medium opacity-50 text-slate-500 dark:text-blue-200 tracking-wide">
                {APP_STRINGS.FOOTER_TEXT}
            </p>
        </footer>
    );
}
