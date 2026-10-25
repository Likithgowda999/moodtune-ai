const express = require('express');
const router = express.Router();
const { searchMusic } = require('../controllers/youtubeController');

// GET /api/youtube/search?emotion=happy&language=English&genre=All
router.get('/search', searchMusic);

module.exports = router;
