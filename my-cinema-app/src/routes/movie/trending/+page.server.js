// src/routes/movies/trending/+page.server.js
import { getTrendingMovies } from '$lib/api/tmdb';

export async function load() {
    const trendingMovies = await getTrendingMovies();
    
    return {
        trendingMovies
    };
}