import React, { useState } from 'react';
import {
  Maximize2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { ActiveStream, PlayerMode, Theme } from '../types';

interface PlayerViewProps {
  activeStream: ActiveStream;
  playerMode: PlayerMode;
  setPlayerMode: (mode: PlayerMode) => void;
  theme: Theme;
  onStreamChange: (streamKey: string, title?: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  activeStream,
  playerMode,
  setPlayerMode,
  theme,
  onStreamChange,
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomBar, setShowCustomBar] = useState(false);

  const isDark = theme === 'dark';

  const playerSrc = `/api/player?stream=${encodeURIComponent(
    activeStream.streamKey || 'espn'
  )}&type=${playerMode}&theme=${theme}&v=${reloadKey}`;

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleCopyLink = () => {
    const directUrl = `${window.location.origin}/api/player?stream=${encodeURIComponent(
      activeStream.streamKey
    )}&type=${playerMode}&theme=${theme}`;
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenStandalone = () => {
    const standaloneUrl = `/api/player?stream=${encodeURIComponent(
      activeStream.streamKey
    )}&type=${playerMode}&theme=${theme}`;
    window.open(standaloneUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const cleanKey = customInput
      .trim()
      .replace(/https?:\/\/streamtp-golden1\.click\/(global[12]\.php\?stream=)?/, '')
      .replace(/^stream=/, '');
    onStreamChange(cleanKey, cleanKey.toUpperCase());
    setCustomInput('');
    setShowCustomBar(false);
  };

  return (
    <div
      className={`mx-auto transition-all ${
        isTheater ? 'max-w-[100vw] px-0' : 'max-w-7xl px-4 sm:px-6'
      }`}
    >
      <div
        className={`rounded-lg overflow-hidden border ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Title Bar */}
        <div
          className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-bold text-sm tracking-tight truncate">
              {activeStream.title}
            </span>

            {activeStream.category && (
              <span
                className={`hidden sm:inline px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
                }`}
              >
                {activeStream.category}
              </span>
            )}

            <span
              className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
              }`}
            >
              {activeStream.streamKey}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setPlayerMode(playerMode === 'global1' ? 'global2' : 'global1')}
              className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Cambiar modo de reproducción"
            >
              Modo: {playerMode === 'global2' ? 'Auto (G2)' : 'Manual (G1)'}
            </button>

            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Recargar señal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowCustomBar(!showCustomBar)}
              className={`px-2 py-1 rounded border text-xs font-medium transition-colors ${
                showCustomBar
                  ? isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-200 border-zinc-300 text-black'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Cargar stream directo"
            >
              Canal
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`hidden md:flex p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title={isTheater ? 'Vista normal' : 'Teatro'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenStandalone}
              className={`p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Abrir en ventana"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyLink}
              className={`p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Copiar enlace directo"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Custom Slug Input */}
        {showCustomBar && (
          <form
            onSubmit={handleCustomSubmit}
            className={`px-4 py-2 border-b flex flex-wrap items-center gap-2 text-xs ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <span className="font-semibold">Stream key:</span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="espn, winplus, dsports, tycsports..."
              className={`flex-1 min-w-[200px] border rounded px-2.5 py-1 text-xs focus:outline-none ${
                isDark
                  ? 'bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700'
                  : 'bg-white border-zinc-300 text-black placeholder-zinc-400 focus:border-zinc-500'
              }`}
            />
            <button
              type="submit"
              className={`font-semibold px-3 py-1 rounded border text-xs transition-colors ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
                  : 'bg-black hover:bg-zinc-800 text-white border-black'
              }`}
            >
              Cargar
            </button>
            <div className="flex items-center gap-1 font-mono text-[11px] opacity-70">
              {['espn', 'winplus', 'dsports', 'premiere1'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onStreamChange(k, k.toUpperCase())}
                  className="px-1.5 py-0.5 rounded border border-inherit hover:opacity-100"
                >
                  {k}
                </button>
              ))}
            </div>
          </form>
        )}

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            key={`${activeStream.streamKey}-${playerMode}-${theme}-${reloadKey}`}
            src={playerSrc}
            title={activeStream.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
