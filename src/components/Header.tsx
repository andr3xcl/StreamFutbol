import React from 'react';
import { Search, Sun, Moon, Film, Calendar, Layers } from 'lucide-react';
import { Theme } from '../types/anime';

interface HeaderProps {
  currentView: 'home' | 'player' | 'media' | 'search' | 'horario' | 'catalogo';
  setCurrentView: (view: 'home' | 'player' | 'media' | 'search' | 'horario' | 'catalogo') => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  activeAnimeTitle?: string;
  hasSelectedAnime: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  activeAnimeTitle,
  hasSelectedAnime,
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
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center font-black text-xs border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
              }`}
            >
              <Film className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight block leading-none">
                LITTLEGODS<span className="font-mono text-zinc-400"> ANIME</span>
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-1.5 rounded transition-colors ${
                currentView === 'home'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => setCurrentView('catalogo')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                currentView === 'catalogo'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 opacity-60" />
              <span>Catálogo</span>
            </button>

            <button
              onClick={() => setCurrentView('horario')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                currentView === 'horario'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              <span>Horario</span>
            </button>

            {/* Anime-specific tabs (only when an anime has been selected) */}
            {hasSelectedAnime && (
              <>
                <button
                  onClick={() => setCurrentView('media')}
                  className={`px-3 py-1.5 rounded max-w-[170px] truncate transition-colors border-l border-zinc-800 pl-3 ml-1 ${
                    currentView === 'media'
                      ? isDark
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-100 text-black'
                      : isDark
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                  title={activeAnimeTitle}
                >
                  <span className="truncate">
                    {activeAnimeTitle || 'Detalles'}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentView('player')}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    currentView === 'player'
                      ? isDark
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-100 text-black'
                      : isDark
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  Reproductor
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Tools: Search & Theme */}
        <div className="flex items-center gap-3">
          <form onSubmit={onSearchSubmit} className="relative w-40 sm:w-56">
            <Search
              className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar anime..."
              className={`w-full rounded border pl-8 pr-2.5 py-1 text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400'
              }`}
            />
          </form>

          {/* Theme Toggle: White / Dark */}
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
          onClick={() => setCurrentView('home')}
          className={`px-2 py-1 rounded ${currentView === 'home' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Inicio
        </button>
        <button
          onClick={() => setCurrentView('catalogo')}
          className={`px-2 py-1 rounded ${currentView === 'catalogo' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setCurrentView('horario')}
          className={`px-2 py-1 rounded ${currentView === 'horario' ? 'font-bold underline' : 'opacity-60'}`}
        >
          Horario
        </button>
        {hasSelectedAnime && (
          <button
            onClick={() => setCurrentView('media')}
            className={`px-2 py-1 rounded ${currentView === 'media' || currentView === 'player' ? 'font-bold underline' : 'opacity-60'}`}
          >
            Anime
          </button>
        )}
      </div>
    </header>
  );
};
