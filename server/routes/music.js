import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const musicksDir = path.join(__dirname, '..', 'data', 'musicks');

// GET /api/music/:mood - List music files for a given mood
router.get('/:mood', (req, res) => {
	const mood = req.params.mood;
	const moodDir = path.join(musicksDir, mood);
	console.log('Requested mood:', mood);
	console.log('Looking in directory:', moodDir);
	fs.readdir(moodDir, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err.message);
			return res.status(404).json({ error: 'Mood not found or no music files.' });
		}
		// Only return .mp3 files
		const musicFiles = files.filter(f => f.endsWith('.mp3'));
		console.log('Found files:', musicFiles);
		res.json({ mood, files: musicFiles });
	});
});

// GET /api/music/:mood/:filename - Stream music file
router.get('/:mood/:filename', (req, res) => {
	const { mood, filename } = req.params;
	const filePath = path.join(musicksDir, mood, filename);
	
	// Security check: ensure the file is within the expected directory
	if (!filePath.startsWith(musicksDir)) {
		return res.status(403).json({ error: 'Access denied' });
	}

	// Check if file exists and is an mp3
	if (!filename.endsWith('.mp3')) {
		return res.status(400).json({ error: 'Only MP3 files are supported' });
	}

	fs.stat(filePath, (err, stats) => {
		if (err || !stats.isFile()) {
			return res.status(404).json({ error: 'File not found' });
		}

		res.setHeader('Content-Type', 'audio/mpeg');
		res.setHeader('Content-Length', stats.size);
		fs.createReadStream(filePath).pipe(res);
	});
});

export default router;