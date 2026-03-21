import { Router } from 'express';

const router = Router();

// GET /api/emergency/er?lat=&lng=
router.get('/er', (req, res) => {
  const { lat, lng } = req.query;
  // TODO: Look up nearest ERs by lat/lng
  res.json({
    lat,
    lng,
    results: [],
    message: 'ER finder - coming soon',
  });
});

export default router;
