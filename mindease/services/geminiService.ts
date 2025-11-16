import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { AssessmentResult, StressLevel } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll alert and assume a key is provided in the environment.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const assessmentResultSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "The calculated total score, from 0 to 48." },
        level: { type: Type.STRING, description: "The stress category: Low, Mild, Moderate, or High." },
        summary: { type: Type.STRING, description: "A brief, empathetic summary of the user's stress level." },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of 3-4 personalized suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["score", "level", "summary", "recommendations"]
};

export async function analyzeStressAssessment(answers: { question: string, answer: string, value: number }[]): Promise<AssessmentResult> {
  const prompt = `
    A user has completed a stress assessment. Please analyze their answers to determine their stress level.
    The scoring is as follows for questions 1, 2, 3, 6, 9, 10: Never=0, Almost Never=1, Sometimes=2, Fairly Often=3, Very Often=4.
    For questions 4, 5, 7, 8, 12, the scoring is reversed: Never=4, Almost Never=3, Sometimes=2, Fairly Often=1, Very Often=0.
    Question 11 is informational and not scored.
    
    Calculate the total score. Based on the score, determine the stress level: 0-12 is Low, 13-24 is Mild, 25-36 is Moderate, 37-48 is High.
    
    Provide an empathetic summary and personalized recommendations based on their answers and stress level.
    
    User's answers:
    ${answers.map(a => `- ${a.question}: ${a.answer} (value: ${a.value})`).join('\n')}
    
    Return the analysis in the specified JSON format.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: assessmentResultSchema,
    },
  });

  const parsedJson = JSON.parse(response.text);
  // Ensure level is one of the allowed types
  const validLevels: StressLevel[] = ['Low', 'Mild', 'Moderate', 'High'];
  if (!validLevels.includes(parsedJson.level)) {
    throw new Error(`Invalid stress level received: ${parsedJson.level}`);
  }
  return parsedJson as AssessmentResult;
}

export async function generateMotivationalQuote(): Promise<{ quote: string; author: string; }> {
  const quoteSchema = {
    type: Type.OBJECT,
    properties: {
        quote: { type: Type.STRING },
        author: { type: Type.STRING }
    },
    required: ["quote", "author"]
  };
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: "Generate one short, uplifting motivational quote about mental well-being or resilience. Provide the author's name.",
    config: {
        responseMimeType: 'application/json',
        responseSchema: quoteSchema
    }
  });
  return JSON.parse(response.text);
}

export async function reframeThought(thought: string): Promise<{ reframe: string, message: string }> {
  const reframeSchema = {
    type: Type.OBJECT,
    properties: {
        reframe: { type: Type.STRING, description: "A reframed, more balanced version of the user's thought." },
        message: { type: Type.STRING, description: "A short, encouraging message for the user." }
    },
    required: ["reframe", "message"]
  };
  const prompt = `Based on Cognitive Behavioral Therapy (CBT), reframe this negative thought into a more balanced and positive one: "${thought}". Provide a supportive alternative and an encouraging message.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: 'application/json',
        responseSchema: reframeSchema
    }
  });
  return JSON.parse(response.text);
}

export function createChatSession(): Chat {
  const systemInstruction = `You are CalmBot, a friendly and supportive AI companion. Your goal is to provide a calming and reassuring conversation. Keep your responses concise, empathetic, and gentle. If the user expresses severe distress or mentions keywords like 'hurt myself', 'suicide', 'kill myself', or 'end it', you MUST immediately respond with this exact text and nothing else: 'It sounds like you are going through a very difficult time. Please consider reaching out for professional help. You can contact the National Suicide Prevention Lifeline at 988 or visit their website. Your safety is the most important thing.'`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
}