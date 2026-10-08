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
  // ESPN
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
  { id: 'espn3mx', name: 'ESPN 3 MX', slug: 'espn3mx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'espndeportes', name: 'ESPN Deportes USA', slug: 'espndeportes', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },

  // Sudamérica / DirecTV
  { id: 'dsports', name: 'Dsports', slug: 'dsports', category: 'DSports', country: 'Panregional', countryCode: 'LATAM', popular: true },
  { id: 'dsports2', name: 'Dsports 2', slug: 'dsports2', category: 'DSports', country: 'Panregional', countryCode: 'LATAM' },
  { id: 'dsportsplus', name: 'Dsports +', slug: 'dsportsplus', category: 'DSports', country: 'Panregional', countryCode: 'LATAM' },

  // Argentina
  { id: 'tycsports', name: 'TyC Sports', slug: 'tycsports', category: 'Argentina', country: 'Argentina', countryCode: 'ARG', popular: true },
  { id: 'tycinternacional', name: 'TyC Sports Internacional', slug: 'tycinternacional', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'tntsports', name: 'TNT Sports Argentina', slug: 'tntsports', category: 'Argentina', country: 'Argentina', countryCode: 'ARG', popular: true },
  { id: 'fox1ar', name: 'Fox Sports 1 (Argentina)', slug: 'fox1ar', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'fox2ar', name: 'Fox Sports 2 (Argentina)', slug: 'fox2ar', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'fox3ar', name: 'Fox Sports 3 (Argentina)', slug: 'fox3ar', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'telefe', name: 'Telefe', slug: 'telefe', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },
  { id: 'tv_publica', name: 'TV Pública', slug: 'tv_publica', category: 'Argentina', country: 'Argentina', countryCode: 'ARG' },

  // Colombia
  { id: 'winplus', name: 'Win Sports +', slug: 'winplus', category: 'Colombia', country: 'Colombia', countryCode: 'COL', popular: true },
  { id: 'winplus2', name: 'Win Sports + (Op2)', slug: 'winplus2', category: 'Colombia', country: 'Colombia', countryCode: 'COL' },
  { id: 'winsports', name: 'Win Sports', slug: 'winsports', category: 'Colombia', country: 'Colombia', countryCode: 'COL' },

  // Chile
  { id: 'tntsportschile', name: 'TNT Sports Chile', slug: 'tntsportschile', category: 'Chile', country: 'Chile', countryCode: 'CHI', popular: true },

  // Perú / Centroamérica
  { id: 'liga1max', name: 'Liga 1 MAX Perú', slug: 'liga1max', category: 'Perú', country: 'Perú', countryCode: 'PER' },
  { id: 'futv', name: 'FUTV Costa Rica', slug: 'futv', category: 'Centroamérica', country: 'Costa Rica', countryCode: 'CRC' },

  // Brasil
  { id: 'premiere1', name: 'Premiere 1 BR', slug: 'premiere1', category: 'Brasil', country: 'Brasil', countryCode: 'BRA', popular: true },
  { id: 'premiere2', name: 'Premiere 2 BR', slug: 'premiere2', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'premiere3', name: 'Premiere 3 BR', slug: 'premiere3', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'premiere4', name: 'Premiere 4 BR', slug: 'premiere4', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'premiere5', name: 'Premiere 5 BR', slug: 'premiere5', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'sporttvbr1', name: 'SporTV 1 BR', slug: 'sporttvbr1', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'sporttvbr2', name: 'SporTV 2 BR', slug: 'sporttvbr2', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },
  { id: 'sporttvbr3', name: 'SporTV 3 BR', slug: 'sporttvbr3', category: 'Brasil', country: 'Brasil', countryCode: 'BRA' },

  // México
  { id: 'foxsportsmx', name: 'Fox Sports 1 MX', slug: 'foxsportsmx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxsports2mx', name: 'Fox Sports 2 MX', slug: 'foxsports2mx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxsports3mx', name: 'Fox Sports 3 MX', slug: 'foxsports3mx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxsportspremium', name: 'Fox Sports Premium MX', slug: 'foxsportspremium', category: 'México', country: 'México', countryCode: 'MEX', popular: true },
  { id: 'foxone', name: 'Fox ONE MX', slug: 'foxone', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxone1', name: 'Fox ONE 1 MX', slug: 'foxone1', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxone2', name: 'Fox ONE 2 MX', slug: 'foxone2', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'foxone3', name: 'Fox ONE 3 MX', slug: 'foxone3', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'tudnmx', name: 'TUDN MX', slug: 'tudnmx', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'azteca7', name: 'Azteca 7 MX', slug: 'azteca7', category: 'México', country: 'México', countryCode: 'MEX' },
  { id: 'canal5mx', name: 'Canal 5 MX', slug: 'canal5mx', category: 'México', country: 'México', countryCode: 'MEX' },

  // USA & España
  { id: 'tudn_usa', name: 'TUDN USA', slug: 'tudn_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'fox_1_usa', name: 'Fox Sports 1 USA', slug: 'fox_1_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'fox_2_usa', name: 'Fox Sports 2 USA', slug: 'fox_2_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'universo_usa', name: 'Universo USA', slug: 'universo_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'univision_usa', name: 'Univisión USA', slug: 'univision_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'fox_deportes_usa', name: 'Fox Deportes USA', slug: 'fox_deportes_usa', category: 'USA', country: 'Estados Unidos', countryCode: 'USA' },
  { id: 'laligahypermotion', name: 'LaLiga Hypermotion', slug: 'laligahypermotion', category: 'España', country: 'España', countryCode: 'ESP' },

  // Reino Unido
  { id: 'tnt_1_gb', name: 'TNT Sports 1 UK', slug: 'tnt_1_gb', category: 'UK', country: 'Reino Unido', countryCode: 'GBR' },
  { id: 'tnt_2_gb', name: 'TNT Sports 2 UK', slug: 'tnt_2_gb', category: 'UK', country: 'Reino Unido', countryCode: 'GBR' },
  { id: 'tnt_3_gb', name: 'TNT Sports 3 UK', slug: 'tnt_3_gb', category: 'UK', country: 'Reino Unido', countryCode: 'GBR' },
  { id: 'tnt_4_gb', name: 'TNT Sports 4 UK', slug: 'tnt_4_gb', category: 'UK', country: 'Reino Unido', countryCode: 'GBR' },
];

export const CATEGORIES = [
  'Todos',
  'Popular',
  'ESPN',
  'Argentina',
  'Colombia',
  'Chile',
  'Brasil',
  'México',
  'USA',
  'DSports',
  'UK',
  'España',
];
