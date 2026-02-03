import express from 'express';

const router = express.Router();

// --- Configuration ---
// Note: These are read at runtime, not at module load time
const MODEL_NAME = 'models/gemini-flash-latest';

// --- Rate Limiting ---
// Simple in-memory rate limiter to prevent quota exhaustion
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 10; // Max 10 requests per minute per IP
const requestCounts = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return next();
  }
  
  const record = requestCounts.get(ip);
  
  // Reset window if expired
  if (now - record.windowStart > rateLimitWindowMs) {
    record.count = 1;
    record.windowStart = now;
    return next();
  }
  
  // Check if over limit
  if (record.count >= maxRequestsPerWindow) {
    return res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Max ${maxRequestsPerWindow} requests per minute.`,
      retryAfterMs: rateLimitWindowMs - (now - record.windowStart)
    });
  }
  
  record.count++;
  next();
}

// Apply rate limiting to all AI routes
router.use(rateLimiter);

// --- Helper Function ---
async function callGemini(prompt) {
  // Read API key at runtime (after dotenv has loaded)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('Invalid response structure from Gemini');
  }
}

// --- CalmBot System Instruction ---
const CALMBOT_SYSTEM = `You are CalmBot, a friendly and supportive AI companion. Your goal is to provide a calming and reassuring conversation. Keep your responses concise, empathetic, and gentle. If the user expresses severe distress or mentions keywords like 'hurt myself', 'suicide', 'kill myself', or 'end it', you MUST immediately respond with this exact text and nothing else: 'It sounds like you are going through a very difficult time. Please consider reaching out for professional help. You can contact the National Suicide Prevention Lifeline at 988 or visit their website. Your safety is the most important thing.'`;

/**
 * POST /api/ai/chat
 * CalmBot chat endpoint
 * Body: { message: string }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `${CALMBOT_SYSTEM}\n\nUser: ${message}\nCalmBot:`;
    const response = await callGemini(prompt);
    
    res.json({ response: response.trim() });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

/**
 * POST /api/ai/reframe
 * Thought reframing endpoint (CBT-based)
 * Body: { thought: string }
 */
router.post('/reframe', async (req, res) => {
  try {
    const { thought } = req.body;
    
    if (!thought || typeof thought !== 'string') {
      return res.status(400).json({ error: 'Thought is required' });
    }

    const prompt = `Based on Cognitive Behavioral Therapy (CBT), reframe this negative thought into a more balanced and positive one: "${thought}". Provide a supportive alternative and an encouraging message. Return as JSON: {"reframe": "string", "message": "string"}`;
    
    const response = await callGemini(prompt);
    
    // Try to parse JSON from response
    let result;
    try {
      // Clean up response
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      result = JSON.parse(cleaned.trim());
    } catch (parseError) {
      // Fallback if JSON parsing fails
      result = { reframe: response, message: "Remember, your thoughts don't define you." };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Reframe error:', error.message);
    res.status(500).json({ error: 'Failed to reframe thought', details: error.message });
  }
});

/**
 * POST /api/ai/analyze-assessment
 * Stress assessment analysis endpoint
 * Body: { answers: [{question: string, answer: string, value: number}] }
 */
router.post('/analyze-assessment', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    const answersText = answers.map(a => `- ${a.question}: ${a.answer} (value: ${a.value})`).join('\n');
    
    const prompt = `You are a stress assessment analyzer. Analyze the user's answers and return ONLY a valid JSON object, no other text.

SCORING RULES:
- Questions 1, 2, 3, 6, 9, 10: Never=0, Almost Never=1, Sometimes=2, Fairly Often=3, Very Often=4
- Questions 4, 5, 7, 8, 12: Never=4, Almost Never=3, Sometimes=2, Fairly Often=1, Very Often=0
- Question 11 is informational (not scored)

STRESS LEVELS:
- 0-12: Low
- 13-24: Mild  
- 25-36: Moderate
- 37-48: High

User's answers:
${answersText}

INSTRUCTIONS:
1. Calculate the total score
2. Determine stress level
3. Write a brief 2-3 sentence empathetic summary
4. Provide 3-4 recommendations, each with:
   - title: Short title (3-5 words)
   - description: Brief one-liner summary (10-15 words max)
   - details: Detailed explanation with actionable steps (2-4 sentences)

RESPOND WITH ONLY THIS JSON FORMAT (no markdown, no explanation):
{"score": <number>, "level": "<Low|Mild|Moderate|High>", "summary": "<brief summary>", "recommendations": [{"title": "<short title>", "description": "<brief one-liner>", "details": "<detailed explanation with steps>"}]}`;

    const response = await callGemini(prompt);
    
    // Try to parse JSON from response
    let result;
    try {
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      result = JSON.parse(cleaned.trim());
    } catch (parseError) {
      console.error('Failed to parse assessment response:', parseError);
      result = {
        score: 0,
        level: 'Unknown',
        summary: 'Unable to analyze assessment at this time.',
        recommendations: []
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Assessment analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze assessment', details: error.message });
  }
});

export default router;
