import express from 'express';
import { authenticateToken } from './auth.js';
import { createAssessment, getUserAssessments, getLatestAssessment, readAssessments } from '../database.js';
import { exportAssessmentsToCSV } from '../utils/csvExport.js';

const router = express.Router();

// POST /api/assessment/submit
router.post('/submit', authenticateToken, (req, res) => {
  try {
    const { answers, stress_level, score, recommendations } = req.body;

    if (!answers || !stress_level || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assessment = {
      id: `assessment_${Date.now()}`,
      user_id: req.userId,
      stress_level,
      score,
      answers,
      recommendations: recommendations || [],
      created_at: new Date().toISOString()
    };

    createAssessment(assessment);
    
    // Export all assessments to CSV
    const allAssessments = readAssessments();
    exportAssessmentsToCSV(allAssessments);

    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/assessment/history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const assessments = getUserAssessments(req.userId);
    // Sort by date descending
    const sorted = assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json(sorted);
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/assessment/latest
router.get('/latest', authenticateToken, (req, res) => {
  try {
    const assessment = getLatestAssessment(req.userId);

    if (!assessment) {
      return res.status(404).json({ message: 'No assessments found' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
