import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findUserById } from '../database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_FILE = path.join(DATA_DIR, 'assessments_export.csv');

// Escape CSV fields that contain special characters
const escapeCSV = (field) => {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert recommendations array to pipe-separated string
const formatRecommendations = (recommendations) => {
  if (!recommendations || !Array.isArray(recommendations)) return '';
  return recommendations.join(' | ');
};

// Format date from ISO string to readable format
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

// Generate CSV header
const getCSVHeader = () => {
  return [
    'Assessment ID',
    'User Name',
    'User ID',
    'Score',
    'Stress Level',
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12',
    'Recommendations',
    'Date'
  ].map(escapeCSV).join(',');
};

// Convert assessment to CSV row (sync version - user name lookup done separately)
const assessmentToCSVRow = (assessment, userName) => {
  const answers = assessment.answers || {};
  const questionValues = [
    answers.q1 || '',
    answers.q2 || '',
    answers.q3 || '',
    answers.q4 || '',
    answers.q5 || '',
    answers.q6 || '',
    answers.q7 || '',
    answers.q8 || '',
    answers.q9 || '',
    answers.q10 || '',
    answers.q11 || '',
    answers.q12 || ''
  ];

  const row = [
    assessment.id,
    userName,
    assessment.user_id,
    assessment.score,
    assessment.stress_level,
    ...questionValues,
    formatRecommendations(assessment.recommendations),
    formatDate(assessment.created_at)
  ];

  return row.map(escapeCSV).join(',');
};

// Export all assessments to CSV
export const exportAssessmentsToCSV = async (assessments) => {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Get user names for all assessments
    const userCache = new Map();
    for (const assessment of assessments) {
      if (!userCache.has(assessment.user_id)) {
        try {
          const user = await findUserById(assessment.user_id);
          userCache.set(assessment.user_id, user ? user.full_name : 'Unknown User');
        } catch {
          userCache.set(assessment.user_id, 'Unknown User');
        }
      }
    }

    // Create CSV content
    const csvRows = [getCSVHeader()];
    for (const assessment of assessments) {
      const userName = userCache.get(assessment.user_id) || 'Unknown User';
      csvRows.push(assessmentToCSVRow(assessment, userName));
    }
    const csvContent = csvRows.join('\n');

    // Write to file
    fs.writeFileSync(CSV_FILE, csvContent, 'utf-8');
    console.log(`✓ CSV exported successfully to ${CSV_FILE}`);
    return true;
  } catch (error) {
    console.error('Error exporting assessments to CSV:', error);
    return false;
  }
};

// Get the path to the CSV file
export const getCSVFilePath = () => {
  return CSV_FILE;
};
