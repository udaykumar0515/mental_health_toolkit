import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

const router = express.Router();

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Read questions from file
const readQuestions = () => {
  ensureDataDir();
  if (!fs.existsSync(QUESTIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions:', error);
    return [];
  }
};

// Write questions to file
const writeQuestions = (questions) => {
  ensureDataDir();
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2), 'utf-8');
};

// No default questions - only use questions from questions.json file
// To add questions, edit server/data/questions.json directly

// GET /api/questions
router.get('/', (req, res) => {
  try {
    const questions = readQuestions();
    if (questions.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/questions
router.post('/', (req, res) => {
  try {
    const { text, options } = req.body;

    if (!text || !options || !Array.isArray(options)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const questions = readQuestions();
    const newQuestion = {
      id: `q${Date.now()}`,
      text,
      options
    };

    questions.push(newQuestion);
    writeQuestions(questions);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/questions/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let questions = readQuestions();
    const filtered = questions.filter(q => q.id !== id);

    if (filtered.length === questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    writeQuestions(filtered);
    res.status(200).json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
