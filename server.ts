import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache
const memoryCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function getCached(key: string) {
  const item = memoryCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

function setCached(key: string, data: any, ttl = CACHE_TTL_MS) {
  memoryCache.set(key, { data, expiry: Date.now() + ttl });
}

// Fetch and parse SvelteKit data from AnimeAV1 HTML
function fetchAnimeAV1Page(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://animeav1.com/',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (res) => {
        let html = '';
        res.on('data', (chunk) => (html += chunk));
        res.on('end', () => {
          try {
            const match = html.match(
              /kit\.start\(app,\s*element,\s*(\{[\s\S]*?\})\s*\);/
            );
            if (match) {
              const sandbox: any = {};
              new vm.Script('res = ' + match[1]).runInNewContext(sandbox);
              const dataArray = sandbox.res?.data || [];
              const foundNode = dataArray.find(
                (d: any) =>
                  d &&
                  d.data &&
                  (d.data.media ||
                    d.data.featured ||
                    d.data.episode ||
                    d.data.results)
              );
              resolve(foundNode ? foundNode.data : null);
            } else {
              resolve(null);
            }
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

// Helper to attach cover and image URLs
function enrichMediaWithCovers(media: any) {
  if (!media) return media;
  const id = media.id;
  return {
    ...media,
    coverUrl: id ? `https://cdn.animeav1.com/covers/${id}.jpg` : undefined,
    thumbnailUrl: id ? `https://cdn.animeav1.com/thumbnails/${id}.jpg` : undefined,
    backdropUrl: id ? `https://cdn.animeav1.com/backdrops/${id}.jpg` : undefined,
  };
}

const DAYS_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Fallback data
const FALLBACK_HOME = {
  featured: [
    enrichMediaWithCovers({
      id: 4384,
      title: 'Mushoku Tensei III: Isekai Ittara Honki Dasu',
      slug: 'mushoku-tensei-iii-isekai-ittara-honki-dasu',
      synopsis: 'Tercera temporada de Mushoku Tensei: Isekai Ittara Honki Dasu.',
      startDate: '2026-07-06',
      genres: [
        { id: 32, name: 'Isekai', slug: 'isekai' },
        { id: 2, name: 'Aventura', slug: 'aventura' },
        { id: 7, name: 'Fantasía', slug: 'fantasia' },
      ],
      category: { id: 1, name: 'TV Anime' },
    }),
    enrichMediaWithCovers({
      id: 197,
      title: 'One Piece',
      slug: 'one-piece',
      synopsis:
        'Apenas sobreviviendo en un barril tras pasar por un remolino en el mar, Monkey D. Luffy persigue el One Piece.',
      startDate: '1999-10-20',
      genres: [
        { id: 1, name: 'Acción', slug: 'accion' },
        { id: 2, name: 'Aventura', slug: 'aventura' },
      ],
      category: { id: 1, name: 'TV Anime' },
    }),
  ],
  latestEpisodes: [
    {
      id: 60377,
      number: 2,
      publishedAt: '2026-10-07 19:03:56.896+00',
      media: {
        id: 4442,
        slug: 'tensei-shitara-ken-deshita-ii',
        title: 'Tensei shitara Ken deshita II',
      },
      thumbnailUrl: 'https://cdn.animeav1.com/thumbnails/4442.jpg',
      coverUrl: 'https://cdn.animeav1.com/covers/4442.jpg',
    },
    {
      id: 60376,
      number: 1,
      publishedAt: '2026-10-07 18:19:56.559+00',
      media: {
        id: 4485,
        slug: 'kikansha-no-mahou-wa-tokubetsu-desu-2nd-season',
        title: 'Kikansha no Mahou wa Tokubetsu desu 2nd Season',
      },
      thumbnailUrl: 'https://cdn.animeav1.com/thumbnails/4485.jpg',
      coverUrl: 'https://cdn.animeav1.com/covers/4485.jpg',
    },
    {
      id: 60375,
      number: 1,
      publishedAt: '2026-10-07 17:24:21.784+00',
      media: {
        id: 4484,
        slug: 'juuou-mujin-dandivine',
        title: 'Juuou Mujin Dandivine',
      },
      thumbnailUrl: 'https://cdn.animeav1.com/thumbnails/4484.jpg',
      coverUrl: 'https://cdn.animeav1.com/covers/4484.jpg',
    },
    {
      id: 59421,
      number: 1,
      publishedAt: '2026-07-04 11:25:23.217+00',
      media: {
        id: 4384,
        slug: 'mushoku-tensei-iii-isekai-ittara-honki-dasu',
        title: 'Mushoku Tensei III: Isekai Ittara Honki Dasu',
      },
      thumbnailUrl: 'https://cdn.animeav1.com/thumbnails/4384.jpg',
      coverUrl: 'https://cdn.animeav1.com/covers/4384.jpg',
    },
  ],
  latestMedia: [
    enrichMediaWithCovers({
      id: 4384,
      title: 'Mushoku Tensei III: Isekai Ittara Honki Dasu',
      slug: 'mushoku-tensei-iii-isekai-ittara-honki-dasu',
      synopsis: 'Tercera temporada de Mushoku Tensei.',
      category: { id: 1, name: 'TV Anime' },
    }),
  ],
};

// API: Home Data
app.get('/api/anime/home', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === '1';
  const cacheKey = 'home_data';
  const cached = forceRefresh ? null : getCached(cacheKey);
  if (cached) {
    return res.json({ ok: true, source: 'cache', data: cached });
  }

  try {
    const rawData = await fetchAnimeAV1Page('https://animeav1.com/');
    if (rawData && (rawData.featured || rawData.latestEpisodes)) {
      const result = {
        featured: (rawData.featured || []).map(enrichMediaWithCovers),
        latestEpisodes: (rawData.latestEpisodes || []).map((ep: any) => ({
          ...ep,
          thumbnailUrl: ep.media?.id
            ? `https://cdn.animeav1.com/thumbnails/${ep.media.id}.jpg`
            : undefined,
          coverUrl: ep.media?.id
            ? `https://cdn.animeav1.com/covers/${ep.media.id}.jpg`
            : undefined,
        })),
        latestMedia: (rawData.latestMedia || []).map(enrichMediaWithCovers),
      };
      setCached(cacheKey, result, 45 * 1000);
      return res.json({ ok: true, source: 'upstream', data: result });
    }
  } catch (err) {
    console.warn('Failed to fetch animeav1 home data:', err);
  }

  return res.json({ ok: true, source: 'fallback', data: FALLBACK_HOME });
});

// API: Horario (Schedule)
app.get('/api/anime/horario', async (req: Request, res: Response) => {
  const cacheKey = 'horario_data';
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ok: true, source: 'cache', media: cached });
  }

  try {
    const rawData = await fetchAnimeAV1Page('https://animeav1.com/horario');
    if (rawData && rawData.media && Array.isArray(rawData.media)) {
      const enriched = rawData.media.map((item: any) => {
        let dayIdx = 0;
        if (item.startDate) {
          dayIdx = new Date(item.startDate + 'T12:00:00Z').getUTCDay();
        } else if (item.latestEpisode?.createdAt) {
          dayIdx = new Date(item.latestEpisode.createdAt).getUTCDay();
        }

        return {
          ...enrichMediaWithCovers(item),
          dayIndex: dayIdx,
          dayName: DAYS_NAMES[dayIdx] || 'Lunes',
        };
      });

      setCached(cacheKey, enriched, 5 * 60 * 1000);
      return res.json({ ok: true, source: 'upstream', media: enriched });
    }
  } catch (err) {
    console.warn('Failed to fetch animeav1 horario:', err);
  }

  return res.json({ ok: true, source: 'fallback', media: [] });
});

// API: Catalogo
app.get('/api/anime/catalogo', async (req: Request, res: Response) => {
  const page = (req.query.page as string) || '1';
  const category = (req.query.category as string) || '';
  const genre = (req.query.genre as string) || '';
  const order = (req.query.order as string) || '';
  const search = (req.query.search as string) || '';

  const queryParts = [];
  if (page) queryParts.push(`page=${encodeURIComponent(page)}`);
  if (category) queryParts.push(`category=${encodeURIComponent(category)}`);
  if (genre) queryParts.push(`genre=${encodeURIComponent(genre)}`);
  if (order) queryParts.push(`order=${encodeURIComponent(order)}`);
  if (search) queryParts.push(`search=${encodeURIComponent(search)}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const cacheKey = `catalogo_${queryString}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ok: true, source: 'cache', ...cached });
  }

  try {
    const targetUrl = `https://animeav1.com/catalogo${queryString}`;
    const rawData = await fetchAnimeAV1Page(targetUrl);
    if (rawData && rawData.results) {
      const resultData = {
        results: (rawData.results || []).map(enrichMediaWithCovers),
        pagination: rawData.pagination || {
          currentPage: Number(page) || 1,
          totalPages: 1,
          totalRecords: rawData.results.length,
          recordsPerPage: 20,
        },
        genres: rawData.genresIdsMap || {},
        categories: rawData.categoriesIdsMap || {},
      };

      setCached(cacheKey, resultData, 2 * 60 * 1000);
      return res.json({ ok: true, source: 'upstream', ...resultData });
    }
  } catch (err) {
    console.warn('Failed to fetch animeav1 catalogo:', err);
  }

  return res.json({
    ok: true,
    source: 'fallback',
    results: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      recordsPerPage: 20,
    },
    genres: {},
    categories: {},
  });
});

