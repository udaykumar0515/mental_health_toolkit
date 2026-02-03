import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load quotes from JSON file
const quotesPath = path.join(__dirname, '../data/quotes.json');
let quotes = [];

try {
  const data = fs.readFileSync(quotesPath, 'utf-8');
  quotes = JSON.parse(data);
  console.log(`📜 Loaded ${quotes.length} motivational quotes`);
} catch (err) {
  console.error('Error loading quotes:', err.message);
  // Fallback quotes
  quotes = [
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "You are stronger than you think.", author: "Unknown" }
  ];
}

/**
 * GET /api/quotes/random
 * Returns a random motivational quote from the pre-generated list.
 * No API key usage - completely free.
 */
router.get('/random', (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    res.json(randomQuote);
  } catch (error) {
    console.error('Error getting random quote:', error);
    res.status(500).json({ error: 'Failed to get quote' });
  }
});

/**
 * GET /api/quotes
 * Returns all quotes (optional, for debugging or frontend use).
 */
router.get('/', (req, res) => {
  res.json({ count: quotes.length, quotes });
});

export default router;
