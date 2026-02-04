/**
 * Journal Routes
 * 
 * Handles journal entries for the user.
 */

import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { createJournal, getUserJournals, updateJournal, deleteJournal, getJournalById } from '../database.js';

const router = express.Router();

// POST /api/journals - Save a new journal entry
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const journal = {
      id: `journal_${Date.now()}`,
      user_id: req.user.uid,
      title: title || 'Untitled',
      content,
      mood: mood || 'neutral',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const savedJournal = await createJournal(journal);
    res.status(201).json(savedJournal);
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/journals - Get all journals for the authenticated user
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const journals = await getUserJournals(req.user.uid);
    res.status(200).json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/journals/:id - Update a journal entry
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    // Verify ownership
    const journal = await getJournalById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    if (journal.user_id !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized to update this journal' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (mood !== undefined) updates.mood = mood;

    const updated = await updateJournal(req.params.id, updates);

    if (!updated) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/journals/:id - Delete a journal entry
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    // Verify ownership
    const journal = await getJournalById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    if (journal.user_id !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized to delete this journal' });
    }

    await deleteJournal(req.params.id);
    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
