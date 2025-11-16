// src/integrations/api/client.ts
// API client for communicating with local JSON-based backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'auth_token';

// Type definitions
interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Assessment {
  id: string;
  user_id: string;
  stress_level: string;
  score: number;
  answers: Record<string, number>;
  recommendations: string[];
  created_at: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface BreathingSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  cycles_completed: number;
  created_at: string;
}

interface ProfileData {
  user: User;
  assessments: Assessment[];
  stats: {
    total_assessments: number;
    average_score: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  }

  // ===== Authentication =====

  async signup(email: string, password: string, full_name: string): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });

    this.setToken(result.token);
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(result.token);
    return result;
  }

  async getCurrentUser(): Promise<{ id: string; email: string; full_name: string; created_at: string } | null> {
    try {
      if (!this.getToken()) {
        return null;
      }
      return await this.request('/auth/user', { method: 'GET' });
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  logout(): void {
    this.clearToken();
  }

  // ===== Assessment =====

  async submitAssessment(data: {
    answers: Record<string, number>;
    stress_level: string;
    score: number;
    recommendations: string[];
  }): Promise<Assessment> {
    return await this.request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAssessmentHistory(): Promise<Assessment[]> {
    try {
      return await this.request('/assessment/history', { method: 'GET' });
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      return [];
    }
  }

  async getLatestAssessment(): Promise<Assessment | null> {
    try {
      return await this.request('/assessment/latest', { method: 'GET' });
    } catch (error) {
      console.error('Error fetching latest assessment:', error);
      return null;
    }
  }

  // ===== Profile =====

  async getProfileData(): Promise<ProfileData | null> {
    try {
      return await this.request('/profile/data', { method: 'GET' });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
  }

  // ===== Questions =====

  async getQuestions(): Promise<Question[]> {
    try {
      return await this.request('/questions', { method: 'GET' });
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  async addQuestion(text: string, options: string[]): Promise<Question> {
    return await this.request('/questions', {
      method: 'POST',
      body: JSON.stringify({ text, options }),
    });
  }

  async deleteQuestion(id: string): Promise<void> {
    return await this.request(`/questions/${id}`, { method: 'DELETE' });
  }

  // ===== Breathing Sessions =====

  async createBreathingSession(data: {
    duration_seconds: number;
    cycles_completed: number;
  }): Promise<{ id: string; user_id: string; duration_seconds: number; cycles_completed: number; created_at: string }> {
    return await this.request('/breathing/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBreathingSessions(): Promise<BreathingSession[]> {
    try {
      return await this.request('/breathing/sessions', { method: 'GET' });
    } catch (error) {
      console.error('Error fetching breathing sessions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const signupUser = (email: string, password: string, full_name: string) =>
  apiClient.signup(email, password, full_name);

export const loginUser = (email: string, password: string) =>
  apiClient.login(email, password);

export const getCurrentUser = () =>
  apiClient.getCurrentUser();

export const logoutUser = () =>
  apiClient.logout();

export const submitAssessment = (data: {
  answers: Record<string, number>;
  stress_level: string;
  score: number;
  recommendations: string[];
}) =>
  apiClient.submitAssessment(data);

export const getAssessmentHistory = () =>
  apiClient.getAssessmentHistory();

export const getLatestAssessment = () =>
  apiClient.getLatestAssessment();

export const getProfileData = () =>
  apiClient.getProfileData();

export const getQuestions = () =>
  apiClient.getQuestions();

export const addQuestion = (text: string, options: string[]) =>
  apiClient.addQuestion(text, options);

export const deleteQuestion = (id: string) =>
  apiClient.deleteQuestion(id);

export const createBreathingSession = (data: { duration_seconds: number; cycles_completed: number }) =>
  apiClient.createBreathingSession(data);

export const getBreathingSessions = () =>
  apiClient.getBreathingSessions();
