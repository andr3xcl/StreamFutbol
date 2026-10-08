import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache for events
let cachedEvents: any[] = [];
let lastEventsFetchTime = 0;
const EVENTS_CACHE_TTL = 20 * 1000; // 20 seconds

const DEFAULT_FALLBACK_EVENTS = [
  {
    title: 'Coquimbo Unido vs Cobreloa',
    category: 'Copa Chile',
    time: '17:00',
    url: 'https://streamtp-golden1.click/global1.php?stream=tntsportschile',
    quality: '720p',
    clase: 'CHI',
    status: 'live',
  },
  {
    title: 'Antofagasta vs Universidad Chile',
    category: 'Copa Chile',
    time: '17:00',
    url: 'https://streamtp-golden1.click/global1.php?stream=max1',
    quality: '720p',
    clase: 'CHI',
    status: 'live',
  },
  {
    title: 'Internacional vs Corinthians',
    category: 'Brasileirão',
    time: '17:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=premiere2',
    quality: '720p',
    clase: 'BRA',
    status: 'live',
  },
  {
    title: 'Remo vs Grêmio',
    category: 'Brasileirão',
    time: '17:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=premiere4',
    quality: '720p',
    clase: 'BRA',
    status: 'live',
  },
  {
    title: 'RB Bragantino vs Mirassol',
    category: 'Brasileirão',
    time: '17:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=premiere5',
    quality: '720p',
    clase: 'BRA',
    status: 'live',
  },
  {
    title: 'Vitória vs Chapecoense',
    category: 'Brasileirão',
    time: '18:00',
    url: 'https://streamtp-golden1.click/global1.php?stream=premiere3',
    quality: '720p',
    clase: 'BRA',
    status: 'live',
  },
  {
    title: 'Botafogo vs Vasco da Gama',
    category: 'Brasileirão',
    time: '18:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=amazon1',
    quality: '720p',
    clase: 'BRA',
    status: 'live',
  },
  {
    title: 'Cruzeiro vs São Paulo',
    category: 'Brasileirão',
    time: '19:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=premiere1',
    quality: '720p',
    clase: 'BRA',
    status: 'next',
  },
  {
    title: 'Cruzeiro vs São Paulo',
    category: 'Brasileirão',
    time: '19:30',
    url: 'https://streamtp-golden1.click/global1.php?stream=sporttv1',
    quality: '720p',
    clase: 'BRA',
    status: 'next',
  },
];

// Helper to extract stream key from URL
function parseStreamKey(urlStr: string): string {
  try {
    if (!urlStr) return '';
    const match = urlStr.match(/stream=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
    const parsed = new URL(urlStr);
    const param = parsed.searchParams.get('stream');
    if (param) return param;
  } catch (e) {
    // ignore
  }
  return '';
}

// Helper to fetch upstream stream playback URL
async function fetchPlaybackURL(streamKey: string, type: string = 'global1'): Promise<string | null> {
  try {
    const targetUrl = `https://streamtp-golden1.click/${type}.php?stream=${encodeURIComponent(streamKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://streamtp-golden1.click/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return null;
    }

    const html = await resp.text();
    const match = html.match(/var\s+playbackURL\s*=\s*"([^"]+)";/);
    if (match && match[1]) {
      return match[1].replace(/\\\//g, '/');
    }
  } catch (err) {
    console.warn(`Error fetching playbackURL for ${streamKey}:`, err);
  }
  return null;
}

// API: Get live events
app.get('/api/events', async (req: Request, res: Response) => {
  const now = Date.now();
  if (cachedEvents.length > 0 && now - lastEventsFetchTime < EVENTS_CACHE_TTL) {
    return res.json({ ok: true, source: 'cache', events: cachedEvents });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(`https://streamtp-golden1.click/events.json?_=${now}`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://streamtp-golden1.click/eventos.html',
      },
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedEvents = data.map((ev, idx) => ({
          ...ev,
          id: `ev-${idx}-${ev.title?.replace(/\s+/g, '-').toLowerCase() || idx}`,
          streamKey: parseStreamKey(ev.url),
        }));
        lastEventsFetchTime = now;
        return res.json({ ok: true, source: 'upstream', events: cachedEvents });
      }
    }
  } catch (err) {
    console.warn('Failed to fetch upstream events, serving fallback:', err);
  }

  // Fallback
  if (cachedEvents.length === 0) {
    cachedEvents = DEFAULT_FALLBACK_EVENTS.map((ev, idx) => ({
      ...ev,
      id: `ev-fallback-${idx}`,
      streamKey: parseStreamKey(ev.url),
    }));
  }

  return res.json({ ok: true, source: 'fallback', events: cachedEvents });
});

// API: Get stream playback info
app.get('/api/stream-info', async (req: Request, res: Response) => {
  const stream = (req.query.stream as string) || 'espn';
  const type = (req.query.type as string) || 'global1';

  const playbackURL = await fetchPlaybackURL(stream, type);
  if (playbackURL) {
    return res.json({ ok: true, stream, type, playbackURL });
  }

  return res.status(404).json({
    ok: false,
    stream,
    type,
    error: 'No se pudo resolver la URL del stream en este momento',
  });
});

