const axios = require('axios');
const { buildSearchQuery } = require('../utils/queryBuilder');

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const MUSIC_CATEGORY_ID = '10'; // YouTube's "Music" category

async function searchMusic(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY') {
    return res.status(500).json({
      success: false,
      message: 'The YouTube API key has not been configured on the server. Add YOUTUBE_API_KEY to backend/.env'
    });
  }

  const { emotion, language, genre } = req.query;

  if (!emotion) {
    return res.status(400).json({ success: false, message: 'The "emotion" query parameter is required.' });
  }

  const searchQuery = buildSearchQuery(emotion, language, genre);

  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        videoCategoryId: MUSIC_CATEGORY_ID,
        maxResults: 12,
        safeSearch: 'moderate',
        key: apiKey
      },
      timeout: 10000
    });

    const results = (response.data.items || [])
      .filter((item) => item.id && item.id.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          ''
      }));

    return res.json({
      success: true,
      data: {
        query: searchQuery,
        emotion,
        language: language || 'English',
        genre: genre || 'All',
        results
      }
    });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);

    if (err.response?.status === 403) {
      return res.status(502).json({
        success: false,
        message: 'YouTube API request was rejected. Check that your API key is valid and the YouTube Data API v3 is enabled, and that your daily quota has not been exceeded.'
      });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ success: false, message: 'The request to YouTube timed out. Please try again.' });
    }

    return res.status(502).json({
      success: false,
      message: 'Unable to load music recommendations. Please try again.'
    });
  }
}

module.exports = { searchMusic };
