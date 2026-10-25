import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

/**
 * Fetches music recommendations from the backend for a given mood/language/genre.
 * Throws an Error with a user-friendly message on failure.
 */
export async function fetchMusicRecommendations({ emotion, language, genre }) {
  try {
    const res = await api.get('/youtube/search', { params: { emotion, language, genre } });
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Unable to load music recommendations. Please try again.';
    throw new Error(message);
  }
}

export default api;
