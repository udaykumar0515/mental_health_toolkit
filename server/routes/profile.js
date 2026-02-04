/**
 * Profile Routes
 * 
 * Handles user profile data and statistics.
 */

import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { getUserData } from '../auth.js';
import { getUserAssessments, getUserBreathingSessions, getUserMoodLogs, getUserJournals, findUserById } from '../database.js';

const router = express.Router();

// GET /api/profile/data
router.get('/data', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assessments = await getUserAssessments(req.user.uid);
    const breathingSessions = await getUserBreathingSessions(req.user.uid);
    const userMoodLogs = await getUserMoodLogs(req.user.uid);
    const userJournals = await getUserJournals(req.user.uid);
    const fullUser = await findUserById(req.user.uid);
    
    // Calculate stats
    const totalAssessments = assessments.length;
    const averageScore = totalAssessments > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments)
      : 0;

    const stats = {
      total_assessments: totalAssessments,
      average_score: averageScore,
      total_breathing_sessions: breathingSessions.length,
      total_mood_logs: userMoodLogs.length,
      total_journals: userJournals.length,
      current_streak: fullUser ? fullUser.current_streak || 0 : 0,
      longest_streak: fullUser ? fullUser.longest_streak || 0 : 0
    };

    res.status(200).json({
      user,
      assessments: assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      stats,
      breathingSessions: breathingSessions.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
