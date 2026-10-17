import React from 'react';
import { Search, Sun, Moon, Shield, Radio, Trophy, Flag } from 'lucide-react';
import { PlaybackMode, Theme } from '../types';

interface HeaderProps {
  activeTab: 'all' | 'futbol' | 'f1' | 'channels' | 'servers';
  setActiveTab: (tab: 'all' | 'futbol' | 'f1' | 'channels' | 'servers') => void;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  eventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playbackMode,
  setPlaybackMode,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
  eventsCount,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b select-none transition-colors sticky top-0 z-50 ${
        isDark ? 'bg-black border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab('all')}
            className="flex items-center gap-2 text-left"
          >
            <span className="font-black text-lg tracking-tight">STREAMXHD</span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-700'
              }`}
            >
              EN VIVO
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'all'
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
              onClick={() => setActiveTab('futbol')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'futbol'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 opacity-60" />
              <span>Fútbol</span>
            </button>

            <button
              onClick={() => setActiveTab('f1')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'f1'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Flag className="w-3.5 h-3.5 opacity-60" />
              <span>Fórmula 1</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'channels'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Radio className="w-3.5 h-3.5 opacity-60" />
              <span>Canales 24/7</span>
            </button>

            <button
              onClick={() => setActiveTab('servers')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'servers'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Shield className="w-3.5 h-3.5 opacity-60" />
              <span>Servidores</span>
            </button>
          </nav>
        </div>

        {/* Right Tools: Search, Manual/Auto Mode, Theme */}
        <div className="flex items-center gap-2.5">
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
              placeholder="Buscar evento o canal..."
              className={`w-full rounded border pl-8 pr-2.5 py-1 text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400'
              }`}
            />
          </div>

          {/* Mode Switcher: Live1 Manual / Live2 Auto */}
          <div
            className={`flex items-center p-0.5 rounded border text-xs font-medium ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
            }`}
          >
            <button
              onClick={() => setPlaybackMode('live1')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                playbackMode === 'live1'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'bg-white text-black shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-500 hover:text-black'
              }`}
              title="Live1: Reproducción manual (sin audio automático)"
            >
              Manual
            </button>
            <button
              onClick={() => setPlaybackMode('live2')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                playbackMode === 'live2'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'bg-white text-black shadow-xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-500 hover:text-black'
              }`}
              title="Live2: Reproducción automática"
            >
              Auto
            </button>
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
      <div className="lg:hidden flex items-center justify-around border-t px-2 py-1.5 text-xs font-medium border-inherit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2 py-1 rounded ${activeTab === 'all' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Agenda
        </button>
        <button
          onClick={() => setActiveTab('futbol')}
          className={`px-2 py-1 rounded ${activeTab === 'futbol' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Fútbol
        </button>
        <button
          onClick={() => setActiveTab('f1')}
          className={`px-2 py-1 rounded ${activeTab === 'f1' ? 'font-bold underline' : 'opacity-60'}`}
        >
          F1 & Motor
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-2 py-1 rounded ${activeTab === 'channels' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Canales
        </button>
        <button
          onClick={() => setActiveTab('servers')}
          className={`px-2 py-1 rounded ${activeTab === 'servers' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Servidores
        </button>
      </div>
    </header>
  );
};
