import React, { useState, useEffect } from 'react';
import { Star, Play } from 'lucide-react';
import { CHANNELS, CATEGORIES, Channel } from '../data/channels';
import { PlayerMode, Theme } from '../types';

interface ChannelsGridProps {
  playerMode: PlayerMode;
  theme: Theme;
  onPlayChannel: (channel: Channel, mode?: PlayerMode) => void;
  searchQuery: string;
}

export const ChannelsGrid: React.FC<ChannelsGridProps> = ({
  playerMode,
  theme,
  onPlayChannel,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('streamtp_fav_channels');
      return saved ? JSON.parse(saved) : ['espn', 'winplus', 'tycsports', 'dsports'];
    } catch {
      return ['espn', 'winplus', 'tycsports', 'dsports'];
    }
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('streamtp_fav_channels', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  const filteredChannels = CHANNELS.filter((ch) => {
    const matchesSearch =
      !searchQuery ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'Favoritos') return favorites.includes(ch.id);

    return ch.category === selectedCategory || ch.countryCode === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('Favoritos')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
            selectedCategory === 'Favoritos'
              ? isDark
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-black'
              : isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          <span>Favoritos ({favorites.length})</span>
        </button>

        {CATEGORIES.map((cat) => {
          if (cat === 'Popular') return null;
          return (
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
          );
        })}
      </div>

      {/* Channel Cards Grid */}
      {filteredChannels.length === 0 ? (
        <div
          className={`p-10 text-center rounded-lg border ${
            isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
          }`}
        >
          <p className="text-xs font-medium">No se encontraron canales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {filteredChannels.map((channel) => {
            const isFav = favorites.includes(channel.id);

            return (
              <div
                key={channel.id}
                onClick={() => {
                  onPlayChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-black border-zinc-800 hover:border-zinc-700'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div>
                  {/* Top Bar: Country & Fav */}
                  <div className="flex items-center justify-between mb-2 text-[11px] text-zinc-400">
                    <span className="truncate">{channel.country}</span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(channel.id, e)}
                      className="p-0.5 hover:text-zinc-100 transition-colors"
                      title={isFav ? 'Quitar favorito' : 'Marcar favorito'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-current text-white' : 'opacity-40'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Channel Name & Slug */}
                  <div className="font-bold text-sm leading-tight truncate">
                    {channel.name}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5 truncate">
                    {channel.slug}
                  </div>
                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Ver</span>
                  </div>

                  <div
                    className={`flex items-center p-0.5 rounded border text-[10px] font-mono ${
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        onPlayChannel(channel, 'global1');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="px-1 py-0.5 rounded hover:bg-zinc-800 hover:text-white"
                      title="G1 (Manual)"
                    >
                      G1
                    </button>
                    <button
                      onClick={() => {
                        onPlayChannel(channel, 'global2');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="px-1 py-0.5 rounded hover:bg-zinc-800 hover:text-white"
                      title="G2 (Auto)"
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