// API: Search Anime
app.get('/api/anime/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    return res.json({ ok: true, results: [] });
  }

  const cacheKey = `search_${query.toLowerCase().trim()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ok: true, source: 'cache', results: cached });
  }

  try {
    const targetUrl = `https://animeav1.com/catalogo?search=${encodeURIComponent(
      query.trim()
    )}`;
    const rawData = await fetchAnimeAV1Page(targetUrl);
    if (rawData && rawData.results) {
      const results = rawData.results.map(enrichMediaWithCovers);
      setCached(cacheKey, results, 2 * 60 * 1000);
      return res.json({ ok: true, source: 'upstream', results });
    }
  } catch (err) {
    console.warn(`Failed to search anime query "${query}":`, err);
  }

  return res.json({ ok: true, source: 'empty', results: [] });
});

// API: Media Details & Episode List
app.get('/api/anime/media/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const cacheKey = `media_${slug}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ ok: true, source: 'cache', data: cached });
  }

  try {
    const targetUrl = `https://animeav1.com/media/${encodeURIComponent(slug)}`;
    const rawData = await fetchAnimeAV1Page(targetUrl);
    if (rawData && rawData.media) {
      const enriched = enrichMediaWithCovers(rawData.media);
      setCached(cacheKey, enriched, 2 * 60 * 1000);
      return res.json({ ok: true, source: 'upstream', data: enriched });
    }
  } catch (err) {
    console.warn(`Failed to fetch animeav1 media ${slug}:`, err);
  }

  return res.status(404).json({
    ok: false,
    error: `No se encontró la información del anime "${slug}".`,
  });
});

