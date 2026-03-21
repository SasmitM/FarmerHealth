import { Router } from 'express';

const router = Router();

// POST /api/profile/risk-summary
router.post('/risk-summary', (req, res) => {
  // TODO: Accept farm type, call Claude for risk summary
  res.json({ message: 'Profile risk summary - coming soon' });
});

export default router;
