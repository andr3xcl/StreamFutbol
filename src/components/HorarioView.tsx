import React, { useState, useEffect } from 'react';
import { Calendar, Play, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { HorarioMediaItem, Theme } from '../types/anime';

interface HorarioViewProps {
  theme: Theme;
  onPlayEpisode: (slug: string, number: number) => void;
  onSelectMedia: (slug: string) => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const HorarioView: React.FC<HorarioViewProps> = ({
  theme,
  onPlayEpisode,
  onSelectMedia,
}) => {
  const [scheduleList, setScheduleList] = useState<HorarioMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    // Current day in local time
    const dayMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDay = dayMap[new Date().getDay()];
    return currentDay;
  });

  const isDark = theme === 'dark';

  const fetchHorario = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/anime/horario');
      if (res.ok) {
        const json = await res.json();
        if (json.media) {
          setScheduleList(json.media);
        }
      }
    } catch (err) {
      console.error('Error fetching horario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHorario();
  }, []);

  const filteredMedia = scheduleList.filter((item) => {
    if (selectedDay === 'Todos') return true;
    return item.dayName === selectedDay;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header Bar */}
      <div
        className={`p-4 sm:p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded flex items-center justify-center font-bold text-xs border ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Horario de Emisión Semanal</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">
                ({scheduleList.length} en emisión)
              </span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Consulta qué animes estrenan nuevos episodios cada día de la semana.
            </p>
          </div>
        </div>

        <button
          onClick={fetchHorario}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors disabled:opacity-50 ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedDay('Todos')}
          className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
            selectedDay === 'Todos'
              ? isDark
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-black'
              : isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
          }`}
        >
          Todos ({scheduleList.length})
        </button>

        {DAYS.map((day) => {
          const count = scheduleList.filter((x) => x.dayName === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                selectedDay === day
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-black'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
              }`}
            >
              <span>{day}</span>
              {count > 0 && <span className="opacity-60 ml-1">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Media Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center font-mono text-xs opacity-60">
          Cargando horario semanal oficial de Littlegods Anime...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div
          className={`p-12 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-sm font-semibold">No hay animes en emisión programados para {selectedDay}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredMedia.map((anime) => {
            const epNum = anime.latestEpisode?.number || 1;

            return (
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

                    {/* Day Badge */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase bg-black/85 text-white px-1.5 py-0.5 rounded border border-white/10">
                        {anime.dayName}
                      </span>
                    </div>

                    {/* Latest Ep Badge */}
                    {anime.latestEpisode && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <span className="text-[10px] font-mono font-bold bg-black/85 text-white px-1.5 py-0.5 rounded border border-white/10">
                          EP {anime.latestEpisode.number}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">
                      {anime.category?.name || 'TV Anime'}
                    </span>
                    <h3 className="font-bold text-xs leading-snug line-clamp-2 group-hover:underline">
                      {anime.title}
                    </h3>
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
                      onPlayEpisode(anime.slug, epNum);
                    }}
                    className={`w-full py-1 rounded font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                      isDark
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300'
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Ver Ep. {epNum}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
