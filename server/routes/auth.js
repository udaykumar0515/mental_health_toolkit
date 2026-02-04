/**
 * Authentication Routes
 * 
 * Uses Firebase Auth for user management.
 * - POST /signup - Create new user in Firebase Auth + Firestore
 * - POST /sync - Sync user profile after Firebase login (Google or Email)
 * - GET /user - Get current user profile
 */

import express from 'express';
import { registerUser, syncUser, getUserData, updateUserProfile } from '../auth.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/signup - Create new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, age, gender } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await registerUser(email, password, full_name, age, gender);
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST /api/auth/sync - Sync user profile after Firebase login
// Called after Google sign-in or email/password login from frontend
router.post('/sync', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await syncUser(req.user);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/user - Get current user profile
router.get('/user', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/user - Update user profile
router.put('/user', verifyFirebaseToken, async (req, res) => {
  try {
    const { full_name, age, gender, avatar_url } = req.body;
    
    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const user = await updateUserProfile(req.user.uid, updates);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
