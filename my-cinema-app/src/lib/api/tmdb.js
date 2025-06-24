const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovieDetails(movieId) {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch movie details');
    }
    
    return response.json();
}

export async function getTVDetails(tvId) {
    const response = await fetch(
        `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch TV details');
    }
    
    return response.json();
}

export async function searchMovies(query, page = 1) {
    const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to search movies');
    }
    
    return response.json();
}

export async function getPopularMovies(page = 1) {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch popular movies');
    }
    
    return response.json();
}

export async function getPopularTVShows(page = 1) {
    const response = await fetch(
        `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch popular TV shows');
    }
    
    return response.json();
}


export async function getTrendingMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMDB_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
    }
    
    return await response.json();
}