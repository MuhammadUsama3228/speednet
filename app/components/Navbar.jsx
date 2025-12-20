"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APP_STRINGS } from '../constants/strings';
import { useState } from 'react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDark = theme === 'dark';

    const NavLink = ({ href, label }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`font-medium transition-colors ${isActive
                    ? (isDark ? 'text-blue-400' : 'text-blue-600')
                    : (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                    }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b transition-colors duration-300 ${isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white/80 border-slate-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt={APP_STRINGS.APP_NAME}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                            priority
                        />
                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {APP_STRINGS.APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="/" label="Speed Test" />
                        <NavLink href="/blog" label="Blog" />
                        <NavLink href="/about" label="About & FAQ" />

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={`md:hidden px-4 pt-2 pb-4 space-y-2 border-t ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'
                    }`}>
                    <Link
                        href="/"
                        className={`block px-3 py-2 rounded-md font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Speed Test
                    </Link>
                    <Link
                        href="/blog"
                        className={`block px-3 py-2 rounded-md font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/about"
                        className={`block px-3 py-2 rounded-md font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-50'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About & FAQ
                    </Link>
                </div>
            )}
        </nav>
    );
}
