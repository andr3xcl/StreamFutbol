import React, { useState } from 'react';
import { RefreshCw, Play } from 'lucide-react';
import { SportEvent, PlayerMode, Theme } from '../types';

interface EventsListProps {
  events: SportEvent[];
  isLoading: boolean;
  onRefresh: () => void;
  playerMode: PlayerMode;
  theme: Theme;
  onPlayEvent: (event: SportEvent, mode?: PlayerMode) => void;
  searchQuery: string;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onRefresh,
  playerMode,
  theme,
  onPlayEvent,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const isDark = theme === 'dark';

  const categories = ['Todos', ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      !searchQuery ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.streamKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.clase?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || ev.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Todos' ||
      (selectedStatus === 'live' && (ev.status === 'live' || !ev.status)) ||
      (selectedStatus === 'next' && ev.status === 'next');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCountryName = (clase?: string) => {
    switch (clase?.toUpperCase()) {
      case 'CHI': return 'Chile';
      case 'BRA': return 'Brasil';
      case 'ARG': return 'Argentina';
      case 'COL': return 'Colombia';
      case 'MEX': return 'México';
      case 'PER': return 'Perú';
      case 'USA': return 'EE.UU.';
      case 'ESP': return 'España';
      default: return clase || 'Internacional';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                selectedCategory === cat
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filters & Refresh */}
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
              Todos ({events.length})
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
              onClick={() => setSelectedStatus('next')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                selectedStatus === 'next'
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
            title="Actualizar eventos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Events Schedule Table / List */}
      {filteredEvents.length === 0 ? (
        <div
          className={`p-10 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-xs font-medium">No hay eventos en esta selección.</p>
        </div>
      ) : (
        <div
          className={`rounded-lg border divide-y overflow-hidden ${
            isDark ? 'bg-black border-zinc-800 divide-zinc-800' : 'bg-white border-zinc-200 divide-zinc-100'
          }`}
        >
          {filteredEvents.map((event) => {
            const isLive = event.status === 'live' || !event.status;

            return (
              <div
                key={event.id}
                className={`p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                  isDark ? 'hover:bg-zinc-950' : 'hover:bg-zinc-50'
                }`}
              >
                {/* Column 1: Time, Status, Category */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
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

                  <div className="min-w-0 flex-1 sm:flex-initial sm:w-56">
                    <span
                      className={`text-[11px] font-semibold block truncate ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {event.category} &bull; {getCountryName(event.clase)}
                    </span>
                    <span className="font-bold text-sm leading-snug block truncate">
                      {event.title}
                    </span>
                  </div>
                </div>

                {/* Column 2: Channel slug & quality */}
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                  <span className="px-1.5 py-0.5 rounded border border-inherit">
                    {event.streamKey}
                  </span>
                  <span>{event.quality || '720p'}</span>
                </div>

                {/* Column 3: Play Button & G1/G2 switches */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onPlayEvent(event);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
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
                        onPlayEvent(event, 'global1');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className={`px-1.5 py-0.5 rounded ${
                        playerMode === 'global1'
                          ? isDark
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'bg-white text-black font-bold'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Reproducir en G1 (Manual)"
                    >
                      G1
                    </button>
                    <button
                      onClick={() => {
                        onPlayEvent(event, 'global2');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className={`px-1.5 py-0.5 rounded ${
                        playerMode === 'global2'
                          ? isDark
                            ? 'bg-zinc-800 text-white font-bold'
                            : 'bg-white text-black font-bold'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title="Reproducir en G2 (Auto)"
                    >
                      G2
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
