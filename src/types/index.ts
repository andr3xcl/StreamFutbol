export interface SportEvent {
  id: string;
  title: string;
  category: string;
  time: string;
  url: string;
  quality: string;
  clase: string;
  status: 'live' | 'next' | string;
  streamKey: string;
}

export type PlayerMode = 'global1' | 'global2';
export type Theme = 'dark' | 'light';

export interface ActiveStream {
  streamKey: string;
  title: string;
  category?: string;
  quality?: string;
  status?: string;
  countryCode?: string;
}
