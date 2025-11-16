const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    age?: number;
    gender?: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Assessment {
  id: string;
  user_id: string;
  stress_level: string;
  score: number;
  answers: Record<string, string>;
  recommendations: string[];
  created_at: string;
}

interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  updated_at: string;
}

interface MoodLog {
  id: string;
  user_id: string;
  mood: string;
  intensity: number;
  note: string;
  created_at: string;
}

interface BreathingSession {
  id: string;
  user_id: string;
  duration: number;
  cycles: number;
  created_at: string;
}

class ApiClient {
  private token: string | null = localStorage.getItem('auth_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // ===== Authentication =====
  async signup(email: string, password: string, fullName: string, age?: number, gender?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, full_name: fullName, age, gender }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  // ===== Questions =====
  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'GET',
      headers: this.getHeaders(),
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
  ): Promise<Assessment> {
    const response = await fetch(`${API_BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers, stress_level: stressLevel, score, recommendations }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return response.json();
  }

  async getAssessmentHistory(): Promise<Assessment[]> {
    const response = await fetch(`${API_BASE_URL}/assessment/history`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assessment history');
    }

    return response.json();
  }

  async getLatestAssessment(): Promise<Assessment | null> {
    const response = await fetch(`${API_BASE_URL}/assessment/latest`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  // ===== Journals =====
  async createJournal(title: string, content: string, mood?: string): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, content, mood }),
    });

    if (!response.ok) {
      throw new Error('Failed to create journal entry');
    }

    return response.json();
  }

  async getJournals(): Promise<JournalEntry[]> {
    const response = await fetch(`${API_BASE_URL}/journals`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journals');
    }

    return response.json();
  }

  async updateJournal(id: string, title?: string, content?: string, mood?: string): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journals/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, content, mood }),
    });

    if (!response.ok) {
      throw new Error('Failed to update journal entry');
    }

    return response.json();
  }

  async deleteJournal(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/journals/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete journal entry');
    }
  }

  // ===== Mood Logs =====
  async createMoodLog(mood: string, intensity: number, note?: string): Promise<MoodLog> {
    const response = await fetch(`${API_BASE_URL}/mood-logs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ mood, intensity, note }),
    });

    if (!response.ok) {
      throw new Error('Failed to create mood log');
    }

    return response.json();
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    const response = await fetch(`${API_BASE_URL}/mood-logs`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mood logs');
    }

    return response.json();
  }

  async deleteMoodLog(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mood-logs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete mood log');
    }
  }

  // ===== Breathing Sessions =====
  async createBreathingSession(duration: number, cycles: number): Promise<BreathingSession> {
    const response = await fetch(`${API_BASE_URL}/breathing/sessions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ duration_seconds: duration, cycles_completed: cycles }),
    });

    if (!response.ok) {
      throw new Error('Failed to save breathing session');
    }

    return response.json();
  }

  async getBreathingSessions(): Promise<BreathingSession[]> {
    const response = await fetch(`${API_BASE_URL}/breathing/sessions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch breathing sessions');
    }

    return response.json();
  }

  // ===== Profile =====
  async getProfile(): Promise<User> {
    // Get profile data (stats + sessions)
    const response = await fetch(`${API_BASE_URL}/profile/data`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  // ===== Streaks =====
  async incrementStreak(): Promise<{ current_streak: number; longest_streak: number }> {
    const response = await fetch(`${API_BASE_URL}/streaks/increment`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to increment streak');
    return response.json();
  }

  async resetStreak(): Promise<{ current_streak: number }> {
    const response = await fetch(`${API_BASE_URL}/streaks/reset`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new Error('Failed to reset streak');
    return response.json();
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
