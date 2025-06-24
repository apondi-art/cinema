const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrending(mediaType = 'all', timeWindow = 'day') {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`
    );
    return await handleResponse(response);
  } catch (error) {
    handleError('fetchTrending', error);
  }
}

export async function searchContent(query, page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return await handleResponse(response);
  } catch (error) {
    handleError('searchContent', error);
  }
}

// Add more TMDB API functions as needed

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}

function handleError(method, error) {
  console.error(`Error in ${method}:`, error);
  throw error;
}