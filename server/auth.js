/**
 * Firebase Authentication Layer
 * 
 * This module handles user authentication using Firebase Admin SDK.
 * - Creates users in Firebase Auth
 * - Stores user profiles in Firestore
 * - Provides user data retrieval
 */

import { auth } from './firebase.js';
import { 
  findUserByEmail, 
  findUserById, 
  createUser as dbCreateUser,
  updateUser as dbUpdateUser 
} from './database.js';

/**
 * Register a new user with email and password
 * Creates user in Firebase Auth and stores profile in Firestore
 */
export const registerUser = async (email, password, full_name, age, gender) => {
  // Check if user already exists in Firestore
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: full_name,
      emailVerified: false
    });

    // Create user profile in Firestore
    const userProfile = {
      id: userRecord.uid,
      email,
      full_name,
      age: age || 0,
      gender: gender || 'prefer-not-to-say',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_streak: 0,
      longest_streak: 0,
      last_streak_date: null
    };

    await dbCreateUser(userProfile);

    return {
      message: 'User created successfully. Please verify your email.',
      user: {
        id: userRecord.uid,
        email: userProfile.email,
        full_name: userProfile.full_name,
        age: userProfile.age,
        gender: userProfile.gender,
        created_at: userProfile.created_at
      }
    };
  } catch (error) {
    // Handle Firebase Auth specific errors
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Email is already registered');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak');
    }
    throw error;
  }
};

/**
 * Create or update user profile after Firebase login (Google or Email)
 * Called when user signs in via frontend Firebase SDK
 */
export const syncUser = async (firebaseUser) => {
  const { uid, email, name, picture } = firebaseUser;

  // Check if user exists in Firestore
  let user = await findUserById(uid);

  if (user) {
    // Update existing user
    const updates = {
      email,
      full_name: name || user.full_name,
      avatar_url: picture || user.avatar_url,
    };
    user = await dbUpdateUser(uid, updates);
  } else {
    // Create new user profile
    user = {
      id: uid,
      email,
      full_name: name || email?.split('@')[0] || 'User',
      avatar_url: picture || null,
      age: 0,
      gender: 'prefer-not-to-say',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_streak: 0,
      longest_streak: 0,
      last_streak_date: null
    };
    await dbCreateUser(user);
  }

  return user;
};

/**
 * Get user data by ID from Firestore
 */
export const getUserData = async (userId) => {
  const user = await findUserById(userId);
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    age: user.age || 0,
    gender: user.gender || 'prefer-not-to-say',
    current_streak: user.current_streak || 0,
    longest_streak: user.longest_streak || 0,
    created_at: user.created_at
  };
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  const allowedFields = ['full_name', 'age', 'gender', 'avatar_url'];
  const filteredUpdates = {};
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  const user = await dbUpdateUser(userId, filteredUpdates);
  return user;
};