// Clean ad-free player route without redirections or block scripts
app.get('/api/player', async (req: Request, res: Response) => {
  const stream = (req.query.stream as string) || 'espn';
  const type = (req.query.type as string) === 'global2' ? 'global2' : 'global1';
  const theme = (req.query.theme as string) === 'light' ? 'light' : 'dark';
  const autoPlayParam = req.query.autoplay;
  const isAutoPlay = autoPlayParam === '1' || (autoPlayParam === undefined && type === 'global2');

  let playbackURL = await fetchPlaybackURL(stream, type);

  const bgColor = theme === 'light' ? '#ffffff' : '#000000';
  const textColor = theme === 'light' ? '#18181b' : '#fafafa';
  const badgeBg = theme === 'light' ? '#f4f4f5' : '#18181b';
  const badgeBorder = theme === 'light' ? '#e4e4e7' : '#27272a';

  // If initial resolution fails, provide a fallback resolver directly in the player
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    .error-box {
      display: none;
      text-align: center;
      max-width: 360px;
      padding: 20px;
      background: ${theme === 'light' ? '#ffffff' : '#18181b'};
      border-radius: 6px;
      border: 1px solid ${theme === 'light' ? '#e4e4e7' : '#27272a'};
      z-index: 200;
    }
    .btn-retry {
      margin-top: 12px;
      padding: 6px 14px;
      background: #18181b;
      color: #ffffff;
      border: 1px solid #3f3f46;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-retry:hover { background: #27272a; }
  </style>
</head>
<body>
  <div id="player-wrapper">
    <div id="loader" class="loader-overlay">
      <div class="loader-text">Cargando señal...</div>
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

    <div class="watermark">
      ${stream.toUpperCase()} / ${type === 'global2' ? 'AUTO' : 'MANUAL'}
    </div>

    <div id="error-msg" class="error-box">
      <div style="font-size: 13px; font-weight: 600;">Señal no disponible</div>
      <div style="font-size: 12px; color: ${theme === 'light' ? '#71717a' : '#a1a1aa'}; margin-top: 4px;">El canal no emite en este momento o está actualizando su enlace.</div>
      <button class="btn-retry" onclick="location.reload()">Reintentar</button>
    </div>
  </div>

  <script>
    var streamKey = "${stream}";
    var streamType = "${type}";
    var autoPlay = ${isAutoPlay ? 'true' : 'false'};
    var initialPlaybackUrl = ${playbackURL ? JSON.stringify(playbackURL) : 'null'};
    var playerInstance = null;

    function hideLoader() {
      var loader = document.getElementById('loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }

    function showError() {
      hideLoader();
      var err = document.getElementById('error-msg');
      if (err) err.style.display = 'block';
    }

    function initPlayer(sourceUrl) {
      if (!sourceUrl) {
        showError();
        return;
      }

      try {
        var p2pConfig = { trackerZone: 'us', sourceUrl: sourceUrl };
        if (window.P2PEngineHls && typeof P2PEngineHls.tryRegisterServiceWorker === 'function') {
          P2PEngineHls.tryRegisterServiceWorker(p2pConfig).catch(function(e) { console.log('SW P2P skip:', e); });
        }

        var plugins = [];
        if (window.SwarmCloudClapprPlugin) {
          plugins.push(SwarmCloudClapprPlugin);
        }

        playerInstance = new Clappr.Player({
          source: sourceUrl,
          parentId: "#player",
          plugins: plugins,
          width: '100%',
          height: '100%',
          autoPlay: autoPlay,
          mute: autoPlay,
          playsinline: true,
          mediacontrol: { seekbar: "#2563eb", buttons: "#ffffff" },
          playback: {
            hlsjsConfig: {
              maxBufferSize: 0,
              maxBufferLength: 12,
              liveSyncDurationCount: 3,
              p2pConfig: p2pConfig
            }
          },
          events: {
            onReady: function() {
              hideLoader();
            },
            onError: function(err) {
              console.warn('Clappr error:', err);
            }
          }
        });

        window.player = playerInstance;
        setTimeout(hideLoader, 2000);
      } catch (err) {
        console.error('Init player error:', err);
        showError();
      }
    }

    function unmutePlayer() {
      if (window.player) {
        try {
          window.player.setVolume(100);
          window.player.configure({ mute: false });
        } catch (e) {
          console.error(e);
        }
        var btn = document.getElementById('soundButton');
        if (btn) btn.style.display = 'none';
      }
    }

    if (initialPlaybackUrl) {
      initPlayer(initialPlaybackUrl);
    } else {
      fetch('/api/stream-info?stream=' + encodeURIComponent(streamKey) + '&type=' + encodeURIComponent(streamType))
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data && data.playbackURL) {
            initPlayer(data.playbackURL);
          } else {
            showError();
          }
        })
        .catch(function(err) {
          console.error('Fetch error:', err);
          showError();
        });
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  return res.send(html);
});

// Setup Vite in Dev or Static in Production
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
    console.log(`🚀 StreamTP Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
