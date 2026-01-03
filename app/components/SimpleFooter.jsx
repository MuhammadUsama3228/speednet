import React from 'react';
import Link from 'next/link';
import { APP_STRINGS } from '../constants/strings';

export default function SimpleFooter() {
    return (
        <footer className="py-8 pb-12 text-center border-t border-slate-200 dark:border-white/10" role="contentinfo">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-6 mb-4">
                    <Link href="/contact" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity text-slate-600 dark:text-blue-200">
                        Contact Us
                    </Link>
                    <Link href="/privacy" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity text-slate-600 dark:text-blue-200">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity text-slate-600 dark:text-blue-200">
                        Terms of Service
                    </Link>
                </div>
                <p className="text-xs sm:text-sm font-medium opacity-50 text-slate-500 dark:text-blue-200 tracking-wide">
                    {APP_STRINGS.FOOTER_TEXT}
                </p>
            </div>
        </footer>
    );
}
