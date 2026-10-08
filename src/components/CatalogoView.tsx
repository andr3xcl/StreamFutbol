import React, { useState, useEffect } from 'react';
import { Layers, Play, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { CatalogoData, SearchResultItem, Theme } from '../types/anime';

interface CatalogoViewProps {
  theme: Theme;
  onPlayEpisode: (slug: string, number: number) => void;
  onSelectMedia: (slug: string) => void;
}

const CATEGORIES = [
  { label: 'Todas', value: '' },
  { label: 'TV Anime', value: 'tv-anime' },
  { label: 'Película', value: 'pelicula' },
  { label: 'OVA', value: 'ova' },
  { label: 'Especial', value: 'especial' },
  { label: 'ONA', value: 'ona' },
];

const POPULAR_GENRES = [
  { label: 'Todos', value: '' },
  { label: 'Acción', value: 'accion' },
  { label: 'Aventura', value: 'aventura' },
  { label: 'Isekai', value: 'isekai' },
  { label: 'Fantasía', value: 'fantasia' },
  { label: 'Comedia', value: 'comedia' },
  { label: 'Drama', value: 'drama' },
  { label: 'Romance', value: 'romance' },
  { label: 'Shounen', value: 'shounen' },
  { label: 'Ciencia Ficción', value: 'ciencia-ficcion' },
  { label: 'Sobrenatural', value: 'sobrenatural' },
];

export const CatalogoView: React.FC<CatalogoViewProps> = ({
  theme,
  onPlayEpisode,
  onSelectMedia,
}) => {
  const [catalogoData, setCatalogoData] = useState<CatalogoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const isDark = theme === 'dark';

  const fetchCatalogo = async (page = 1, category = selectedCategory, genre = selectedGenre, search = searchFilter) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      if (category) params.set('category', category);
      if (genre) params.set('genre', genre);
      if (search) params.set('search', search);

      const res = await fetch(`/api/anime/catalogo?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCatalogoData(json);
      }
    } catch (err) {
      console.error('Error fetching catalogo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogo(currentPage, selectedCategory, selectedGenre, searchFilter);
  }, [currentPage, selectedCategory, selectedGenre]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCatalogo(1, selectedCategory, selectedGenre, searchFilter);
  };

  const results = catalogoData?.results || [];
  const pagination = catalogoData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 20,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Top Header Card */}
      <div
        className={`p-4 sm:p-5 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded flex items-center justify-center font-bold text-xs border ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Catálogo Completo de Anime</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">
                ({pagination.totalRecords} series)
              </span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Explora el archivo completo con filtros por categoría y géneros.
            </p>
          </div>
        </div>

        {/* Catalog Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar en catálogo..."
            className={`w-full border rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                : 'bg-zinc-50 border-zinc-300 text-black placeholder-zinc-400'
            }`}
          />
        </form>
      </div>

      {/* Filter Section: Categories & Genres */}
      <div className="space-y-2.5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase mr-1 shrink-0">Categoría:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                selectedCategory === cat.value
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase mr-1 shrink-0">Género:</span>
          {POPULAR_GENRES.map((g) => (
            <button
              key={g.value}
              onClick={() => {
                setSelectedGenre(g.value);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-0.5 rounded text-xs font-medium whitespace-nowrap border transition-colors ${
                selectedGenre === g.value
                  ? isDark
                    ? 'bg-zinc-200 text-black border-zinc-200 font-bold'
                    : 'bg-zinc-800 text-white border-zinc-800 font-bold'
                  : isDark
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-black'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="py-24 text-center font-mono text-xs opacity-60">
          Cargando catálogo oficial de Littlegods Anime...
        </div>
      ) : results.length === 0 ? (
        <div
          className={`p-12 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-sm font-semibold">No se encontraron animes para los filtros seleccionados.</p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedGenre('');
              setSearchFilter('');
              setCurrentPage(1);
            }}
            className="mt-3 text-xs underline font-semibold"
          >
            Limpiar filtros
          </button>
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

                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] font-bold uppercase bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/10">
                      {anime.category?.name || 'Anime'}
                    </span>
                  </div>
                </div>

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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
            disabled={currentPage <= 1 || isLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-semibold disabled:opacity-30 transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-300 text-zinc-700 hover:text-black'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <span className="text-xs font-mono px-3 py-1 text-zinc-500">
            Página <strong className={isDark ? 'text-white' : 'text-black'}>{currentPage}</strong> de{' '}
            {pagination.totalPages}
          </span>

          <button
            onClick={() => {
              if (currentPage < pagination.totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
            disabled={currentPage >= pagination.totalPages || isLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-semibold disabled:opacity-30 transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-300 text-zinc-700 hover:text-black'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
