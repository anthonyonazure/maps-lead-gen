import express from 'express';
import cors from 'cors';
import path from 'path';
import { searchRouter } from './routes/search.js';
import { exportRouter } from './routes/export.js';
import { settingsRouter } from './routes/settings.js';
import { scoreRouter } from './routes/score.js';
import { enrichRouter } from './routes/enrich.js';

export function startServer(staticDir?: string): Promise<{ server: ReturnType<typeof app.listen>; port: number }> {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  return new Promise((resolve) => {
    const server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
      resolve({ server, port: PORT });
    });
  });
}

// Auto-start when run directly (not imported by Electron)
const isDirectRun = !process.argv[1]?.includes('electron') && !process.env.ELECTRON_RUN_AS_NODE;
if (isDirectRun) {
  startServer();
}
