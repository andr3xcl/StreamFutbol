import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { PlayerView } from './components/PlayerView';
import { MediaView } from './components/MediaView';
import { SearchResultsView } from './components/SearchResultsView';
import { HorarioView } from './components/HorarioView';
import { CatalogoView } from './components/CatalogoView';
import {
  HomeData,
  AnimeMediaDetail,
  EpisodeDetail,
  SearchResultItem,
  Theme,
} from './types/anime';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('littlegods_theme') || localStorage.getItem('animeav1_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [currentView, setCurrentView] = useState<
    'home' | 'player' | 'media' | 'search' | 'horario' | 'catalogo'
  >('home');
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoadingHome, setIsLoadingHome] = useState(false);

  const [currentMedia, setCurrentMedia] = useState<AnimeMediaDetail | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const [currentEpisode, setCurrentEpisode] = useState<EpisodeDetail | null>(
    null
  );
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false);

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // No anime selected by default - only set when the user selects/clicks one
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeEpNum, setActiveEpNum] = useState<number>(1);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  // Sync theme with document element
  useEffect(() => {
    try {
      localStorage.setItem('littlegods_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  // Fetch Home Data
  const fetchHomeData = useCallback(async (force = false) => {
    setIsLoadingHome(true);
    try {
      const url = force
        ? `/api/anime/home?refresh=1&t=${Date.now()}`
        : '/api/anime/home';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setHomeData(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setIsLoadingHome(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData(false);
    const interval = setInterval(() => {
      fetchHomeData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchHomeData]);

  // Load Media Details for a specific anime
  const loadMedia = useCallback(async (slug: string) => {
    if (!slug) return;
    setIsLoadingMedia(true);
    setActiveSlug(slug);
    try {
      const res = await fetch(`/api/anime/media/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setCurrentMedia(json.data);
        }
      }
    } catch (err) {
      console.error(`Error loading media ${slug}:`, err);
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  // Load Episode & Servers for a specific anime
  const loadEpisode = useCallback(
    async (slug: string, number: number) => {
      if (!slug) return;
      setIsLoadingEpisode(true);
      setActiveSlug(slug);
      setActiveEpNum(number);
      try {
        const res = await fetch(
          `/api/anime/episode/${encodeURIComponent(slug)}/${encodeURIComponent(
            number
          )}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setCurrentEpisode(json.data);
            if (json.data.media) {
              setCurrentMedia(json.data.media);
            }
          }
        }
      } catch (err) {
        console.error(`Error loading episode ${slug}/${number}:`, err);
      } finally {
        setIsLoadingEpisode(false);
      }
    },
    []
  );

  // Search anime on AnimeAV1
  const handlePerformSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setActiveSearchQuery(query.trim());
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'instant' });

    try {
      const res = await fetch(
        `/api/anime/search?q=${encodeURIComponent(query.trim())}`
      );
      if (res.ok) {
        const json = await res.json();
        setSearchResults(json.results || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Play an episode directly (triggered by clicking an episode)
  const handlePlayEpisode = (slug: string, number: number) => {
    loadEpisode(slug, number);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // View an anime media overview (triggered by clicking an anime card)
  const handleSelectMedia = (slug: string) => {
    loadMedia(slug);
    setCurrentView('media');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Select episode in player
  const handleSelectEpisodeInPlayer = (number: number) => {
    if (activeSlug) {
      loadEpisode(activeSlug, number);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Handle direct URL / slug submission
  const handleDirectSlugSubmit = (input: string) => {
    if (!input) return;
    let clean = input
      .trim()
      .replace(/^https?:\/\/animeav1\.com\//, '')
      .replace(/^media\//, '')
      .replace(/\/$/, '');

    const parts = clean.split('/');
    if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
      const slug = parts[0];
      const epNum = Number(parts[1]);
      handlePlayEpisode(slug, epNum);
    } else {
      if (clean.includes(' ') || !clean.includes('-')) {
        handlePerformSearch(clean);
      } else {
        handleSelectMedia(clean);
      }
    }
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;
    const query = headerSearchQuery.trim();
    setHeaderSearchQuery('');
    if (query.includes('/') || query.startsWith('http')) {
      handleDirectSlugSubmit(query);
    } else {
      handlePerformSearch(query);
    }
  };

  const isDark = theme === 'dark';
  const hasSelectedAnime = Boolean(currentMedia || currentEpisode || activeSlug);
  const activeAnimeTitle = currentEpisode?.media?.title || currentMedia?.title;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Header */}
      <Header
        currentView={currentView === 'search' ? 'home' : currentView}
        setCurrentView={(v) => {
          setCurrentView(v);
        }}
        theme={theme}
        setTheme={setTheme}
        searchQuery={headerSearchQuery}
        setSearchQuery={setHeaderSearchQuery}
        onSearchSubmit={handleHeaderSearchSubmit}
        activeAnimeTitle={activeAnimeTitle}
        hasSelectedAnime={hasSelectedAnime}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-5 sm:py-6">
        {currentView === 'home' && (
          <HomeView
            homeData={homeData}
            isLoading={isLoadingHome}
            theme={theme}
            onPlayEpisode={handlePlayEpisode}
            onSelectMedia={handleSelectMedia}
            onDirectSlugSubmit={handleDirectSlugSubmit}
            onSearch={handlePerformSearch}
            onRefreshHome={() => fetchHomeData(true)}
          />
        )}

        {currentView === 'catalogo' && (
          <CatalogoView
            theme={theme}
            onPlayEpisode={handlePlayEpisode}
            onSelectMedia={handleSelectMedia}
          />
        )}

        {currentView === 'horario' && (
          <HorarioView
            theme={theme}
            onPlayEpisode={handlePlayEpisode}
            onSelectMedia={handleSelectMedia}
          />
        )}

        {currentView === 'search' && (
          <SearchResultsView
            query={activeSearchQuery}
            results={searchResults}
            isLoading={isSearching}
            theme={theme}
            onPlayEpisode={handlePlayEpisode}
            onSelectMedia={handleSelectMedia}
            onClearSearch={() => setCurrentView('home')}
          />
        )}

        {currentView === 'player' && (
          <PlayerView
            episodeData={currentEpisode}
            isLoading={isLoadingEpisode}
            theme={theme}
            onSelectEpisode={handleSelectEpisodeInPlayer}
            onGoToMedia={() => {
              if (activeSlug && !currentMedia) {
                loadMedia(activeSlug);
              }
              setCurrentView('media');
            }}
          />
        )}

        {currentView === 'media' && (
          <MediaView
            media={currentMedia}
            isLoading={isLoadingMedia}
            theme={theme}
            onPlayEpisode={(num) => {
              if (activeSlug) handlePlayEpisode(activeSlug, num);
            }}
            onSelectMediaSlug={handleSelectMedia}
            onGoHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-4 px-4 sm:px-6 border-t text-xs select-none transition-colors ${
          isDark
            ? 'bg-black border-zinc-800 text-zinc-500'
            : 'bg-white border-zinc-200 text-zinc-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">LITTLEGODS ANIME</span>
            <span>&bull;</span>
            <span
              onClick={() => setCurrentView('catalogo')}
              className="cursor-pointer hover:underline"
            >
              Catálogo
            </span>
            <span>&bull;</span>
            <span
              onClick={() => setCurrentView('horario')}
              className="cursor-pointer hover:underline"
            >
              Horario Semanal
            </span>
          </div>

          <div className="text-[11px] font-mono">
            Carátulas Oficiales &bull; HLS &bull; UPNShare &bull; Voe &bull; Byse &bull; MP4Upload
          </div>
        </div>
      </footer>
    </div>
  );
}
