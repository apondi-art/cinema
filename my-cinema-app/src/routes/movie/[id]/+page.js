import { getMovieDetails } from '$lib/api/tmdb';
import { getOmdbDetails } from '$lib/api/omdb';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const movieId = params.id;
        
        // Fetch movie details from TMDB
        const media = await getMovieDetails(movieId);
        
        // Fetch additional data from OMDB if needed
        let omdbData = null;
        if (media.imdb_id) {
            omdbData = await getOmdbDetails(media.imdb_id);
        }
        
        return {
            media,
            omdbData
        };
    } catch (err) {
        throw error(404, 'Movie not found');
    }
}