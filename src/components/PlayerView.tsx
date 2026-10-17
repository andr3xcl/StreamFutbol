import React, { useState } from 'react';
import {
  Maximize2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Tv,
} from 'lucide-react';
import { ActiveStream, PlaybackMode, ServerOption, Theme } from '../types';

interface PlayerViewProps {
  activeStream: ActiveStream;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
  theme: Theme;
  onStreamChange: (streamKey: string, title?: string) => void;
  availableServers?: ServerOption[];
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  activeStream,
  playbackMode,
  setPlaybackMode,
  theme,
  onStreamChange,
  availableServers = [],
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomBar, setShowCustomBar] = useState(false);

  const isDark = theme === 'dark';

  const playerSrc = `/api/sports/player?stream=${encodeURIComponent(
    activeStream.streamKey || 'espn'
  )}&mode=${playbackMode}&theme=${theme}&v=${reloadKey}`;

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleCopyLink = () => {
    const directUrl = `${window.location.origin}/api/sports/player?stream=${encodeURIComponent(
      activeStream.streamKey
    )}&mode=${playbackMode}&theme=${theme}`;
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenStandalone = () => {
    const standaloneUrl = `/api/sports/player?stream=${encodeURIComponent(
      activeStream.streamKey
    )}&mode=${playbackMode}&theme=${theme}`;
    window.open(standaloneUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const cleanKey = customInput
      .trim()
      .replace(/https?:\/\/[^\/]+\/(live[12]\.php\?stream=)?/, '')
      .replace(/^stream=/, '');
    onStreamChange(cleanKey, cleanKey.toUpperCase());
    setCustomInput('');
    setShowCustomBar(false);
  };

  return (
    <div
      className={`mx-auto transition-all space-y-2 ${
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

            {activeStream.leagueName && (
              <span
                className={`hidden sm:inline px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
                }`}
              >
                {activeStream.leagueName}
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
            {/* Mode Switcher */}
            <button
              onClick={() => setPlaybackMode(playbackMode === 'live1' ? 'live2' : 'live1')}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Alternar entre modo manual y automático"
            >
              Modo: {playbackMode === 'live2' ? 'Auto (Live2)' : 'Manual (Live1)'}
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
              className={`px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
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
              title={isTheater ? 'Vista normal' : 'Modo Teatro'}
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
              title="Abrir en ventana independiente"
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

        {/* Server Switcher Bar if event has multiple servers */}
        {availableServers.length > 1 && (
          <div
            className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs scrollbar-none ${
              isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <span className="text-[11px] font-semibold text-zinc-500 uppercase mr-1 shrink-0">
              Opciones de Transmisión:
            </span>
            {availableServers.map((srv, idx) => {
              const isCurrent = srv.streamKey === activeStream.streamKey;

              return (
                <button
                  key={`${srv.name}-${idx}`}
                  onClick={() => onStreamChange(srv.streamKey || 'espn', srv.name)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                    isCurrent
                      ? isDark
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : isDark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
                  }`}
                >
                  {srv.name}
                </button>
              );
            })}
          </div>
        )}

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
              placeholder="f1, f1tv, daznf1, espn, winplus, dsports, foxone..."
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
              {['f1', 'f1tv', 'espn', 'winplus', 'dsports', 'fox1ar'].map((k) => (
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
            key={`${activeStream.streamKey}-${playbackMode}-${theme}-${reloadKey}`}
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
