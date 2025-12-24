"use client";
import React from 'react';

export default function TestHistory({ history, clearHistory, theme }) {
    const isDark = theme === 'dark';

    if (history.length === 0) return null;

    return (
        <div className={`mt-6 p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
            <h3 className={`font-bold mb-3 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <span>Test History</span>
                <button
                    onClick={clearHistory}
                    className={`text-xs px-2 py-1 rounded hover:bg-red-500/10 ${isDark ? 'text-blue-300 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                >
                    Clear
                </button>
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {history.map((test, index) => (
                    <div key={index} className={`flex items-center justify-between text-xs p-2 rounded-md ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className="flex flex-col">
                            <span className={`font-mono text-[10px] ${isDark ? 'text-blue-300' : 'text-slate-400'}`}>{test.date}</span>
                            <span className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-700'}`}>{test.dl} ↓ / {test.ul} ↑</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{test.ping} ms</span>
                                <span className={`text-[10px] ${isDark ? 'text-blue-300' : 'text-slate-400'}`}>Scanpings.net</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
