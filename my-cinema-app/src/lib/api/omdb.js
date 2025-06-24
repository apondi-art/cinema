const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com';

export async function getOmdbDetails(imdbId) {
  try {
    const response = await fetch(
      `${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
    );
    return await handleResponse(response);
  } catch (error) {
    handleError('getOmdbDetails', error);
  }
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`OMDB API request failed with status ${response.status}`);
  }
  return response.json();
}

function handleError(method, error) {
  console.error(`Error in ${method}:`, error);
  throw error;
}