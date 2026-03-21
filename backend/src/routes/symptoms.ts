import { Router } from 'express';
import {
  symptomChat,
  parseActionLevel,
  stripActionLevelTag,
} from '../services/openai';
import type { ChatMessage } from '../types/symptoms';

const router = Router();

// POST /api/symptoms/session
router.post('/session', (req, res) => {
  const sessionId = `session_${Date.now()}`;
  res.json({ session_id: sessionId });
});

// POST /api/symptoms/session/:id/message
router.post('/session/:id/message', async (req, res) => {
  const { id } = req.params;
  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Missing or invalid message',
    });
  }

  if (!Array.isArray(history)) {
    return res.status(400).json({
      error: 'history must be an array of { role, content }',
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const validHistory = history.filter((m: unknown): m is ChatMessage => {
      if (!m || typeof m !== 'object' || !('role' in m) || !('content' in m))
        return false;
      const msg = m as ChatMessage;
      return (
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
      );
    });
    const messages: ChatMessage[] = [
      ...validHistory,
      { role: 'user' as const, content: message.trim() },
    ].slice(-20) as ChatMessage[];

    const rawResponse = await symptomChat(messages);
    const actionLevel = parseActionLevel(rawResponse);
    const response = stripActionLevelTag(rawResponse);

    res.json({
      session_id: id,
      response,
      ...(actionLevel && { action_level: actionLevel }),
    });
  } catch (err) {
    console.error('Symptom checker error:', err);
    res.status(502).json({ error: 'Failed to process symptom message' });
  }
});

export default router;
