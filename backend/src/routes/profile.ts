import { Router } from 'express';
import { getRiskSummary } from '../services/openai';
import type { FarmType } from '../types/profile';

const router = Router();

const VALID_FARM_TYPES: FarmType[] = [
  'crop',
  'livestock',
  'mixed',
  'poultry',
  'dairy',
  'aquaculture',
  'greenhouse',
  'orchard',
];

// POST /api/profile/risk-summary
router.post('/risk-summary', async (req, res) => {
  const { farm_type } = req.body || {};

  if (!farm_type || !VALID_FARM_TYPES.includes(farm_type)) {
    return res.status(400).json({
      error: 'Invalid or missing farm_type',
      valid_types: VALID_FARM_TYPES,
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const summary = await getRiskSummary(farm_type);
    res.json({ summary, farm_type });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(502).json({ error: 'Failed to generate risk summary' });
  }
});

export default router;
