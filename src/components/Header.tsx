import React, { useEffect, useState } from 'react';
import { Search, Sun, Moon, Clock } from 'lucide-react';
import { PlayerMode, Theme } from '../types';

interface HeaderProps {
  activeTab: 'events' | 'channels';
  setActiveTab: (tab: 'events' | 'channels') => void;
  playerMode: PlayerMode;
  setPlayerMode: (mode: PlayerMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  eventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playerMode,
  setPlayerMode,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
  eventsCount,
}) => {
  const [panamaTime, setPanamaTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'America/Panama',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('es-PA', options);
        setPanamaTime(formatter.format(new Date()));
      } catch (e) {
        setPanamaTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b select-none transition-colors ${
        isDark ? 'bg-black border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight">STREAMTP</span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              DIRECTO
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'events'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Agenda ({eventsCount})
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'channels'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Canales 24/7
            </button>
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-36 sm:w-48">
            <Search
              className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className={`w-full rounded border pl-8 pr-2.5 py-1 text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400'
              }`}
            />
          </div>

          {/* Player Mode Switcher */}
          <div
            className={`flex items-center p-0.5 rounded border text-xs font-medium ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
            }`}
          >
            <button
              onClick={() => setPlayerMode('global1')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                playerMode === 'global1'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'bg-white text-black shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-500 hover:text-black'
              }`}
              title="global1.php: Reproducción manual"
            >
              Manual
            </button>
            <button
              onClick={() => setPlayerMode('global2')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                playerMode === 'global2'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'bg-white text-black shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-500 hover:text-black'
              }`}
              title="global2.php: Reproducción automática"
            >
              Auto
            </button>
          </div>

          {/* Clock */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded border ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <Clock className="w-3 h-3 opacity-50" />
            <span>{panamaTime}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-1.5 rounded border transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-200'
            }`}
            title={isDark ? 'Modo Blanco' : 'Modo Oscuro'}
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="sm:hidden flex items-center justify-around border-t px-2 py-1.5 text-xs font-medium border-inherit">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1 rounded ${
            activeTab === 'events'
              ? isDark
                ? 'bg-zinc-800 text-white font-bold'
                : 'bg-zinc-200 text-black font-bold'
              : 'text-zinc-500'
          }`}
        >
          Agenda ({eventsCount})
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-3 py-1 rounded ${
            activeTab === 'channels'
              ? isDark
                ? 'bg-zinc-800 text-white font-bold'
                : 'bg-zinc-200 text-black font-bold'
              : 'text-zinc-500'
          }`}
        >
          Canales 24/7
        </button>
      </div>
    </header>
  );
};