// API: Episode Details, Servers & Downloads
app.get(
  '/api/anime/episode/:slug/:number',
  async (req: Request, res: Response) => {
    const { slug, number } = req.params;
    const cacheKey = `episode_${slug}_${number}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ ok: true, source: 'cache', data: cached });
    }

    try {
      const targetUrl = `https://animeav1.com/media/${encodeURIComponent(
        slug
      )}/${encodeURIComponent(number)}`;
      const rawData = await fetchAnimeAV1Page(targetUrl);
      if (rawData && rawData.episode && rawData.embeds) {
        if (rawData.media) {
          rawData.media = enrichMediaWithCovers(rawData.media);
        }
        setCached(cacheKey, rawData, 5 * 60 * 1000);
        return res.json({ ok: true, source: 'upstream', data: rawData });
      }
    } catch (err) {
      console.warn(`Failed to fetch animeav1 episode ${slug}/${number}:`, err);
    }

    return res.status(404).json({
      ok: false,
      error: `No se pudieron cargar los servidores para el episodio ${number}.`,
    });
  }
);

// Clean isolated video player route
app.get('/api/anime/player', (req: Request, res: Response) => {
  const embedUrl = (req.query.url as string) || '';
  const theme = (req.query.theme as string) === 'light' ? 'light' : 'dark';

  const bgColor = theme === 'light' ? '#ffffff' : '#000000';
  const textColor = theme === 'light' ? '#18181b' : '#fafafa';

  if (!embedUrl) {
    return res.status(400).send('URL de video requerida');
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reproductor</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: ${bgColor};
      color: ${textColor};
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #player-frame {
      width: 100%;
      height: 100%;
      border: 0;
      background-color: #000000;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <iframe
    id="player-frame"
    src="${embedUrl.replace(/"/g, '&quot;')}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    referrerpolicy="no-referrer"
    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
  ></iframe>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  return res.send(html);
});

// Setup Vite dev or static prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Littlegods Anime running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
