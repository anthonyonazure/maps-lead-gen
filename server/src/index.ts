import express from 'express';
import cors from 'cors';
import { searchRouter } from './routes/search.js';
import { exportRouter } from './routes/export.js';
import { settingsRouter } from './routes/settings.js';
import { scoreRouter } from './routes/score.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/search', searchRouter);
app.use('/api/export', exportRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/score', scoreRouter);

app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
