import { Router } from 'express';

const router = Router();

// POST /api/symptoms/session
router.post('/session', (req, res) => {
  // TODO: Create session, return session_id
  const sessionId = `session_${Date.now()}`;
  res.json({ session_id: sessionId });
});

// POST /api/symptoms/session/:id/message
router.post('/session/:id/message', (req, res) => {
  // TODO: Handle chat message, call Claude for symptom analysis
  const { id } = req.params;
  const { message } = req.body || {};
  res.json({
    session_id: id,
    response: 'Symptom checker - coming soon',
    message,
  });
});

export default router;
