import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// ===== Users =====
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export const readUsers = () => {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

export const writeUsers = (users) => {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

export const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email === email);
};

export const findUserById = (id) => {
  const users = readUsers();
  return users.find(u => u.id === id);
};

export const createUser = (user) => {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
};

export const updateUser = (id, updates) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
    writeUsers(users);
    return users[index];
  }
  return null;
};

// ===== Assessments =====
const ASSESSMENTS_FILE = path.join(DATA_DIR, 'assessments.json');

export const readAssessments = () => {
  ensureDataDir();
  if (!fs.existsSync(ASSESSMENTS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(ASSESSMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading assessments:', error);
    return [];
  }
};

export const writeAssessments = (assessments) => {
  ensureDataDir();
  fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(assessments, null, 2), 'utf-8');
};

export const createAssessment = (assessment) => {
  const assessments = readAssessments();
  assessments.push(assessment);
  writeAssessments(assessments);
  return assessment;
};

export const getUserAssessments = (userId) => {
  const assessments = readAssessments();
  return assessments.filter(a => a.user_id === userId);
};

export const getLatestAssessment = (userId) => {
  const assessments = getUserAssessments(userId);
  if (assessments.length === 0) return null;
  return assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
};

// ===== Breathing Sessions =====
const BREATHING_FILE = path.join(DATA_DIR, 'breathing_sessions.json');

export const readBreathingSessions = () => {
  ensureDataDir();
  if (!fs.existsSync(BREATHING_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(BREATHING_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading breathing sessions:', error);
    return [];
  }
};

export const writeBreathingSessions = (sessions) => {
  ensureDataDir();
  fs.writeFileSync(BREATHING_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
};

export const createBreathingSession = (session) => {
  const sessions = readBreathingSessions();
  sessions.push(session);
  writeBreathingSessions(sessions);
  return session;
};

export const getUserBreathingSessions = (userId) => {
  const sessions = readBreathingSessions();
  return sessions.filter(s => s.user_id === userId);
};

// Initialize files on startup
export const initializeFiles = () => {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    writeUsers([]);
  }
  if (!fs.existsSync(ASSESSMENTS_FILE)) {
    writeAssessments([]);
  }
  if (!fs.existsSync(BREATHING_FILE)) {
    writeBreathingSessions([]);
  }
  console.log('✓ Data files initialized');
};
