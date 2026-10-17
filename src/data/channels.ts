export interface Channel {
  id: string;
  name: string;
  slug: string;
  category: string;
  country: string;
  countryCode: string;
  badge?: string;
  popular?: boolean;
}

export const CHANNELS: Channel[] = [
  // FÓRMULA 1 & MOTOR
  { id: 'f1', name: 'Fórmula 1 En Vivo', slug: 'f1', category: 'Fórmula 1', country: 'Internacional', countryCode: 'F1', popular: true },
  { id: 'f1tv', name: 'F1 TV Pro', slug: 'f1tv', category: 'Fórmula 1', country: 'Internacional', countryCode: 'F1', popular: true },
  { id: 'daznf1', name: 'DAZN F1 España', slug: 'daznf1', category: 'Fórmula 1', country: 'España', countryCode: 'ESP', popular: true },
  { id: 'foxsports3mx', name: 'FOX Sports 3 (F1 México)', slug: 'foxsports3mx', category: 'Fórmula 1', country: 'México', countryCode: 'MEX' },
  { id: 'fox3ar', name: 'FOX Sports 3 (F1 Argentina)', slug: 'fox3ar', category: 'Fórmula 1', country: 'Argentina', countryCode: 'ARG' },
  { id: 'bandsports', name: 'BandSports F1 Brasil', slug: 'bandsports', category: 'Fórmula 1', country: 'Brasil', countryCode: 'BRA' },

  // ESPN / FÚTBOL & DEPORTES
  { id: 'espn', name: 'ESPN 1', slug: 'espn', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM', popular: true },
  { id: 'espn2', name: 'ESPN 2', slug: 'espn2', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM', popular: true },
  { id: 'espn3', name: 'ESPN 3', slug: 'espn3', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'espn4', name: 'ESPN 4', slug: 'espn4', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'espn5', name: 'ESPN 5', slug: 'espn5', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'espn6', name: 'ESPN 6', slug: 'espn6', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'espn7', name: 'ESPN 7', slug: 'espn7', category: 'ESPN', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'espnpremium', name: 'ESPN Premium Argentina', slug: 'espnpremium', category: 'Argentina', country: 'Argentina', countryCode: 'ARG', popular: true },
  { id: 'espnmx', name: 'ESPN MX', slug: 'espnmx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'espn2mx', name: 'ESPN 2 MX', slug: 'espn2mx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'espndeportes', name: 'ESPN Deportes USA', slug: 'espndeportes', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },

  // Sudamérica / DirecTV
  { id: 'dsports', name: 'DSports', slug: 'dsports', category: 'DSports', country: 'Panregional', countryCode: 'LATAM', popular: true },
  { id: 'dsports2', name: 'DSports 2', slug: 'dsports2', category: 'DSports', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'dsportsplus', name: 'DSports +', slug: 'dsportsplus', category: 'DSports', country: 'Panregional', countryCode: 'LATAM' },

  // Argentina
  { id: 'tycsports', name: 'TyC Sports', slug: 'tycsports', category: 'Argentina', country: 'Argentina', countryCode: 'ARG', popular: true },
  { id: 'tycinternacional', name: 'TyC Sports Internacional', slug: 'tycinternacional', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'tntsports', name: 'TNT Sports Argentina', slug: 'tntsports', category: 'Argentina', country: 'Argentina', countryCode: 'ARG', popular: true },
  { id: 'fox1ar', name: 'FOX Sports 1 (Argentina)', slug: 'fox1ar', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'fox2ar', name: 'FOX Sports 2 (Argentina)', slug: 'fox2ar', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'telefe', name: 'Telefe', slug: 'telefe', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },

  // Colombia
  { id: 'winplus', name: 'Win Sports +', slug: 'winplus', category: 'Colombia', country: 'Colombia', countryCode: 'COL', popular: true },
  { id: 'winsports', name: 'Win Sports', slug: 'winsports', category: 'Colombia', country: 'Colombia', countryCode: 'COL' },

  // Chile
  { id: 'tntsportschile', name: 'TNT Sports Chile', slug: 'tntsportschile', category: 'Chile', country: 'Chile', countryCode: 'CHI', popular: true },

  // Perú / Centroamérica
  { id: 'l1max', name: 'Liga 1 MAX Perú', slug: 'l1max', category: 'Perú', country: 'Perú', countryCode: 'PER' },
  { id: 'zapping_ec', name: 'Zapping Sports Ecuador', slug: 'zapping_ec', category: 'Ecuador', country: 'Ecuador', countryCode: 'ECU' },

  // Brasil
  { id: 'premiere1', name: 'Premiere 1 BR', slug: 'premiere1', category: 'Brasil', country: 'Brasil', countryCode: 'BRA', popular: true },
  { id: 'premiere2', name: 'Premiere 2 BR', slug: 'premiere2', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'premiere3', name: 'Premiere 3 BR', slug: 'premiere3', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'sporttvbr1', name: 'SporTV 1 BR', slug: 'sporttvbr1', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },

  // México
  { id: 'foxone', name: 'FOX One MX', slug: 'foxone', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxsportspremium', name: 'FOX Sports Premium MX', slug: 'foxsportspremium', category: 'México', country: 'México', countryCode: 'MEX', popular: true },
  { id: 'tudnmx', name: 'TUDN MX', slug: 'tudnmx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'azteca7', name: 'Azteca 7 MX', slug: 'azteca7', category: 'México', country: 'México', countryCode: 'MEX' },

  // España & LaLiga
  { id: 'daznlaliga', name: 'DAZN LaLiga', slug: 'daznlaliga', category: 'España', country: 'España', countryCode: 'ESP' },
  { id: 'laligahypermotion', name: 'LaLiga Hypermotion', slug: 'laligahypermotion', category: 'España', country: 'España', countryCode: 'ESP' },

  // USA
  { id: 'tudn_usa', name: 'TUDN USA', slug: 'tudn_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'fox_1_usa', name: 'FOX Sports 1 USA', slug: 'fox_1_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'universo', name: 'Universo USA', slug: 'universo', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
];

export const CATEGORIES = [
  'Todos',
  'Popular',
  'Fórmula 1',
  'ESPN',
  'Argentina',
  'Colombia',
  'Chile',
  'Brasil',
  'México',
  'USA',
  'DSports',
  'España',
];
