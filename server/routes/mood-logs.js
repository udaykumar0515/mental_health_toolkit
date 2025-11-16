import express from 'express';
import { authenticateToken } from './auth.js';
import { createMoodLog, getUserMoodLogs, deleteMoodLog } from '../database.js';

const router = express.Router();

// POST /api/mood-logs - Save a new mood log
router.post('/', authenticateToken, (req, res) => {
  try {
    const { mood, intensity, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const moodLog = {
      id: `mood_${Date.now()}`,
      user_id: req.userId,
      mood,
      intensity: intensity || 5, // 1-10 scale
      note: note || '',
      created_at: new Date().toISOString()
    };

    createMoodLog(moodLog);
    res.status(201).json(moodLog);
  } catch (error) {
    console.error('Error creating mood log:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/mood-logs - Get all mood logs for the authenticated user
router.get('/', authenticateToken, (req, res) => {
  try {
    const logs = getUserMoodLogs(req.userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/mood-logs/:id - Delete a mood log
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    deleteMoodLog(req.params.id);
    res.status(200).json({ message: 'Mood log deleted successfully' });
  } catch (error) {
    console.error('Error deleting mood log:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
