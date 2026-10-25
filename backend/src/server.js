require('dotenv').config();
const express = require('express');
const cors = require('cors');

const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MoodTune AI backend is running.' });
});

app.use('/api/youtube', youtubeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`MoodTune AI backend listening on http://localhost:${PORT}`);
  if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    console.warn('WARNING: YOUTUBE_API_KEY is not set in backend/.env - music search will not work until you add it.');
  }
});
