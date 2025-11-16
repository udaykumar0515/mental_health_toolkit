import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFiles } from './database.js';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessment.js';
import profileRoutes from './routes/profile.js';
import questionsRoutes from './routes/questions.js';
import breathingRoutes from './routes/breathing.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data files
initializeFiles();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/breathing', breathingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mental Health Backend running on http://localhost:${PORT}`);
  console.log(`📂 Data stored in: ${process.cwd()}/data`);
});
