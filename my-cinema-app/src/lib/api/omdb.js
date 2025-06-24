const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export async function getOmdbDetails(imdbId) {
    if (!imdbId) return null;
    
    try {
        const response = await fetch(
            `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`
        );
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        
        if (data.Response === 'False') {
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching OMDB data:', error);
        return null;
    }
}