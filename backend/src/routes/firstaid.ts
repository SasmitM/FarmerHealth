import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const DATA_DIR = path.join(__dirname, '../data/firstaid');

// GET /api/firstaid/categories
router.get('/categories', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, 'categories.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ categories: data });
  } catch (err) {
    console.error('First aid categories error:', err);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// GET /api/firstaid/bundle
router.get('/bundle', (req, res) => {
  try {
    const categoriesPath = path.join(DATA_DIR, 'categories.json');
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8')) as {
      id: string;
      name: string;
    }[];

    const bundle: Record<string, unknown> = {};

    for (const cat of categories) {
      const filePath = path.join(DATA_DIR, `${cat.id}.json`);
      try {
        if (fs.existsSync(filePath)) {
          bundle[cat.id] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
      } catch (fileErr) {
        console.warn(`Skipping category ${cat.id}:`, fileErr);
      }
    }

    res.json({
      bundle,
      version: '1.0',
      last_updated: '2025-03-21',
    });
  } catch (err) {
    console.error('First aid bundle error:', err);
    res.status(500).json({ error: 'Failed to load bundle' });
  }
});

// GET /api/firstaid/:category
router.get('/:category', (req, res) => {
  const { category } = req.params;

  if (!category || !/^[a-z0-9-]+$/.test(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const filePath = path.join(DATA_DIR, `${category}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Category not found', category });
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ category, ...content });
  } catch (err) {
    console.error('First aid category error:', err);
    res.status(500).json({ error: 'Failed to load category' });
  }
});

export default router;
