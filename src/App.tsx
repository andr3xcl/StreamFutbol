import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PlayerView } from './components/PlayerView';
import { EventsList } from './components/EventsList';
import { ChannelsGrid } from './components/ChannelsGrid';
import { SportEvent, ActiveStream, PlayerMode, Theme } from './types';
import { Channel, CHANNELS } from './data/channels';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('streamtp_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTab] = useState<'events' | 'channels'>('events');
  const [playerMode, setPlayerMode] = useState<PlayerMode>('global2');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [activeStream, setActiveStream] = useState<ActiveStream>({
    streamKey: 'espn',
    title: 'ESPN 1',
    category: 'ESPN',
    quality: '720p',
  });

  useEffect(() => {
    try {
      localStorage.setItem('streamtp_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  // Fetch events from backend API
  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch(`/api/events?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  // Handle playing an event
  const handlePlayEvent = (event: SportEvent, mode?: PlayerMode) => {
    if (mode) {
      setPlayerMode(mode);
    }
    setActiveStream({
      streamKey: event.streamKey || 'espn',
      title: event.title,
      category: event.category,
      quality: event.quality || '720p',
      status: event.status,
      countryCode: event.clase,
    });
  };

  // Handle playing a channel from the 24/7 grid
  const handlePlayChannel = (channel: Channel, mode?: PlayerMode) => {
    if (mode) {
      setPlayerMode(mode);
    }
    setActiveStream({
      streamKey: channel.slug,
      title: channel.name,
      category: channel.category,
      quality: 'HD',
      countryCode: channel.countryCode,
    });
  };

  // Handle manual stream key change
  const handleStreamChange = (streamKey: string, customTitle?: string) => {
    const matchChannel = CHANNELS.find(
      (c) => c.slug.toLowerCase() === streamKey.toLowerCase()
    );

    setActiveStream({
      streamKey,
      title: customTitle || (matchChannel ? matchChannel.name : streamKey.toUpperCase()),
      category: matchChannel?.category || 'Directo',
      quality: 'HD',
    });
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerMode={playerMode}
        setPlayerMode={setPlayerMode}
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        eventsCount={events.length}
      />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 space-y-5">
        {/* Video Player */}
        <section aria-label="Reproductor">
          <PlayerView
            activeStream={activeStream}
            playerMode={playerMode}
            setPlayerMode={setPlayerMode}
            theme={theme}
            onStreamChange={handleStreamChange}
          />
        </section>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {activeTab === 'events' ? (
            <EventsList
              events={events}
              isLoading={isLoadingEvents}
              onRefresh={fetchEvents}
              playerMode={playerMode}
              theme={theme}
              onPlayEvent={handlePlayEvent}
              searchQuery={searchQuery}
            />
          ) : (
            <ChannelsGrid
              playerMode={playerMode}
              theme={theme}
              onPlayChannel={handlePlayChannel}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-4 px-4 sm:px-6 border-t text-xs select-none transition-colors ${
          isDark ? 'bg-black border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">STREAMTP</span>
            <span>&bull;</span>
            <span>Emisión Directa</span>
            <span>&bull;</span>
            <span className="font-mono">G1 / G2</span>
          </div>

          <div className="text-[11px] font-mono">
            {events.length} eventos sincronizados
          </div>
        </div>
      </footer>
    </div>
  );
}
