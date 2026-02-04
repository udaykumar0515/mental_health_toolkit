/**
 * Firestore Database Layer
 * 
 * This module provides CRUD operations for all entities using Firebase Firestore.
 * Replaces the previous JSON file-based storage.
 */

import { db } from './firebase.js';

// ===== Collection References =====
const usersCollection = db.collection('users');
const assessmentsCollection = db.collection('assessments');
const breathingSessionsCollection = db.collection('breathing_sessions');
const journalsCollection = db.collection('journals');
const moodLogsCollection = db.collection('mood_logs');
const feedbackCollection = db.collection('feedback');

// ===== Users =====

export const findUserByEmail = async (email) => {
  const snapshot = await usersCollection.where('email', '==', email).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const findUserById = async (id) => {
  const doc = await usersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const createUser = async (user) => {
  await usersCollection.doc(user.id).set(user);
  return user;
};

export const updateUser = async (id, updates) => {
  const userRef = usersCollection.doc(id);
  const doc = await userRef.get();
  if (!doc.exists) return null;
  
  const updatedData = { ...updates, updated_at: new Date().toISOString() };
  await userRef.update(updatedData);
  
  const updatedDoc = await userRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// ===== Streak Helpers =====

export const incrementUserStreak = async (userId) => {
  const userRef = usersCollection.doc(userId);
  const doc = await userRef.get();
  if (!doc.exists) return null;

  const user = doc.data();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let current = user.current_streak || 0;
  let longest = user.longest_streak || 0;

  if (user.last_streak_date === yesterday) {
    current = current + 1;
  } else if (user.last_streak_date === today) {
    // already incremented today
  } else {
    current = 1;
  }

  if (current > longest) longest = current;

  const updatedData = {
    current_streak: current,
    longest_streak: longest,
    last_streak_date: today,
    updated_at: new Date().toISOString()
  };

  await userRef.update(updatedData);
  return { id: userId, ...user, ...updatedData };
};

export const resetUserStreak = async (userId) => {
  const userRef = usersCollection.doc(userId);
  const doc = await userRef.get();
  if (!doc.exists) return null;

  const updatedData = {
    current_streak: 0,
    last_streak_date: null,
    updated_at: new Date().toISOString()
  };

  await userRef.update(updatedData);
  const updatedDoc = await userRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

// ===== Assessments =====

export const createAssessment = async (assessment) => {
  const docRef = await assessmentsCollection.add(assessment);
  return { id: docRef.id, ...assessment };
};

export const getUserAssessments = async (userId) => {
  const snapshot = await assessmentsCollection.where('user_id', '==', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getLatestAssessment = async (userId) => {
  try {
    const snapshot = await assessmentsCollection
      .where('user_id', '==', userId)
      .get();
    
    if (snapshot.empty) return null;
    
    // Sort in memory to avoid needing composite index
    const assessments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return assessments[0];
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    return null;
  }
};

export const readAssessments = async () => {
  const snapshot = await assessmentsCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===== Breathing Sessions =====

export const createBreathingSession = async (session) => {
  const docRef = await breathingSessionsCollection.add(session);
  return { id: docRef.id, ...session };
};

export const getUserBreathingSessions = async (userId) => {
  const snapshot = await breathingSessionsCollection.where('user_id', '==', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===== Journals =====

export const createJournal = async (journal) => {
  const docRef = await journalsCollection.add(journal);
  return { id: docRef.id, ...journal };
};

export const getUserJournals = async (userId) => {
  try {
    const snapshot = await journalsCollection
      .where('user_id', '==', userId)
      .get();
    
    // Sort in memory to avoid needing composite index
    const journals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    journals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return journals;
  } catch (error) {
    console.error('Error fetching journals:', error);
    return [];
  }
};

export const updateJournal = async (journalId, updates) => {
  const journalRef = journalsCollection.doc(journalId);
  const doc = await journalRef.get();
  if (!doc.exists) return null;

  const updatedData = { ...updates, updated_at: new Date().toISOString() };
  await journalRef.update(updatedData);
  
  const updatedDoc = await journalRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteJournal = async (journalId) => {
  await journalsCollection.doc(journalId).delete();
  return true;
};

export const getJournalById = async (journalId) => {
  const doc = await journalsCollection.doc(journalId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// ===== Mood Logs =====

export const createMoodLog = async (log) => {
  const docRef = await moodLogsCollection.add(log);
  return { id: docRef.id, ...log };
};

export const getUserMoodLogs = async (userId) => {
  try {
    const snapshot = await moodLogsCollection
      .where('user_id', '==', userId)
      .get();
    
    // Sort in memory to avoid needing composite index
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return logs;
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    return [];
  }
};

export const deleteMoodLog = async (logId) => {
  await moodLogsCollection.doc(logId).delete();
  return true;
};

export const getMoodLogById = async (logId) => {
  const doc = await moodLogsCollection.doc(logId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// ===== Feedback =====

export const createFeedback = async (feedback) => {
  const docRef = await feedbackCollection.add(feedback);
  return { id: docRef.id, ...feedback };
};

export const readFeedback = async () => {
  const snapshot = await feedbackCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===== Initialization =====
// No file initialization needed for Firestore
export const initializeFiles = () => {
  console.log('✓ Connected to Firestore database');
};
