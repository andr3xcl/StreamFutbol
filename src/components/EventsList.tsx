import React, { useState } from 'react';
import { RefreshCw, Play, Trophy, Flag } from 'lucide-react';
import { SportEvent, PlaybackMode, Theme } from '../types';

interface EventsListProps {
  events: SportEvent[];
  isLoading: boolean;
  onRefresh: () => void;
  playbackMode: PlaybackMode;
  theme: Theme;
  onPlayEvent: (event: SportEvent, streamKey?: string, mode?: PlaybackMode) => void;
  searchQuery: string;
  defaultSportFilter?: 'all' | 'futbol' | 'f1';
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onRefresh,
  playbackMode,
  theme,
  onPlayEvent,
  searchQuery,
  defaultSportFilter = 'all',
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(defaultSportFilter);
  const [selectedLeague, setSelectedLeague] = useState<string>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const isDark = theme === 'dark';

  // Get leagues list
  const leagues = ['Todas', ...Array.from(new Set(events.map((e) => e.leagueName).filter(Boolean)))];

  const filteredEvents = events.filter((ev) => {
    // Search query filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      ev.title.toLowerCase().includes(query) ||
      ev.leagueName.toLowerCase().includes(query) ||
      ev.sportName.toLowerCase().includes(query) ||
      ev.servers.some((s) => s.name.toLowerCase().includes(query) || (s.streamKey && s.streamKey.toLowerCase().includes(query)));

    // Sport filter
    let matchesSport = true;
    if (selectedSport === 'futbol') {
      matchesSport = ev.sportId === 'futbol' || ev.sportName.toLowerCase().includes('fútbol') || ev.sportName.toLowerCase().includes('futbol');
    } else if (selectedSport === 'f1') {
      matchesSport =
        ev.sportId === 'f1' ||
        ev.sportId.includes('auto') ||
        ev.sportId.includes('motor') ||
        ev.leagueName.toLowerCase().includes('f1') ||
        ev.leagueName.toLowerCase().includes('fórmula') ||
        ev.title.toLowerCase().includes('f1');
    }

    // League filter
    const matchesLeague = selectedLeague === 'Todas' || ev.leagueName === selectedLeague;

    // Status filter
    const matchesStatus =
      selectedStatus === 'Todos' ||
      (selectedStatus === 'live' && ev.status === 'live') ||
      (selectedStatus === 'upcoming' && ev.status === 'upcoming');

    return matchesSearch && matchesSport && matchesLeague && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        {/* Sport pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
          <button
            onClick={() => {
              setSelectedSport('all');
              setSelectedLeague('Todas');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
              selectedSport === 'all'
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-white border-black'
                : isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
            }`}
          >
            Todos ({events.length})
          </button>

          <button
            onClick={() => {
              setSelectedSport('futbol');
              setSelectedLeague('Todas');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
              selectedSport === 'futbol'
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-white border-black'
                : isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
            }`}
          >
            <Trophy className="w-3 h-3 opacity-60" />
            <span>Fútbol</span>
          </button>

          <button
            onClick={() => {
              setSelectedSport('f1');
              setSelectedLeague('Todas');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
              selectedSport === 'f1'
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-white border-black'
                : isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
            }`}
          >
            <Flag className="w-3 h-3 opacity-60" />
            <span>Fórmula 1 & Motor</span>
          </button>
        </div>

        {/* Status filter & Refresh */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div
            className={`flex items-center p-0.5 rounded border text-xs font-medium ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
            }`}
          >
            <button
              onClick={() => setSelectedStatus('Todos')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                selectedStatus === 'Todos'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-white text-black shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedStatus('live')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                selectedStatus === 'live'
                  ? 'bg-red-600 text-white'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              En Vivo
            </button>
            <button
              onClick={() => setSelectedStatus('upcoming')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                selectedStatus === 'upcoming'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-white text-black shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              Próximos
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`p-1.5 rounded border text-xs transition-colors disabled:opacity-50 ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-200 text-zinc-700 hover:text-black'
            }`}
            title="Actualizar eventos deportivos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Events Schedule List */}
      {isLoading ? (
        <div className="p-16 text-center font-mono text-xs opacity-60">
          Cargando agenda deportiva en vivo...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div
          className={`p-10 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-xs font-medium">No hay eventos para los filtros seleccionados.</p>
        </div>
      ) : (
        <div
          className={`rounded-lg border divide-y overflow-hidden ${
            isDark ? 'bg-black border-zinc-800 divide-zinc-800' : 'bg-white border-zinc-200 divide-zinc-100'
          }`}
        >
          {filteredEvents.map((event) => {
            const isLive = event.status === 'live';
            const primaryServer = event.servers[0];
            const defaultKey = primaryServer?.streamKey || 'espn';

            return (
              <div
                key={event.id}
                className={`p-3.5 sm:px-4 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors ${
                  isDark ? 'hover:bg-zinc-950' : 'hover:bg-zinc-50'
                }`}
              >
                {/* Column 1: Time, Status, League */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-16 shrink-0">
                    <span className="font-mono text-xs font-bold block">{event.time}</span>
                    {isLive ? (
                      <span className="text-[10px] font-black uppercase text-red-600 block">
                        EN VIVO
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-zinc-400 block">
                        PRÓX
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 md:flex-initial md:w-64">
                    <span
                      className={`text-[11px] font-semibold block truncate ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {event.sportName} &bull; {event.leagueName}
                    </span>
                    <span className="font-bold text-sm leading-snug block truncate">
                      {event.title}
                    </span>
                  </div>
                </div>

                {/* Column 2: Available Servers Pills */}
                <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto max-w-md">
                  {event.servers.slice(0, 4).map((srv, idx) => (
                    <button
                      key={`${srv.name}-${idx}`}
                      onClick={() => {
                        onPlayEvent(event, srv.streamKey);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-black'
                      }`}
                      title={`Reproducir en ${srv.name}`}
                    >
                      {srv.name}
                    </button>
                  ))}
                  {event.servers.length > 4 && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      +{event.servers.length - 4} más
                    </span>
                  )}
                </div>

                {/* Column 3: Play Button & Live1/Live2 switches */}
                <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      onPlayEvent(event, defaultKey);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isDark
                        ? 'bg-zinc-100 hover:bg-white text-black'
                        : 'bg-black hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ver</span>
                  </button>

                  <div
                    className={`flex items-center p-0.5 rounded border text-[11px] font-mono ${
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onPlayEvent(event, defaultKey, 'live1');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackMode === 'live1'
                          ? isDark
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'bg-white text-black font-bold'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Reproducir en Live1 (Manual)"
                    >
                      L1
                    </button>
                    <button
                      onClick={() => {
                        onPlayEvent(event, defaultKey, 'live2');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackMode === 'live2'
                          ? isDark
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'bg-white text-black font-bold'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Reproducir en Live2 (Auto)"
                    >
                      L2
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
