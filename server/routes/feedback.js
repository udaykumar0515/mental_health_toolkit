/**
 * Feedback Routes
 * 
 * Handles user feedback submission.
 */

import express from 'express';
import { createFeedback } from '../database.js';

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
    try {
        const { user_id, email, name, content, rating, category } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Feedback content is required' });
        }

        const newFeedback = {
            id: `feedback_${Date.now()}`,
            user_id: user_id || 'anonymous',
            email: email || 'anonymous',
            name: name || 'Anonymous',
            content,
            rating: rating || 0,
            category: category || 'general',
            created_at: new Date().toISOString()
        };

        const savedFeedback = await createFeedback(newFeedback);
        res.status(201).json(savedFeedback);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
