"use client";

import { useTheme } from '../context/ThemeContext';
import SEOContent from '../components/SEOContent';
import { APP_STRINGS } from '../constants/strings';

export default function AboutContent() {
    const { theme } = useTheme();

    return (
        <main className={`min-h-screen pt-24 px-4 transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
            }`}>
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    About {APP_STRINGS.APP_NAME}
                </h1>

                {/* Reusing the SEO Content component which is perfect for the About page */}
                <SEOContent theme={theme} />

                {/* Footer */}
                <footer className={`text-center mt-12 mb-8 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-slate-500'}`}>
                    <p>{APP_STRINGS.FOOTER_TEXT}</p>
                </footer>
            </div>
        </main>
    );
}
