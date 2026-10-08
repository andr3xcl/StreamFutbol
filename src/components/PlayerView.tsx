import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
  X,
} from 'lucide-react';
import { EpisodeDetail, Theme, ServerEmbed } from '../types/anime';

interface PlayerViewProps {
  episodeData: EpisodeDetail | null;
  isLoading: boolean;
  theme: Theme;
  onSelectEpisode: (number: number) => void;
  onGoToMedia: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  episodeData,
  isLoading,
  theme,
  onSelectEpisode,
  onGoToMedia,
}) => {
  const [selectedLang, setSelectedLang] = useState<'SUB' | 'DUB'>('SUB');
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const isDark = theme === 'dark';

  // Available servers for current selected language
  const availableServers: ServerEmbed[] =
    episodeData?.embeds?.[selectedLang] ||
    episodeData?.embeds?.SUB ||
    episodeData?.embeds?.DUB ||
    [];

  // Fallback to SUB if DUB not available or vice-versa
  useEffect(() => {
    if (episodeData?.embeds) {
      if (selectedLang === 'DUB' && (!episodeData.embeds.DUB || episodeData.embeds.DUB.length === 0)) {
        setSelectedLang('SUB');
      }
      setSelectedServerIndex(0);
    }
  }, [episodeData, selectedLang]);

  const currentServer = availableServers[selectedServerIndex] || availableServers[0];

  const handleCopyLink = () => {
    if (currentServer?.url) {
      navigator.clipboard.writeText(currentServer.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenOriginal = () => {
    if (currentServer?.url) {
      window.open(currentServer.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="font-mono text-xs opacity-60">Cargando reproductor y servidores...</div>
      </div>
    );
  }

  if (!episodeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-3">
        <p className="text-sm font-semibold">No hay episodio seleccionado.</p>
        <p className="text-xs text-zinc-500">
          Elige un anime o episodio desde el inicio o el buscador para iniciar la reproducción.
        </p>
      </div>
    );
  }

  const { media, episode } = episodeData;
  const currentEpNum = episode.number;
  const allEpisodes = media.episodes || [];
  const hasPrev = currentEpNum > 1;
  const hasNext = allEpisodes.some((e) => e.number === currentEpNum + 1);

  const playerSrc = currentServer?.url
    ? `/api/anime/player?url=${encodeURIComponent(currentServer.url)}&theme=${theme}&v=${reloadKey}`
    : '';

  const downloadLinks =
    episodeData.downloads?.[selectedLang] ||
    episodeData.downloads?.SUB ||
    episodeData.downloads?.DUB ||
    [];

  return (
    <div
      className={`mx-auto transition-all space-y-4 ${
        isTheater ? 'max-w-[100vw] px-0' : 'max-w-7xl px-4 sm:px-6'
      }`}
    >
      <div
        className={`rounded-lg overflow-hidden border ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Top Control Bar: Title & Next/Prev */}
        <div
          className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onGoToMedia}
              className="font-bold text-sm tracking-tight truncate hover:underline text-left"
              title="Ver página del anime"
            >
              {media.title}
            </button>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
              }`}
            >
              Episodio {currentEpNum}
            </span>
          </div>

          {/* Quick Actions & Prev/Next */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => hasPrev && onSelectEpisode(currentEpNum - 1)}
              disabled={!hasPrev}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold transition-colors disabled:opacity-30 ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Episodio anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              onClick={() => hasNext && onSelectEpisode(currentEpNum + 1)}
              disabled={!hasNext}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold transition-colors disabled:opacity-30 ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Episodio siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className={`p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Recargar reproductor"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold transition-colors ${
                showDownloads
                  ? isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-200 border-zinc-300 text-black'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Descargar episodio"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargas</span>
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
              onClick={handleOpenOriginal}
              className={`p-1.5 rounded border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
              }`}
              title="Abrir servidor en pestaña"
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
              title="Copiar enlace del servidor"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Server & Language Switcher Bar */}
        <div
          className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          {/* Language selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Audio:</span>
            <div
              className={`flex items-center p-0.5 rounded border font-mono text-xs ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}
            >
              <button
                onClick={() => setSelectedLang('SUB')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedLang === 'SUB'
                    ? isDark
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'bg-white text-black font-bold shadow-xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                SUB (Subtitulado)
              </button>
              {episodeData.embeds?.DUB && episodeData.embeds.DUB.length > 0 && (
                <button
                  onClick={() => setSelectedLang('DUB')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedLang === 'DUB'
                      ? isDark
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'bg-white text-black font-bold shadow-xs'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  DUB (Español)
                </button>
              )}
            </div>
          </div>

          {/* Servers list */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-1">Servidor:</span>
            {availableServers.map((server, idx) => (
              <button
                key={`${server.server}-${idx}`}
                onClick={() => setSelectedServerIndex(idx)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                  selectedServerIndex === idx
                    ? isDark
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
                }`}
              >
                {server.server}
              </button>
            ))}
          </div>
        </div>

        {/* Downloads Modal/Drawer */}
        {showDownloads && (
          <div
            className={`p-4 border-b text-xs ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">Servidores de Descarga Directa ({selectedLang}):</span>
              <button
                onClick={() => setShowDownloads(false)}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {downloadLinks.length === 0 ? (
              <p className="text-zinc-500">No hay enlaces de descarga disponibles para esta opción.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {downloadLinks.map((dl, idx) => (
                  <a
                    key={`${dl.server}-${idx}`}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-semibold transition-colors ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                        : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-black'
                    }`}
                  >
                    <Download className="w-3 h-3" />
                    <span>{dl.server}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Player Frame Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {playerSrc ? (
            <iframe
              key={`${currentServer?.url}-${selectedLang}-${reloadKey}`}
              src={playerSrc}
              title={`Reproductor ${media.title} Episodio ${currentEpNum}`}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="font-mono text-xs text-zinc-500">No se pudo cargar el servidor seleccionado.</div>
          )}
        </div>
      </div>

      {/* Episode Selector Grid */}
      <div
        className={`p-4 rounded-lg border ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold">Todos los Episodios ({allEpisodes.length}):</span>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showInfo ? 'Ocultar sinopsis' : 'Ver sinopsis'}</span>
          </button>
        </div>

        {/* Episodes Buttons Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-14 gap-1.5">
          {allEpisodes.map((ep) => {
            const isCurrent = ep.number === currentEpNum;
            return (
              <button
                key={ep.id}
                onClick={() => onSelectEpisode(ep.number)}
                className={`py-2 px-1 text-xs font-mono font-bold rounded border transition-colors ${
                  isCurrent
                    ? isDark
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white border-black'
                    : isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                {ep.number}
              </button>
            );
          })}
        </div>

        {/* Collapsible Info Section */}
        {showInfo && (
          <div
            className={`mt-4 pt-3 border-t text-xs space-y-2 ${
              isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-600'
            }`}
          >
            {media.aka && (
              <div className="space-y-0.5">
                {media.aka['ja-jp'] && <div>Japonés: {media.aka['ja-jp']}</div>}
                {media.aka['en-us'] && <div>Inglés: {media.aka['en-us']}</div>}
              </div>
            )}
            <p className="leading-relaxed">{media.synopsis}</p>
            {media.genres && (
              <div className="flex flex-wrap gap-1 pt-1">
                {media.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2 py-0.5 rounded text-[11px] font-medium border border-inherit"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
