/**
 * Assessment Routes
 * 
 * Handles mental health assessment submissions and history.
 */

import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { createAssessment, getUserAssessments, getLatestAssessment, readAssessments } from '../database.js';
import { exportAssessmentsToCSV } from '../utils/csvExport.js';

const router = express.Router();

// POST /api/assessment/submit
router.post('/submit', verifyFirebaseToken, async (req, res) => {
  try {
    const { answers, stress_level, score, recommendations } = req.body;

    if (!answers || !stress_level || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assessment = {
      id: `assessment_${Date.now()}`,
      user_id: req.user.uid,
      stress_level,
      score,
      answers,
      recommendations: recommendations || [],
      created_at: new Date().toISOString()
    };

    await createAssessment(assessment);
    
    // Export all assessments to CSV
    const allAssessments = await readAssessments();
    exportAssessmentsToCSV(allAssessments);

    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/assessment/history
router.get('/history', verifyFirebaseToken, async (req, res) => {
  try {
    const assessments = await getUserAssessments(req.user.uid);
    // Sort by date descending
    const sorted = assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json(sorted);
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/assessment/latest
router.get('/latest', verifyFirebaseToken, async (req, res) => {
  try {
    const assessment = await getLatestAssessment(req.user.uid);

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
