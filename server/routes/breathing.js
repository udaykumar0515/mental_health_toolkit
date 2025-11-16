import express from 'express';
import { authenticateToken } from './auth.js';
import { createBreathingSession, getUserBreathingSessions } from '../database.js';

const router = express.Router();

// POST /api/breathing/sessions
router.post('/sessions', authenticateToken, (req, res) => {
  try {
    const { duration_seconds, cycles_completed } = req.body;

    if (duration_seconds === undefined || cycles_completed === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = {
      id: `breathing_${Date.now()}`,
      user_id: req.userId,
      duration_seconds,
      cycles_completed,
      created_at: new Date().toISOString()
    };

    createBreathingSession(session);

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating breathing session:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/breathing/sessions
router.get('/sessions', authenticateToken, (req, res) => {
  try {
    const sessions = getUserBreathingSessions(req.userId);
    const sorted = sessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json(sorted);
  } catch (error) {
    console.error('Error fetching breathing sessions:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
