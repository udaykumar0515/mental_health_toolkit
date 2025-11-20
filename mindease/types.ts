export interface AuthResponse {
  token: string;
  user: User;
}

export interface BreathingSession {
  id: string;
  user_id: string;
  duration: number;
  cycles: number;
  created_at: string;
}
export type Page = 'dashboard' | 'assessment' | 'results' | 'breathing' | 'reframer' | 'chatbot' | 'profile' | 'login' | 'signup' | 'journal' | 'music' | 'mood-tracker';

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
    id: number;
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
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export interface MoodLog {
    id: number;
    date: string;
    mood: Mood;
    intensity?: number;
    note?: string;
}