// src/routes/tv/popular/+page.server.js
import { getPopularTVShows } from '$lib/api/tmdb';

export async function load() {
    const popularTVShows = await getPopularTVShows();
    
    return {
        popularTVShows
    };
}