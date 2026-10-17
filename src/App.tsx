import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PlayerView } from './components/PlayerView';
import { EventsList } from './components/EventsList';
import { ChannelsGrid } from './components/ChannelsGrid';
import { ServerFeedbackView } from './components/ServerFeedbackView';
import { SportEvent, ActiveStream, PlaybackMode, Theme, ServerOption } from './types';
import { Channel, CHANNELS } from './data/channels';

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('streamxhd_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTab] = useState<'all' | 'futbol' | 'f1' | 'channels' | 'servers'>('all');
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(() => {
    try {
      const saved = localStorage.getItem('streamxhd_playback_mode');
      return saved === 'live2' ? 'live2' : 'live1';
    } catch {
      return 'live2'; // Default automatic with sound button
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [availableServers, setAvailableServers] = useState<ServerOption[]>([]);

  const [activeStream, setActiveStream] = useState<ActiveStream>({
    streamKey: 'espn',
    title: 'ESPN 1 - Señal en Vivo',
    sportName: 'Fútbol & Deportes',
    leagueName: 'En Directo',
  });

  useEffect(() => {
    try {
      localStorage.setItem('streamxhd_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('streamxhd_playback_mode', playbackMode);
    } catch {}
  }, [playbackMode]);

  // Fetch events from backend API (with failover across official mirrors)
  const fetchEvents = useCallback(async (force = false) => {
    setIsLoadingEvents(true);
    try {
      const url = force ? `/api/sports/events?refresh=1&t=${Date.now()}` : '/api/sports/events';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      }
    } catch (err) {
      console.error('Error fetching sports events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    // Poll every 60 seconds for live score and stream updates
    const interval = setInterval(() => fetchEvents(false), 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  // Handle playing an event
  const handlePlayEvent = (event: SportEvent, streamKey?: string, mode?: PlaybackMode) => {
    if (mode) {
      setPlaybackMode(mode);
    }

    const chosenServer = streamKey
      ? event.servers.find((s) => s.streamKey === streamKey) || event.servers[0]
      : event.servers[0];

    const key = chosenServer?.streamKey || streamKey || 'espn';

    setActiveStream({
      streamKey: key,
      title: event.title,
      sportName: event.sportName,
      leagueName: event.leagueName,
      serverName: chosenServer?.name,
      originalUrl: chosenServer?.url,
    });

    setAvailableServers(event.servers);
  };

  // Handle playing a channel from the 24/7 grid
  const handlePlayChannel = (channel: Channel, mode?: PlaybackMode) => {
    if (mode) {
      setPlaybackMode(mode);
    }

    setActiveStream({
      streamKey: channel.slug,
      title: channel.name,
      sportName: channel.category,
      leagueName: channel.country,
      serverName: channel.name,
    });

    setAvailableServers([{ name: channel.name, url: '', streamKey: channel.slug }]);
  };

  // Handle manual stream key change
  const handleStreamChange = (streamKey: string, customTitle?: string) => {
    const matchChannel = CHANNELS.find(
      (c) => c.slug.toLowerCase() === streamKey.toLowerCase()
    );

    setActiveStream({
      streamKey,
      title: customTitle || (matchChannel ? matchChannel.name : streamKey.toUpperCase()),
      sportName: matchChannel?.category || 'Deportes',
      leagueName: matchChannel?.country || 'Señal Directa',
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
        playbackMode={playbackMode}
        setPlaybackMode={setPlaybackMode}
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        eventsCount={events.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-4 sm:py-6 space-y-5">
        {/* Isolated Sports Player */}
        <section aria-label="Reproductor de Deportes">
          <PlayerView
            activeStream={activeStream}
            playbackMode={playbackMode}
            setPlaybackMode={setPlaybackMode}
            theme={theme}
            onStreamChange={handleStreamChange}
            availableServers={availableServers}
          />
        </section>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {activeTab === 'all' && (
            <EventsList
              events={events}
              isLoading={isLoadingEvents}
              onRefresh={() => fetchEvents(true)}
              playbackMode={playbackMode}
              theme={theme}
              onPlayEvent={handlePlayEvent}
              searchQuery={searchQuery}
              defaultSportFilter="all"
            />
          )}

          {activeTab === 'futbol' && (
            <EventsList
              events={events}
              isLoading={isLoadingEvents}
              onRefresh={() => fetchEvents(true)}
              playbackMode={playbackMode}
              theme={theme}
              onPlayEvent={handlePlayEvent}
              searchQuery={searchQuery}
              defaultSportFilter="futbol"
            />
          )}

          {activeTab === 'f1' && (
            <EventsList
              events={events}
              isLoading={isLoadingEvents}
              onRefresh={() => fetchEvents(true)}
              playbackMode={playbackMode}
              theme={theme}
              onPlayEvent={handlePlayEvent}
              searchQuery={searchQuery}
              defaultSportFilter="f1"
            />
          )}

          {activeTab === 'channels' && (
            <ChannelsGrid
              playbackMode={playbackMode}
              theme={theme}
              onPlayChannel={handlePlayChannel}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'servers' && (
            <ServerFeedbackView theme={theme} />
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
            <span className="font-bold">STREAMXHD</span>
            <span>&bull;</span>
            <span>Fútbol & Fórmula 1</span>
            <span>&bull;</span>
            <span
              onClick={() => setActiveTab('servers')}
              className="cursor-pointer hover:underline font-mono"
            >
              Servidores Oficiales (StreamVeri)
            </span>
          </div>

          <div className="text-[11px] font-mono">
            {events.length} eventos sincronizados &bull; Live1 Manual / Live2 Auto
          </div>
        </div>
      </footer>
    </div>
  );
}
