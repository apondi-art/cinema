import { getTVDetails } from '$lib/api/tmdb';
import { getOmdbDetails } from '$lib/api/omdb';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const tvId = params.id;
        
        // Fetch TV details from TMDB
        const media = await getTVDetails(tvId);
        
        // Fetch additional data from OMDB if available
        let omdbData = null;
        if (media.imdb_id) {
            omdbData = await getOmdbDetails(media.imdb_id);
        }
        
        return {
            media,
            omdbData
        };
    } catch (err) {
        console.error('Error loading TV show:', err);
        throw error(404, 'TV show not found');
    }
}
