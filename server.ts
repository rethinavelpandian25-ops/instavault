import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { extractInstagramMedia, parseInstagramUrl, extractInstagramProfile, extractInstagramBatch } from './src/server/instagram.js';
import { serverCache } from './src/server/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prevent any unexpected process crashes from unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

async function startServer() {
  const app = express();
  // Listen on process.env.PORT (Render, Cloud Run, Koyeb) or default 3000 for AI Studio
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Performance Logging & Latency tracker
  app.use((req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
      const duration = performance.now() - start;
      if (req.path.startsWith('/api')) {
        serverCache.recordLatency(Math.round(duration));
      }
    });
    next();
  });

  // API: Health / Ping
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'InstaVault Core Downloader',
      timestamp: new Date().toISOString(),
    });
  });

  // API: Cache statistics
  app.get('/api/cache/stats', (_req: Request, res: Response) => {
    res.json(serverCache.getStats());
  });

  // API: Parse & Extract Media
  app.post('/api/extract', async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Please provide a valid Instagram URL.' });
      return;
    }

    const trimmedUrl = url.trim();
    const startTime = Date.now();

    // 1. Check high-performance memory cache
    const cachedData = serverCache.get(trimmedUrl);
    if (cachedData) {
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.json({
        ...cachedData,
        cached: true,
        fetchLatencyMs: Date.now() - startTime,
      });
      return;
    }

    // 2. Cache miss -> Extract media
    try {
      const mediaData = await extractInstagramMedia(trimmedUrl);
      const latency = Date.now() - startTime;
      mediaData.fetchLatencyMs = latency;

      // Save to cache (2 hours TTL)
      serverCache.set(trimmedUrl, mediaData);

      res.setHeader('X-Cache-Status', 'MISS');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.json(mediaData);
    } catch (err: any) {
      console.error('Extraction error:', err);
      res.status(422).json({
        error: err.message || 'Unable to retrieve media from this link. Make sure the Instagram account or post is public.',
      });
    }
  });

  // API: Batch Extraction (Process multiple URLs concurrently)
  app.post('/api/batch-extract', async (req: Request, res: Response): Promise<void> => {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ error: 'Please provide an array of Instagram URLs (maximum 10).' });
      return;
    }

    try {
      const results = await extractInstagramBatch(urls.slice(0, 10));
      res.json({ results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Batch extraction encountered an error.' });
    }
  });

  // API: Profile Picture & Bio Downloader
  app.post('/api/profile', async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Please provide a valid Instagram username or handle.' });
      return;
    }

    const cacheKey = `profile:${username.toLowerCase().trim()}`;
    const cachedProfile = serverCache.get(cacheKey);
    if (cachedProfile) {
      res.setHeader('X-Cache-Status', 'HIT');
      res.json({ ...cachedProfile, cached: true });
      return;
    }

    try {
      const profileData = await extractInstagramProfile(username);
      serverCache.set(cacheKey, profileData);
      res.setHeader('X-Cache-Status', 'MISS');
      res.json(profileData);
    } catch (err: any) {
      res.status(422).json({ error: err.message || 'Unable to load profile data.' });
    }
  });

  // API: Direct Streaming Download Proxy
  // Bypasses Instagram CDN CORS/Hotlink restrictions and forces real download with Content-Disposition
  app.get('/api/download', async (req: Request, res: Response): Promise<void> => {
    const targetUrl = req.query.url as string;
    const requestedFilename = (req.query.filename as string) || 'instavault_download.mp4';
    const cleanFilename = requestedFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!targetUrl) {
      res.status(400).send('Missing url parameter');
      return;
    }

    // Check if target is a local project asset
    if (targetUrl.startsWith('/src/assets/images/') || targetUrl.startsWith('/assets/')) {
      const relativePath = targetUrl.startsWith('/') ? targetUrl.slice(1) : targetUrl;
      const localFilePath = path.join(__dirname, relativePath);

      if (fs.existsSync(localFilePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
        res.setHeader('Content-Type', getContentType(cleanFilename));
        fs.createReadStream(localFilePath).pipe(res);
        return;
      }
    }

    try {
      const fetchHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
      };

      if (targetUrl.includes('instagram.com') || targetUrl.includes('cdninstagram.com') || targetUrl.includes('fbcdn.net')) {
        fetchHeaders['Referer'] = 'https://www.instagram.com/';
      }

      if (req.headers.range) {
        fetchHeaders['Range'] = req.headers.range;
      }

      const upstreamRes = await fetch(targetUrl, { headers: fetchHeaders, redirect: 'follow' });

      if (!upstreamRes.ok && upstreamRes.status !== 206) {
        res.status(upstreamRes.status).send(`Upstream download failed (${upstreamRes.status})`);
        return;
      }

      const contentType = upstreamRes.headers.get('content-type') || getContentType(cleanFilename);
      const contentLength = upstreamRes.headers.get('content-length');
      const contentRange = upstreamRes.headers.get('content-range');

      res.status(upstreamRes.status);
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');

      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
        serverCache.recordBytesProxied(parseInt(contentLength, 10));
      }
      if (contentRange) {
        res.setHeader('Content-Range', contentRange);
      }
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (!upstreamRes.body) {
        res.status(500).send('Empty body from upstream');
        return;
      }

      const reader = upstreamRes.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              break;
            }
            res.write(value);
          }
        } catch (streamErr) {
          console.error('Stream pipe error:', streamErr);
          res.end();
        }
      };
      await pump();
    } catch (err: any) {
      console.error('Proxy download error:', err);
      res.status(500).send(`Download failed: ${err.message}`);
    }
  });

  // Helper for MIME types
  function getContentType(filename: string): string {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.mp4')) return 'video/mp4';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.mp3')) return 'audio/mpeg';
    if (lower.endsWith('.m4a')) return 'audio/mp4';
    if (lower.endsWith('.ogg')) return 'audio/ogg';
    if (lower.endsWith('.zip')) return 'application/zip';
    return 'application/octet-stream';
  }

  // Vite Integration: Dev vs Prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // Prevents rogue WebSocket ports from causing connection issues
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in dev
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Express Error Handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Unhandled server error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', message: err?.message });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 InstaVault Server running at http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
