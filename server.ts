import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Known verified domains from streamveri.xyz
const OFFICIAL_DOMAINS = [
  { url: 'https://streamxhd.com/', label: 'streamxhd.com', isPrimary: true },
  { url: 'https://streamxhd.st/', label: 'streamxhd.st', isPrimary: false },
  { url: 'https://streamxhd.click/', label: 'streamxhd.click', isPrimary: false },
];

// Memory cache
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function getCached(key: string) {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

function setCached(key: string, data: any, ttl = CACHE_TTL_MS) {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

// Fetch helper with timeout
function fetchUrl(targetUrl: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const isHttps = targetUrl.startsWith('https:');
    const client = isHttps ? https : http;

    const req = client.get(
      targetUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${targetUrl}`));
    });
  });
}

// Check domains status from streamveri.xyz
app.get('/api/sports/domains', async (req: Request, res: Response) => {
  const cacheKey = 'domains_status';
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const results = [];
  for (const dom of OFFICIAL_DOMAINS) {
    const start = Date.now();
    let status: 'online' | 'offline' = 'offline';
    let pingMs = 0;
    try {
      await fetchUrl(`${dom.url}eventos.json`, {
        'User-Agent': 'Mozilla/5.0',
      });
      status = 'online';
      pingMs = Date.now() - start;
    } catch {
      status = 'offline';
      pingMs = Date.now() - start;
    }

    results.push({
      url: dom.url,
      label: dom.label,
      isPrimary: dom.isPrimary,
      status,
      pingMs,
    });
  }

  const responseData = {
    ok: true,
    verifierUrl: 'https://streamveri.xyz/',
    domains: results,
  };

  setCached(cacheKey, responseData, 45 * 1000);
  return res.json(responseData);
});

// Fetch events.json with automatic mirror failover
async function fetchEventosData(): Promise<{ data: any; sourceDomain: string }> {
  for (const dom of OFFICIAL_DOMAINS) {
    try {
      const raw = await fetchUrl(`${dom.url}eventos.json?v=${Date.now()}`);
      if (raw && raw.includes('sports')) {
        const json = JSON.parse(raw);
        return { data: json, sourceDomain: dom.url };
      }
    } catch (e) {
      console.warn(`Mirror ${dom.url} failed, trying next...`);
    }
  }
  throw new Error('All streamxhd mirrors are unavailable');
}

// API: Normalize and return all events for Fútbol, F1 and other sports
app.get('/api/sports/events', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === '1';
  const cacheKey = 'sports_events';
  const cached = forceRefresh ? null : getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { data, sourceDomain } = await fetchEventosData();
    const sports = data.sports || [];

    const normalizedEvents: any[] = [];
    const leaguesSet = new Set<string>();

    sports.forEach((sport: any) => {
      const sportId = String(sport.id || '').toLowerCase();
      const sportName = sport.name || 'Deporte';
      const leagues = sport.leagues || [];

      leagues.forEach((league: any) => {
        const leagueName = league.name || 'Liga';
        leaguesSet.add(leagueName);

        const events = league.events || [];
        events.forEach((ev: any, idx: number) => {
          const rawTime = ev.time || ev.hour || '';
          let formattedTime = 'En vivo';
          let isUpcoming = false;

          // Parse time
          if (rawTime.includes('T')) {
            try {
              const d = new Date(rawTime);
              if (!isNaN(d.getTime())) {
                formattedTime = d.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
                if (d.getTime() > Date.now()) {
                  isUpcoming = true;
                }
              }
            } catch {}
          } else if (rawTime) {
            formattedTime = rawTime;
          }

          const home = ev.homeTeam || ev.home || '';
          const away = ev.awayTeam || ev.away || '';
          const title = ev.title || (home && away ? `${home} vs ${away}` : `${sportName} - ${leagueName}`);

          const rawServers = ev.servers || [];
          const servers = rawServers.map((s: any) => {
            const serverUrl = String(s.url || '');
            let streamKey = '';
            const matchStream = serverUrl.match(/stream=([a-zA-Z0-9_\-]+)/i) || serverUrl.match(/id=([a-zA-Z0-9_\-]+)/i);
            if (matchStream) {
              streamKey = matchStream[1];
            } else {
              streamKey = serverUrl.replace(/^https?:\/\/[^\/]+\//, '').replace(/\.php.*$/, '');
            }

            return {
              name: s.name || 'Canal',
              url: serverUrl,
              streamKey,
            };
          });

          // Check if F1 / Motorsport
          const isF1 =
            sportId.includes('auto') ||
            sportId.includes('motor') ||
            sportName.toLowerCase().includes('fórmula') ||
            sportName.toLowerCase().includes('formula') ||
            leagueName.toLowerCase().includes('fórmula') ||
            leagueName.toLowerCase().includes('f1') ||
            title.toLowerCase().includes('f1') ||
            title.toLowerCase().includes('gran premio');

          normalizedEvents.push({
            id: ev.id || `${sportId}-${idx}-${Date.now()}`,
            title,
            sportId: isF1 ? 'f1' : sportId,
            sportName: isF1 ? 'Fórmula 1 & Motor' : sportName,
            leagueName,
            homeTeam: home,
            awayTeam: away,
            time: formattedTime,
            rawTime,
            status: isUpcoming ? 'upcoming' : 'live',
            servers,
          });
        });
      });
    });

    const result = {
      ok: true,
      sourceDomain,
      eventsCount: normalizedEvents.length,
      leagues: Array.from(leaguesSet),
      events: normalizedEvents,
    };

    setCached(cacheKey, result, 60 * 1000);
    return res.json(result);
  } catch (err: any) {
    console.error('Error fetching sports events:', err);
    return res.status(500).json({
      ok: false,
      error: 'No se pudieron cargar los eventos deportivos en este momento.',
      verifierUrl: 'https://streamveri.xyz/',
    });
  }
});

// Stream cipher resolver: decodes live HLS (.m3u8) directly from streamxhd
async function resolveStreamPlaybackUrl(streamKey: string, domainUrl: string): Promise<string | null> {
  try {
    const playerUrl = `${domainUrl}live1.php?stream=${encodeURIComponent(streamKey)}`;
    const html = await fetchUrl(playerUrl, {
      'Referer': domainUrl,
      'Sec-Fetch-Dest': 'iframe',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
    });

    // Check script 3 cipher decoder
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scripts && scripts[3]) {
      const code = scripts[3].replace(/<script>/i, '').replace(/<\/script>/i, '');
      const idx = code.indexOf('var adsPayload');
      const sub = code.slice(0, idx !== -1 ? idx : 5000);

      const sandbox = {
        atob: (str: string) => Buffer.from(str, 'base64').toString('binary'),
        String: String,
        parseInt: parseInt,
        playbackURL: '',
      };

      vm.runInNewContext(sub, sandbox);
      if (sandbox.playbackURL && sandbox.playbackURL.startsWith('http')) {
        return sandbox.playbackURL;
      }
    }
  } catch (e) {
    console.warn(`Failed resolving stream ${streamKey} on ${domainUrl}:`, e);
  }
  return null;
}

// API: Pristine, ad-free video player for any sport stream
app.get('/api/sports/player', async (req: Request, res: Response) => {
  const stream = (req.query.stream as string) || 'espn';
  const mode = (req.query.mode as string) === 'live2' ? 'live2' : 'live1'; // live2 = auto, live1 = manual
  const theme = (req.query.theme as string) === 'light' ? 'light' : 'dark';

  const isAutoPlay = mode === 'live2';
  const bgColor = theme === 'light' ? '#ffffff' : '#000000';
  const textColor = theme === 'light' ? '#18181b' : '#fafafa';
  const badgeBg = theme === 'light' ? '#f4f4f5' : '#18181b';
  const badgeBorder = theme === 'light' ? '#e4e4e7' : '#27272a';

  let resolvedHls: string | null = null;
  let activeDomain = OFFICIAL_DOMAINS[0].url;

  for (const dom of OFFICIAL_DOMAINS) {
    resolvedHls = await resolveStreamPlaybackUrl(stream, dom.url);
    if (resolvedHls) {
      activeDomain = dom.url;
      break;
    }
  }

  // Fallback player URL if HLS decoding is not available
  const iframeFallbackUrl = `${activeDomain}${mode === 'live2' ? 'live2.php' : 'live1.php'}?stream=${encodeURIComponent(stream)}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${stream.toUpperCase()} - Reproductor</title>
  <script src="https://cdn.jsdelivr.net/npm/@clappr/player@0.8/dist/clappr.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swarmcloud-hls@latest/dist/p2p-engine.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swarmcloud-hls@latest/dist/clappr-p2p-plugin.min.js"></script>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    #player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #player {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .sound-button {
      position: absolute;
      top: 14px;
      right: 14px;
      padding: 8px 14px;
      background: #000000;
      color: #ffffff;
      border: 1px solid #3f3f46;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      z-index: 999;
      display: ${isAutoPlay ? 'flex' : 'none'};
      align-items: center;
      gap: 6px;
    }
    .sound-button:hover {
      background: #18181b;
    }
    .watermark {
      position: absolute;
      bottom: 12px;
      left: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      background: ${badgeBg};
      border: 1px solid ${badgeBorder};
      font-size: 11px;
      font-weight: 500;
      color: ${theme === 'light' ? '#52525b' : '#a1a1aa'};
      pointer-events: none;
      z-index: 50;
      font-family: monospace;
    }
    .loader-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${bgColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .loader-text {
      font-size: 12px;
      color: ${theme === 'light' ? '#71717a' : '#a1a1aa'};
      font-family: monospace;
    }
    .fallback-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <div id="player-wrapper">
    ${
      resolvedHls
        ? `
    <div id="loader" class="loader-overlay">
      <div class="loader-text">Conectando señal deportiva...</div>
    </div>

    <div id="player"></div>

    <button class="sound-button" id="soundButton" onclick="unmutePlayer()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
      <span>Activar Audio</span>
    </button>
    `
        : `
    <iframe
      src="${iframeFallbackUrl}"
      class="fallback-iframe"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      referrerpolicy="no-referrer"
    ></iframe>
    `
    }

    <div class="watermark">
      ${stream.toUpperCase()} / ${mode === 'live2' ? 'AUTO' : 'MANUAL'}
    </div>
  </div>

  ${
    resolvedHls
      ? `
  <script>
    var playbackURL = "${resolvedHls}";
    var autoPlay = ${isAutoPlay};
    var player = null;

    function unmutePlayer() {
      if (player) {
        player.unmute();
        player.setVolume(100);
      }
      var btn = document.getElementById("soundButton");
      if (btn) btn.style.display = "none";
    }

    function initClappr() {
      var pluginsList = [];
      var canUseP2P = typeof window.SwarmCloudClapprPlugin !== 'undefined' && typeof window.P2PEngineHls !== 'undefined';
      var playbackConfig = {
        hlsjsConfig: {
          maxBufferSize: 0,
          maxBufferLength: 12,
          liveSyncDurationCount: 3
        }
      };

      if (canUseP2P) {
        pluginsList = [window.SwarmCloudClapprPlugin];
      }

      player = new Clappr.Player({
        source: playbackURL,
        parentId: "#player",
        plugins: pluginsList,
        width: "100%",
        height: "100%",
        autoPlay: autoPlay,
        mute: autoPlay,
        playsinline: true,
        mediacontrol: { seekbar: "#ffffff", buttons: "#ffffff" },
        playback: playbackConfig,
        events: {
          onReady: function() {
            var loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
          },
          onError: function() {
            setTimeout(function() { location.reload(); }, 3000);
          }
        }
      });
    }

    window.addEventListener("load", initClappr);
  </script>
  `
      : ''
  }
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
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
    console.log(`StreamXHD Sports Hub running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
