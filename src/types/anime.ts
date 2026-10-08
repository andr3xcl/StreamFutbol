export type Theme = 'dark' | 'light';

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface FeaturedAnime {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  startDate?: string;
  status?: number;
  category?: {
    id: number;
    name: string;
  };
  genres?: Genre[];
  coverUrl?: string;
  backdropUrl?: string;
}

export interface LatestEpisodeItem {
  id: number;
  number: number;
  publishedAt: string;
  commentsCount?: number;
  media: {
    id: number;
    title: string;
    slug: string;
  };
  thumbnailUrl?: string;
  coverUrl?: string;
}

export interface LatestMediaItem {
  id: number;
  title: string;
  slug: string;
  synopsis?: string;
  category?: {
    id: number;
    name: string;
  };
  coverUrl?: string;
}

export interface SearchResultItem {
  id: string | number;
  title: string;
  slug: string;
  synopsis?: string;
  category?: {
    id: number;
    name: string;
  };
  coverUrl?: string;
}

export interface HorarioMediaItem {
  id: number;
  title: string;
  slug: string;
  synopsis?: string;
  startDate?: string;
  dayName: string;
  dayIndex: number; // 0 = Domingo, 1 = Lunes, etc.
  category?: {
    id: number;
    name: string;
  };
  latestEpisode?: {
    id: number;
    number: number;
    createdAt?: string;
  };
  coverUrl?: string;
}

export interface CatalogoPagination {
  currentPage: number;
  recordsPerPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface CatalogoData {
  results: SearchResultItem[];
  pagination: CatalogoPagination;
  genres: Record<string, { id: number; name: string; slug: string }>;
  categories: Record<string, { id: number; name: string; slug: string }>;
}

export interface HomeData {
  featured: FeaturedAnime[];
  latestEpisodes: LatestEpisodeItem[];
  latestMedia: LatestMediaItem[];
}

export interface EpisodeListItem {
  id: number;
  number: number;
}

export interface AnimeMediaDetail {
  id: number;
  title: string;
  aka?: {
    'en-us'?: string;
    'ja-jp'?: string;
  };
  synopsis: string;
  score?: number;
  votes?: number;
  episodesCount?: number;
  slug: string;
  startDate?: string;
  endDate?: string;
  status?: number;
  genres?: Genre[];
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  episodes: EpisodeListItem[];
  coverUrl?: string;
  backdropUrl?: string;
}

export interface ServerEmbed {
  server: string;
  url: string;
}

export interface EpisodeDetail {
  media: AnimeMediaDetail;
  episode: {
    id: number;
    number: number;
    variants?: {
      DUB?: number;
      SUB?: number;
    };
  };
  embeds: {
    SUB?: ServerEmbed[];
    DUB?: ServerEmbed[];
  };
  downloads?: {
    SUB?: ServerEmbed[];
    DUB?: ServerEmbed[];
  };
}
