import express from 'express';
import { authenticateToken } from './auth.js';
import { getUserData } from '../auth.js';
import { getUserAssessments, getUserBreathingSessions, readMoodLogs, readJournals, findUserById } from '../database.js';

const router = express.Router();

// GET /api/profile/data
router.get('/data', authenticateToken, (req, res) => {
  try {
    const user = getUserData(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assessments = getUserAssessments(req.userId);
    const breathingSessions = getUserBreathingSessions(req.userId);
    const allMoodLogs = readMoodLogs();
    const userMoodLogs = allMoodLogs.filter(l => l.user_id === req.userId);
    const allJournals = readJournals();
    const userJournals = allJournals.filter(j => j.user_id === req.userId);
    const fullUser = findUserById(req.userId);
    
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
