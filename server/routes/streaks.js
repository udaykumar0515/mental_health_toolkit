import express from 'express';
import { authenticateToken } from './auth.js';
import { incrementUserStreak, resetUserStreak } from '../database.js';

const router = express.Router();

// POST /api/streaks/increment
router.post('/increment', authenticateToken, (req, res) => {
  try {
    const updated = incrementUserStreak(req.userId);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ current_streak: updated.current_streak, longest_streak: updated.longest_streak });
  } catch (error) {
    console.error('Error incrementing streak:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/streaks/reset
router.post('/reset', authenticateToken, (req, res) => {
  try {
    const updated = resetUserStreak(req.userId);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ current_streak: updated.current_streak });
  } catch (error) {
    console.error('Error resetting streak:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
