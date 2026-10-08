import React from 'react';
import { Play, Star, Film, ChevronRight, ArrowLeft } from 'lucide-react';
import { AnimeMediaDetail, Theme } from '../types/anime';

interface MediaViewProps {
  media: AnimeMediaDetail | null;
  isLoading: boolean;
  theme: Theme;
  onPlayEpisode: (number: number) => void;
  onSelectMediaSlug: (slug: string) => void;
  onGoHome: () => void;
}

export const MediaView: React.FC<MediaViewProps> = ({
  media,
  isLoading,
  theme,
  onPlayEpisode,
  onGoHome,
}) => {
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="font-mono text-xs opacity-60">Cargando información del anime...</div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div
          className={`p-10 rounded-lg border max-w-lg mx-auto space-y-4 ${
            isDark ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
          }`}
        >
          <Film className="w-10 h-10 mx-auto opacity-40" />
          <h2 className="text-base font-bold">No has seleccionado ningún anime todavía</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Haz clic en cualquier anime o episodio desde el inicio, o búscalo por su nombre para ver su ficha técnica, sinopsis y lista de capítulos.
          </p>
          <button
            onClick={onGoHome}
            className={`px-4 py-2 rounded font-semibold text-xs transition-colors ${
              isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            Explorar Anime en Inicio
          </button>
        </div>
      </div>
    );
  }

  const episodes = media.episodes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Return button */}
      <div>
        <button
          onClick={onGoHome}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
      </div>

      {/* Anime Overview Header Card with Official Cover */}
      <div
        className={`p-5 sm:p-7 rounded-lg border transition-colors ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Vertical Anime Cover (Carátula) */}
          <div className="w-36 sm:w-48 aspect-[3/4] rounded-lg bg-zinc-900 border border-inherit overflow-hidden shrink-0 shadow-sm">
            {media.coverUrl ? (
              <img
                src={media.coverUrl}
                alt={media.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
          </div>

          {/* Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>{media.category?.name || 'TV Anime'}</span>
                  <span>&bull;</span>
                  <span>
                    {media.episodesCount ? `${media.episodesCount} Episodios` : `${episodes.length} Episodios`}
                  </span>
                  {media.startDate && (
                    <>
                      <span>&bull;</span>
                      <span>{media.startDate}</span>
                    </>
                  )}
                </div>

                <h1 className="text-xl sm:text-3xl font-black tracking-tight">{media.title}</h1>

                {media.aka && (
                  <div className="text-xs text-zinc-500 font-mono space-y-0.5">
                    {media.aka['ja-jp'] && <div>{media.aka['ja-jp']}</div>}
                    {media.aka['en-us'] && <div>{media.aka['en-us']}</div>}
                  </div>
                )}
              </div>

              {/* Score & Play Ep 1 */}
              <div className="flex items-center gap-3">
                {media.score && (
                  <div
                    className={`px-3 py-1.5 rounded border text-right font-mono ${
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="text-sm font-black flex items-center justify-end gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{media.score}</span>
                    </div>
                    {media.votes && (
                      <div className="text-[10px] text-zinc-500">{media.votes.toLocaleString()} votos</div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => onPlayEpisode(1)}
                  className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-colors ${
                    isDark
                      ? 'bg-white hover:bg-zinc-200 text-black'
                      : 'bg-black hover:bg-zinc-800 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ver Ep. 1</span>
                </button>
              </div>
            </div>

            {/* Synopsis */}
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {media.synopsis}
            </p>

            {/* Genres */}
            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {media.genres.map((g) => (
                  <span
                    key={g.id}
                    className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                    }`}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div
        className={`p-5 sm:p-6 rounded-lg border space-y-4 ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-inherit">
          <h2 className="text-sm font-bold tracking-tight">Lista de Episodios ({episodes.length})</h2>
          <span className="text-xs text-zinc-500 font-mono">Selecciona para reproducir</span>
        </div>

        {episodes.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No hay episodios listados para este anime.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => onPlayEpisode(ep.number)}
                className={`p-3 rounded border text-left flex items-center justify-between group transition-colors ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100'
                }`}
              >
                <div>
                  <span className="font-mono text-xs font-bold block">Episodio {ep.number}</span>
                  <span className="text-[10px] text-zinc-500 block">SUB / DUB</span>
                </div>
                <Play className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
