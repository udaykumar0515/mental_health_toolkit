/**
 * Export Routes
 * 
 * Handles data export functionality.
 */

import express from 'express';
import { readAssessments } from '../database.js';
import { getCSVFilePath, exportAssessmentsToCSV } from '../utils/csvExport.js';
import fs from 'fs';

const router = express.Router();

// GET /api/export/csv - Download assessments as CSV
router.get('/csv', async (req, res) => {
  try {
    const assessments = await readAssessments();
    
    // Export to CSV
    exportAssessmentsToCSV(assessments);
    
    // Send the CSV file
    const csvPath = getCSVFilePath();
    
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ message: 'CSV file not found' });
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="assessments_export.csv"');
    res.sendFile(csvPath);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
