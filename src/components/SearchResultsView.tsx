import React from 'react';
import { Play, Film, ChevronRight, X } from 'lucide-react';
import { SearchResultItem, Theme } from '../types/anime';

interface SearchResultsViewProps {
  query: string;
  results: SearchResultItem[];
  isLoading: boolean;
  theme: Theme;
  onPlayEpisode: (slug: string, number: number) => void;
  onSelectMedia: (slug: string) => void;
  onClearSearch: () => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  results,
  isLoading,
  theme,
  onPlayEpisode,
  onSelectMedia,
  onClearSearch,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
      {/* Search Header */}
      <div className="flex items-center justify-between border-b pb-3 border-inherit">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight">
            Resultados de búsqueda: <span className="font-mono text-zinc-400">"{query}"</span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono">({results.length})</span>
        </div>

        <button
          onClick={onClearSearch}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-mono text-xs opacity-60">
          Buscando animes en Littlegods Anime...
        </div>
      ) : results.length === 0 ? (
        <div
          className={`p-12 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-sm font-semibold">No se encontraron animes para "{query}".</p>
          <p className="text-xs mt-1 opacity-70">
            Intenta con otro título en japonés, inglés o español, o busca por palabras clave.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {results.map((anime) => (
            <div
              key={anime.id}
              onClick={() => onSelectMedia(anime.slug)}
              className={`rounded-lg border overflow-hidden flex flex-col justify-between cursor-pointer group transition-colors ${
                isDark
                  ? 'bg-black border-zinc-800 hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div>
                {/* Vertical Cover Image (Carátula) */}
                <div className="aspect-[3/4] relative bg-zinc-900 overflow-hidden">
                  {anime.coverUrl ? (
                    <img
                      src={anime.coverUrl}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Top Badge: Category */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white px-1.5 py-0.5 rounded backdrop-blur-xs border border-white/10">
                      {anime.category?.name || 'Anime'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-xs leading-snug line-clamp-2 group-hover:underline">
                    {anime.title}
                  </h3>

                  {anime.synopsis && (
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-normal">
                      {anime.synopsis}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                className={`p-2.5 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-zinc-800' : 'border-zinc-100'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayEpisode(anime.slug, 1);
                  }}
                  className={`w-full py-1 rounded font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Ver Ep. 1</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
