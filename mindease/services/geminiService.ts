/**
 * AI Service - Connects to Backend AI Endpoints
 * 
 * This service calls the backend API instead of Gemini directly.
 * Benefits:
 * - API key is secured on the server
 * - Rate limiting is enforced server-side
 * - Quotes are fetched from pre-generated list (no API cost)
 */

import { AssessmentResult, StressLevel } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch a random motivational quote from pre-generated list.
 * No API cost - fetches from server's local JSON file.
 */
export async function generateMotivationalQuote(): Promise<{ quote: string; author: string }> {
  const response = await fetch(`${API_BASE_URL}/quotes/random`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  
  return response.json();
}

/**
 * Analyze stress assessment answers using AI.
 */
export async function analyzeStressAssessment(
  answers: { question: string; answer: string; value: number }[]
): Promise<AssessmentResult> {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to analyze assessment');
  }

  const result = await response.json();
  
  // Validate stress level
  const validLevels: StressLevel[] = ['Low', 'Mild', 'Moderate', 'High'];
  if (!validLevels.includes(result.level)) {
    result.level = 'Unknown';
  }
  
  return result as AssessmentResult;
}

/**
 * Reframe a negative thought using CBT principles.
 */
export async function reframeThought(thought: string): Promise<{ reframe: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/ai/reframe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thought }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to reframe thought');
  }

  return response.json();
}

/**
 * Chat session interface for CalmBot.
 * Mimics the original Chat interface but uses backend API.
 */
interface ChatSession {
  sendMessage: (message: string) => Promise<{ text: string }>;
}

/**
 * Create a chat session for CalmBot.
 * Returns an object that mimics the Gemini Chat interface.
 */
export function createChatSession(): ChatSession {
  // Store conversation history for context (optional, backend could also maintain this)
  const history: { role: string; content: string }[] = [];

  return {
    sendMessage: async (message: string): Promise<{ text: string }> => {
      history.push({ role: 'user', content: message });

      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();
      history.push({ role: 'assistant', content: data.response });

      return { text: data.response };
    },
  };
}