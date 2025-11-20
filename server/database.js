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

// ===== Streak Helpers =====
export const incrementUserStreak = (userId) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;

  const user = users[idx];
  const today = new Date().toISOString().slice(0,10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);

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

  users[idx] = { ...user, current_streak: current, longest_streak: longest, last_streak_date: today, updated_at: new Date().toISOString() };
  writeUsers(users);
  return users[idx];
};

export const resetUserStreak = (userId) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], current_streak: 0, last_streak_date: null, updated_at: new Date().toISOString() };
  writeUsers(users);
  return users[idx];
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

// ===== Journals =====
const JOURNALS_FILE = path.join(DATA_DIR, 'journals.json');

export const readJournals = () => {
  ensureDataDir();
  if (!fs.existsSync(JOURNALS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(JOURNALS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading journals:', error);
    return [];
  }
};

export const writeJournals = (journals) => {
  ensureDataDir();
  fs.writeFileSync(JOURNALS_FILE, JSON.stringify(journals, null, 2), 'utf-8');
};

export const createJournal = (journal) => {
  const journals = readJournals();
  journals.push(journal);
  writeJournals(journals);
  return journal;
};

export const getUserJournals = (userId) => {
  const journals = readJournals();
  return journals.filter(j => j.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const updateJournal = (journalId, updates) => {
  const journals = readJournals();
  const index = journals.findIndex(j => j.id === journalId);
  if (index !== -1) {
    journals[index] = { ...journals[index], ...updates, updated_at: new Date().toISOString() };
    writeJournals(journals);
    return journals[index];
  }
  return null;
};

export const deleteJournal = (journalId) => {
  const journals = readJournals();
  const filtered = journals.filter(j => j.id !== journalId);
  writeJournals(filtered);
  return filtered;
};

// ===== Mood Logs =====
const MOOD_LOGS_FILE = path.join(DATA_DIR, 'mood_logs.json');

export const readMoodLogs = () => {
  ensureDataDir();
  if (!fs.existsSync(MOOD_LOGS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(MOOD_LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mood logs:', error);
    return [];
  }
};

export const writeMoodLogs = (logs) => {
  ensureDataDir();
  fs.writeFileSync(MOOD_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
};

export const createMoodLog = (log) => {
  const logs = readMoodLogs();
  logs.push(log);
  writeMoodLogs(logs);
  return log;
};

export const getUserMoodLogs = (userId) => {
  const logs = readMoodLogs();
  return logs.filter(l => l.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const deleteMoodLog = (logId) => {
  const logs = readMoodLogs();
  const filtered = logs.filter(l => l.id !== logId);
  writeMoodLogs(filtered);
  return filtered;
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
  if (!fs.existsSync(JOURNALS_FILE)) {
    writeJournals([]);
  }
  if (!fs.existsSync(MOOD_LOGS_FILE)) {
    writeMoodLogs([]);
  }
  // Ensure older users have default age/gender to avoid undefined values
  ensureUserDefaults();
  console.log('✓ Data files initialized and user defaults ensured');
};

// Ensure all users have age and gender fields; migrate existing records in-place
const ensureUserDefaults = () => {
  try {
    const users = readUsers();
    let changed = false;
    const updated = users.map(u => {
      const copy = { ...u };
      if (copy.age === undefined || copy.age === null) {
        copy.age = 18;
        changed = true;
      }
      if (!copy.gender) {
        copy.gender = 'male';
        changed = true;
      }
      return copy;
    });
    if (changed) {
      writeUsers(updated);
      console.log('✓ Migrated users: set default age/gender for existing users');
    }
  } catch (err) {
    console.error('Error ensuring user defaults:', err);
  }
};
