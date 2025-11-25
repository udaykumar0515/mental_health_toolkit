import express from 'express';
import path from 'path';

const router = express.Router();

// GET /api/report -> simple info
router.get('/', (req, res) => {
  res.json({ message: 'Report endpoint. Use /api/report/download to download the Excel report.' });
});

// GET /api/report/download -> sends the Excel file
router.get('/download', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'server', 'data', 'MindEase_Assessment_Report.xlsx');
    return res.download(filePath, 'MindEase_Assessment_Report.xlsx', (err) => {
      if (err) {
        console.error('Error sending report:', err);
        if (!res.headersSent) res.status(500).json({ message: 'Report not available' });
      }
    });
  } catch (err) {
    console.error('Report download error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
