/**
 * API Client for Backend Communication
 * 
 * Uses Firebase ID tokens for authentication.
 * All authenticated requests use the token from Firebase Auth.
 */

import { AuthResponse, User, Question, Assessment, JournalEntry, MoodLog, BreathingSession, ProfileResponse, JournalEntryResponse, MoodLogResponse, AssessmentResponse, UserResponse } from '../types';
import { getIdToken, auth } from '../firebase';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private cachedToken: string | null = null;

  /**
   * Get the current Firebase ID token
   * Refreshes automatically if expired
   */
  async getFirebaseToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      this.cachedToken = null;
      return null;
    }
    
    try {
      // Get fresh token (Firebase SDK handles refresh automatically)
      const token = await user.getIdToken();
      this.cachedToken = token;
      return token;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      this.cachedToken = null;
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Clear cached token (for logout)
   */
  clearToken() {
    this.cachedToken = null;
  }

  // Legacy methods for backward compatibility during transition
  setToken(token: string) {
    if (token === '') {
      this.cachedToken = null;
      localStorage.removeItem('auth_token');
    } else {
      this.cachedToken = token;
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    // First check Firebase
    if (auth.currentUser) {
      return this.cachedToken;
    }
    // Fallback to localStorage for transition
    return localStorage.getItem('auth_token');
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Get Firebase token
    const token = await this.getFirebaseToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // ===== Authentication =====
  
  /**
   * Sync user profile with backend after Firebase authentication
   * Call this after signInWithGoogle or signInWithEmail
   */
  async syncUser(): Promise<UserResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Sync failed' }));
      throw new Error(error.message || 'Failed to sync user');
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Create a new user with email/password
   * This creates the user in Firebase Auth AND stores profile in Firestore
   */
  async signup(email: string, password: string, fullName: string, age?: number, gender?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, age, gender }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Signup failed' }));
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  }

  /**
   * Get current user profile from backend
   */
  async getUser(): Promise<UserResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  // Deprecated: Use Firebase SDK for login instead
  async login(email: string, password: string): Promise<AuthResponse> {
    console.warn('apiClient.login is deprecated. Use Firebase signInWithEmail instead.');
    throw new Error('Use Firebase SDK for login');
  }

  // ===== Questions =====
  async getQuestions(): Promise<Question[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  }

  // ===== Assessments =====
  async submitAssessment(
    answers: Record<string, string>,
    stressLevel: string,
    score: number,
    recommendations: string[]
  ): Promise<AssessmentResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers, stress_level: stressLevel, score, recommendations }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return response.json();
  }

  async getAssessmentHistory(): Promise<AssessmentResponse[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/assessment/history`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assessment history');
    }

    return response.json();
  }

  async getLatestAssessment(): Promise<AssessmentResponse | null> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/assessment/latest`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  // ===== Journals =====
  async createJournal(title: string, content: string, mood?: string): Promise<JournalEntryResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, content, mood }),
    });

    if (!response.ok) {
      throw new Error('Failed to create journal entry');
    }

    return response.json();
  }

  async getJournals(): Promise<JournalEntryResponse[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journals');
    }

    return response.json();
  }

  async updateJournal(id: string, title?: string, content?: string, mood?: string): Promise<JournalEntryResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/journals/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ title, content, mood }),
    });

    if (!response.ok) {
      throw new Error('Failed to update journal entry');
    }

    return response.json();
  }

  async deleteJournal(id: string): Promise<void> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/journals/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete journal entry');
    }
  }

  // ===== Mood Logs =====
  async createMoodLog(mood: string, intensity: number, note?: string): Promise<MoodLogResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/mood-logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mood, intensity, note }),
    });

    if (!response.ok) {
      throw new Error('Failed to create mood log');
    }

    return response.json();
  }

  async getMoodLogs(): Promise<MoodLogResponse[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/mood-logs`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mood logs');
    }

    return response.json();
  }

  async deleteMoodLog(id: string): Promise<void> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/mood-logs/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete mood log');
    }
  }

  // ===== Breathing Sessions =====
  async createBreathingSession(duration: number, cycles: number): Promise<BreathingSession> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/breathing/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ duration_seconds: duration, cycles_completed: cycles }),
    });

    if (!response.ok) {
      throw new Error('Failed to save breathing session');
    }

    return response.json();
  }

  async getBreathingSessions(): Promise<BreathingSession[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/breathing/sessions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch breathing sessions');
    }

    return response.json();
  }

  // ===== Profile =====
  async getProfile(): Promise<ProfileResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/profile/data`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  // ===== Streaks =====
  async incrementStreak(): Promise<{ current_streak: number; longest_streak: number }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/streaks/increment`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) throw new Error('Failed to increment streak');
    return response.json();
  }

  async resetStreak(): Promise<{ current_streak: number }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/streaks/reset`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) throw new Error('Failed to reset streak');
    return response.json();
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  // ===== Music =====
  async getMusicByMood(mood: string): Promise<{ mood: string; files: string[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/music/${mood}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch music for mood: ${mood}`);
    }

    return response.json();
  }

  // ===== Feedback =====
  async submitFeedback(content: string, rating: number, category: string, userDetails?: { name: string; email: string; user_id?: string }): Promise<any> {
    const body = {
      content,
      rating,
      category,
      ...userDetails
    };

    const headers = await this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return response.json();
  }

  getMusicStreamUrl(mood: string, filename: string): string {
    return `${API_BASE_URL}/music/${mood}/${filename}`;
  }
}

export const apiClient = new ApiClient();
