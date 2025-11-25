export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface BreathingSession {
  id: string;
  user_id: string;
  duration: number;
  cycles: number;
  created_at: string;
}
export type Page = 'dashboard' | 'assessment' | 'results' | 'breathing' | 'reframer' | 'chatbot' | 'profile' | 'login' | 'signup' | 'journal' | 'music' | 'mood-tracker' | 'feedback';

export type Theme = 'light' | 'dark';

export type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'irritable' | 'chill';

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface User {
  email: string;
  name: string;
  age: number;
  gender: Gender;
}

export interface Question {
  id: number;
  text: string;
}

export type StressLevel = 'Low' | 'Mild' | 'Moderate' | 'High';

export interface AssessmentResult {
  score: number;
  level: StressLevel;
  summary: string;
  recommendations: {
    title: string;
    description: string;
  }[];
}

export interface Assessment {
  id: string;
  date: string;
  score: number;
  level: StressLevel;
  responses: number[];
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  title?: string;
  mood?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: Mood;
  intensity?: number;
  note?: string;
}

export interface ProfileStats {
  total_assessments: number;
  average_score: number;
  total_breathing_sessions: number;
  total_mood_logs: number;
  total_journals: number;
  current_streak: number;
  longest_streak: number;
}

export interface ProfileResponse {
  user: UserResponse;
  assessments: any[]; // You might want to type this properly if you have the Assessment type on the server side matching the client side
  stats: ProfileStats;
  breathingSessions: BreathingSession[];
}

// Server response types (what the API actually returns)
export interface JournalEntryResponse {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at: string;
}

export interface MoodLogResponse {
  id: string;
  user_id: string;
  mood: string;
  intensity: number;
  note?: string;
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  user_id: string;
  stress_level: string;
  score: number;
  answers: Record<string, string>;
  recommendations: string[];
  created_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  current_streak?: number;
  longest_streak?: number;
  last_streak_date?: string;
}