import express from 'express';
import cors from 'cors';
import path from 'path';
import { searchRouter } from './routes/search.js';
import { exportRouter } from './routes/export.js';
import { settingsRouter } from './routes/settings.js';
import { scoreRouter } from './routes/score.js';
import { enrichRouter } from './routes/enrich.js';
import { errorMessage } from './services/unknown.js';

export function startServer(staticDir?: string): Promise<{ server: ReturnType<typeof app.listen>; port: number }> {
  const app = express();
  const configuredPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const preferredPort = configuredPort ?? (staticDir ? 0 : 3001);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Serve static React build if path provided (Electron / production)
  if (staticDir) {
    app.use(express.static(staticDir));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/search', searchRouter);
  app.use('/api/export', exportRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/score', scoreRouter);
  app.use('/api/enrich', enrichRouter);

  // Client-side routing fallback (after API routes)
  if (staticDir) {
    // Express 5 rejects the legacy "*" route syntax, so use a final catch-all
    // middleware for client-side routing after all API and static handlers.
    app.use((_req, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(preferredPort, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : preferredPort;
      console.log(`Server running on http://127.0.0.1:${port}`);
      resolve({ server, port });
    });

    server.on('error', reject);
  });
}

// Auto-start when run directly (not imported by Electron)
const isDirectRun = !process.argv[1]?.includes('electron') && !process.env.ELECTRON_RUN_AS_NODE;
if (isDirectRun) {
  // Top-level bootstrap: nothing can await this, so failures have to be logged
  // here or they surface as an unhandled rejection and a silent dead server.
  startServer().catch((err: unknown) => {
    console.error('Failed to start server:', errorMessage(err));
    process.exitCode = 1;
  });
}
