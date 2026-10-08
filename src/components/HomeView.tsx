import React, { useState } from 'react';
import { Play, Film, Clock, ChevronRight, Search, Star, RefreshCw } from 'lucide-react';
import { HomeData, Theme } from '../types/anime';

interface HomeViewProps {
  homeData: HomeData | null;
  isLoading: boolean;
  theme: Theme;
  onPlayEpisode: (slug: string, number: number) => void;
  onSelectMedia: (slug: string) => void;
  onDirectSlugSubmit: (slugInput: string) => void;
  onSearch: (q: string) => void;
  onRefreshHome?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  homeData,
  isLoading,
  theme,
  onPlayEpisode,
  onSelectMedia,
  onDirectSlugSubmit,
  onSearch,
  onRefreshHome,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const isDark = theme === 'dark';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput.trim());
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="font-mono text-xs opacity-60">Cargando catálogo oficial de Littlegods Anime...</div>
      </div>
    );
  }

  const featured = homeData?.featured || [];
  const heroAnime = featured[0];
  const latestEpisodes = homeData?.latestEpisodes || [];
  const latestMedia = homeData?.latestMedia || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-7">
      {/* Featured Anime Hero Spotlight with Cover */}
      {heroAnime && (
        <div
          className={`rounded-lg border overflow-hidden transition-colors ${
            isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Poster Cover (Carátula) */}
            <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
              <div
                onClick={() => onSelectMedia(heroAnime.slug)}
                className="w-28 sm:w-36 aspect-[3/4] bg-zinc-900 rounded overflow-hidden shrink-0 border border-inherit cursor-pointer group shadow-sm"
              >
                {heroAnime.coverUrl ? (
                  <img
                    src={heroAnime.coverUrl}
                    alt={heroAnime.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-102"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
              </div>

              {/* Title & Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="font-bold text-white uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                    DESTACADO
                  </span>
                  <span>&bull;</span>
                  <span>{heroAnime.category?.name || 'TV Anime'}</span>
                  {heroAnime.startDate && (
                    <>
                      <span>&bull;</span>
                      <span>{heroAnime.startDate}</span>
                    </>
                  )}
                </div>

                <h2
                  onClick={() => onSelectMedia(heroAnime.slug)}
                  className="text-lg sm:text-2xl font-black tracking-tight cursor-pointer hover:underline"
                >
                  {heroAnime.title}
                </h2>

                <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {heroAnime.synopsis}
                </p>

                {heroAnime.genres && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {heroAnime.genres.map((g) => (
                      <span
                        key={g.id}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onPlayEpisode(heroAnime.slug, 1)}
                className={`px-5 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                  isDark ? 'bg-white hover:bg-zinc-200 text-black' : 'bg-black hover:bg-zinc-800 text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ver Episodio 1</span>
              </button>
              <button
                onClick={() => onSelectMedia(heroAnime.slug)}
                className={`px-4 py-2 rounded font-semibold text-xs border text-center transition-colors ${
                  isDark ? 'border-zinc-800 text-zinc-300 hover:text-white' : 'border-zinc-300 text-zinc-700 hover:text-black'
                }`}
              >
                Ver Episodios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Search Bar with Covers focus */}
      <form
        onSubmit={handleSearchSubmit}
        className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
        }`}
      >
        <div className="w-full sm:w-auto">
          <span className="font-bold block">Buscar en el catálogo de Littlegods Anime:</span>
          <span className="text-[11px] text-zinc-500">Busca por nombre (ej: Mushoku, One Piece, Frieren, Black Clover) o pega un slug</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 sm:max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Escribe el nombre del anime..."
              className={`w-full border rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none ${
                isDark
                  ? 'bg-black border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-600'
                  : 'bg-white border-zinc-300 text-black placeholder-zinc-400 focus:border-zinc-500'
              }`}
            />
          </div>
          <button
            type="submit"
            className={`font-semibold px-4 py-1.5 rounded border text-xs shrink-0 transition-colors ${
              isDark
                ? 'bg-white hover:bg-zinc-200 text-black border-white'
                : 'bg-black hover:bg-zinc-800 text-white border-black'
            }`}
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Latest Released Episodes Feed with Thumbnails/Covers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-inherit">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <span>Últimos Episodios Emitidos</span>
              <span className="text-xs text-zinc-500 font-mono font-normal">({latestEpisodes.length})</span>
            </h3>
            {onRefreshHome && (
              <button
                type="button"
                onClick={onRefreshHome}
                className={`p-1 rounded border text-xs transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
                }`}
                title="Actualizar estrenos en vivo"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-xs text-zinc-500 font-mono">Actualizado en vivo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {latestEpisodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => onPlayEpisode(ep.media.slug, ep.number)}
              className={`rounded-lg border overflow-hidden flex flex-col justify-between cursor-pointer group transition-colors ${
                isDark
                  ? 'bg-black border-zinc-800 hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div>
                {/* Thumbnail / Cover Image Container */}
                <div className="aspect-[3/4] relative bg-zinc-900 overflow-hidden">
                  {ep.coverUrl || ep.thumbnailUrl ? (
                    <img
                      src={ep.coverUrl || ep.thumbnailUrl}
                      alt={ep.media.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Top Badge: Episode Number */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/85 text-white px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                      EPISODIO {ep.number}
                    </span>
                  </div>

                  {/* Play Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3">
                  <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">
                    {ep.publishedAt ? ep.publishedAt.slice(0, 10) : ''}
                  </span>
                  <h4 className="font-bold text-xs leading-snug line-clamp-2 group-hover:underline">
                    {ep.media.title}
                  </h4>
                </div>
              </div>

              {/* Bottom Bar */}
              <div
                className={`p-2.5 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-600'
                }`}
              >
                <span className="font-mono text-[10px]">SUB / DUB</span>
                <span className="font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Ver
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added Media with Vertical Covers (Carátulas) */}
      {latestMedia.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b pb-2 border-inherit">
            <h3 className="font-bold text-sm tracking-tight">Catálogo de Anime</h3>
            <span className="text-xs text-zinc-500 font-mono">Con carátulas oficiales</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {latestMedia.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMedia(m.slug)}
                className={`rounded-lg border overflow-hidden flex flex-col justify-between cursor-pointer group transition-colors ${
                  isDark
                    ? 'bg-black border-zinc-800 hover:border-zinc-600'
                    : 'bg-white border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="aspect-[3/4] relative bg-zinc-900 overflow-hidden">
                    {m.coverUrl ? (
                      <img
                        src={m.coverUrl}
                        alt={m.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform group-hover:scale-102"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}

                    <div className="absolute top-2 left-2 z-10">
                      <span className="text-[10px] font-bold uppercase bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/10">
                        {m.category?.name || 'Anime'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs leading-snug line-clamp-2 group-hover:underline">
                      {m.title}
                    </h4>
                  </div>
                </div>

                <div
                  className={`p-2 border-t text-[11px] font-semibold text-center ${
                    isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-600'
                  }`}
                >
                  Ver detalles
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
