<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import MovieCard from '$lib/components/MovieCard.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    
    // Search state
    let searchResults = [];
    let isLoading = false;
    let query = '';
    let selectedGenre = 'all';
    let mounted = false;
    
    // Suggestions state
    let trendingMovies = [];
    let trendingTV = [];
    let popularGenres = [];
    let querySuggestions = []; // New state for real-time query suggestions
    
    // Initialize data
    onMount(async () => {
        mounted = true;
        query = $page.url.searchParams.get('q') || '';
        
        if (query) {
            await fetchSearchResults();
        } else {
            await fetchSuggestions();
        }
    });
    
    // Fetch search results
    const fetchSearchResults = async () => {
        if (!query || !mounted) return;
        
        isLoading = true;
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            searchResults = data.results.filter(item => item.media_type !== 'person');
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            isLoading = false;
        }
    };

    // Fetch real-time query suggestions
    const fetchQuerySuggestions = async () => {
        // Only fetch if query is at least 3 characters and not currently loading a main search
        if (query.length < 3 || isLoading) { 
            querySuggestions = [];
            return;
        }

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            // Store the full item object for MovieCard, filter out 'person' and items without title/name
            querySuggestions = data.results
                .filter(item => item.media_type !== 'person' && (item.title || item.name))
                .slice(0, 5); // Limit to top 5 suggestions
        } catch (error) {
            console.error('Error fetching query suggestions:', error);
            querySuggestions = [];
        }
    };
    
    // Fetch suggestion data (trending movies, tv, genres) for the initial state
    const fetchSuggestions = async () => {
        try {
            const [moviesRes, tvRes, genresRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
                fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
                fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
            ]);
            
            trendingMovies = (await moviesRes.json()).results.slice(0, 4);
            trendingTV = (await tvRes.json()).results.slice(0, 4);
            popularGenres = (await genresRes.json()).genres.slice(0, 6);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };
    
    // Reactive search and suggestion trigger
    $: if (query && mounted) {
        fetchSearchResults();
        fetchQuerySuggestions(); // Call new suggestion fetch function here
    } else if (!query && mounted) { // Reset to suggestions when query is empty
        searchResults = [];
        querySuggestions = []; // Clear suggestions too when query is empty
        fetchSuggestions();
    }
    
    const handleGenreSelect = (genre) => {
        selectedGenre = genre;
        // Add genre filtering logic here if needed
    };
</script>

<main class="container">
    <h1>Search Movies & TV Shows</h1>
    
    <SearchBar bind:query />

    {#if query && querySuggestions.length > 0}
        <div class="search-suggestions movie-grid"> {#each querySuggestions as item}
                <MovieCard movie={{
                    ...item,
                    title: item.title || item.name,
                    year: item.release_date || item.first_air_date
                }} on:click={() => { 
                    // When a suggestion card is clicked, update the query and clear search results
                    // This will trigger the reactive block to perform a new search for the selected item
                    query = item.title || item.name; 
                    searchResults = []; 
                    querySuggestions = []; // Hide suggestions after selection
                }} />
            {/each}
        </div>
    {/if}
    
    <div class="genre-filters">
        <button
            class="genre-tag {selectedGenre === 'all' ? 'active' : ''}"
            on:click={() => handleGenreSelect('all')}
            type="button"
        >
            All
        </button>
        {#each popularGenres as genre}
            <button
                class="genre-tag {selectedGenre === genre.id ? 'active' : ''}"
                on:click={() => handleGenreSelect(genre.id)}
                type="button"
            >
                {genre.name}
            </button>
        {/each}
    </div>

    {#if query}
        <div class="section-header">
            <h2 class="section-title">Search Results ({searchResults.length} found)</h2>
        </div>

        {#if isLoading}
            <div class="loading">
                <div class="spinner"></div>
            </div>
        {:else if searchResults.length > 0}
            <div class="movie-grid">
                {#each searchResults as item}
                    <MovieCard movie={{
                        ...item,
                        title: item.title || item.name,
                        year: item.release_date || item.first_air_date
                    }} />
                {/each}
            </div>
        {:else}
            <p>No results found for "{query}"</p>
        {/if}
    {:else}
        <div class="suggestions">
            <section>
                <div class="section-header">
                    <h2 class="section-title">🔥 Trending Movies</h2>
                    <a href="/trending/movies" class="view-all">View All</a>
                </div>
                <div class="movie-grid">
                    {#each trendingMovies as movie}
                        <MovieCard movie={{
                            ...movie,
                            title: movie.title,
                            year: movie.release_date?.slice(0, 4)
                        }} />
                    {/each}
                </div>
            </section>

            <section>
                <div class="section-header">
                    <h2 class="section-title">📺 Trending TV Shows</h2>
                    <a href="/trending/tv" class="view-all">View All</a>
                </div>
                <div class="movie-grid">
                    {#each trendingTV as show}
                        <MovieCard movie={{
                            ...show,
                            title: show.name,
                            year: show.first_air_date?.slice(0, 4)
                        }} />
                    {/each}
                </div>
            </section>

            <section>
                <div class="section-header">
                    <h2 class="section-title">🎭 Popular Genres</h2>
                </div>
                <div class="genre-suggestions">
                    {#each popularGenres as genre}
                        <a href="/genre/{genre.id}" class="genre-card">
                            {genre.name}
                        </a>
                    {/each}
                </div>
            </section>
        </div>
    {/if}
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .genre-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1.5rem 0;
    }

    .genre-tag {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .genre-tag.active,
    .genre-tag:hover {
        background: var(--accent);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 2rem 0 1rem;
    }

    .view-all {
        color: var(--accent);
        font-size: 0.9rem;
    }

    .movie-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.5rem;
        margin: 1rem 0 3rem;
    }

    .loading {
        display: flex;
        justify-content: center;
        padding: 2rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid var(--accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .genre-suggestions {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0 3rem;
    }

    .genre-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        transition: transform 0.2s;
    }

    .genre-card:hover {
        background: var(--accent);
        transform: translateY(-3px);
    }

    /* Styles specifically for the search suggestions when displayed as cards */
    .search-suggestions {
        background: rgba(255, 255, 255, 0.08); /* Background for the suggestion container */
        border-radius: 8px;
        margin-top: 0.5rem;
        max-height: 400px; /* Adjust as needed */
        overflow-y: auto;
        z-index: 10;
        position: relative;
        padding: 1rem; /* Add some padding inside the suggestion box */
    }

    /* You may want to adjust the grid template columns for suggestions
       if they should appear differently from main search results.
       For now, they will inherit .movie-grid's columns. */
    /* .search-suggestions.movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
    } */

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
        }
        
        .genre-suggestions {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }

        .search-suggestions {
            padding: 0.5rem; /* Less padding on smaller screens */
        }
    }
</style>