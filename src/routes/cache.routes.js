import { Router } from 'express';
import { getCacheStats } from '../lib/weather.js';

export const cacheRouter = Router();

// GET /api/cache/stats: returns the data from getCacheStats().
cacheRouter.get('/cache/stats', (req, res) => {
  res.status(200).json({ data: getCacheStats() });
});
