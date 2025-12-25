"use client";
import React from 'react';
import { Server, Globe } from 'lucide-react';

export default function ServerSelector({ selectedServer, onServerChange, servers, theme }) {
  const isDark = theme === 'dark';

  if (!servers || servers.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm'}`}>
      <div className="flex items-center gap-3 mb-3">
        <Server className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Test Server
        </h3>
      </div>

      <div className="relative">
        <select
          value={selectedServer?.id || ''}
          onChange={(e) => {
            const server = servers.find(s => s.id === e.target.value);
            onServerChange(server);
          }}
          className={`w-full p-3 pr-10 rounded-xl border appearance-none transition-all ${
            isDark
              ? 'bg-white/10 border-white/20 text-white focus:border-blue-400'
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          aria-label="Select test server"
        >
          {servers.map((server) => (
            <option key={server.id} value={server.id}>
              {server.name} - {server.location} ({server.distance} km)
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Globe className={`w-4 h-4 ${isDark ? 'text-blue-300' : 'text-slate-400'}`} />
        </div>
      </div>

      {selectedServer && (
        <div className={`mt-3 text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
          <div className="flex justify-between">
            <span>Host:</span>
            <span className={`font-mono ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
              {selectedServer.host}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Distance:</span>
            <span>{selectedServer.distance} km</span>
          </div>
        </div>
      )}
    </div>
  );
}
