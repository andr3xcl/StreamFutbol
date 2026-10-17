export type Theme = 'dark' | 'light';
export type PlaybackMode = 'live1' | 'live2'; // live1 = manual, live2 = automático

export interface ServerOption {
  name: string;
  url: string;
  streamKey?: string;
  isDrm?: boolean;
}

export interface SportEvent {
  id: string;
  title: string;
  sportId: string; // 'futbol' | 'automovilismo' | 'motor' | 'tenis' | 'beisbol' etc.
  sportName: string;
  leagueName: string;
  homeTeam?: string;
  awayTeam?: string;
  time: string;
  rawTime?: string;
  status: 'live' | 'upcoming';
  servers: ServerOption[];
  country?: string;
}

export interface DomainStatus {
  url: string;
  label: string;
  isPrimary: boolean;
  status: 'online' | 'offline';
  pingMs?: number;
}

export interface ActiveStream {
  streamKey: string;
  title: string;
  sportName?: string;
  leagueName?: string;
  serverName?: string;
  originalUrl?: string;
  mode?: PlaybackMode;
}
