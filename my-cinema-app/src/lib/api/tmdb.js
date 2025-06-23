const API_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.append('api_key', import.meta.env.VITE_TMDB_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
}