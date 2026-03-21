import { Router } from 'express';

const router = Router();

// Specific routes first (before /:category)
// GET /api/firstaid/categories
router.get('/categories', (req, res) => {
  // TODO: Return list of first aid categories
  res.json({ categories: [] });
});

// GET /api/firstaid/bundle
router.get('/bundle', (req, res) => {
  // TODO: Return all first aid content for offline use
  res.json({ bundle: {} });
});

// GET /api/firstaid/:category
router.get('/:category', (req, res) => {
  const { category } = req.params;
  // TODO: Return content for category
  res.json({ category, content: null });
});

export default router;
