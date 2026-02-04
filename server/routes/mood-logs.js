/**
 * Mood Log Routes
 * 
 * Handles mood logging for the user.
 */

import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { createMoodLog, getUserMoodLogs, deleteMoodLog, getMoodLogById } from '../database.js';

const router = express.Router();

// POST /api/mood-logs - Save a new mood log
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { mood, intensity, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const moodLog = {
      id: `mood_${Date.now()}`,
      user_id: req.user.uid,
      mood,
      intensity: intensity || 5, // 1-10 scale
      note: note || '',
      created_at: new Date().toISOString()
    };

    const savedLog = await createMoodLog(moodLog);
    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error creating mood log:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/mood-logs - Get all mood logs for the authenticated user
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const logs = await getUserMoodLogs(req.user.uid);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/mood-logs/:id - Delete a mood log
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    // Verify ownership
    const log = await getMoodLogById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Mood log not found' });
    }
    if (log.user_id !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized to delete this mood log' });
    }

    await deleteMoodLog(req.params.id);
    res.status(200).json({ message: 'Mood log deleted successfully' });
  } catch (error) {
    console.error('Error deleting mood log:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
