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
    
    // All content state for when "All" is selected
    let allContent = [];
    let isLoadingAll = false;
    
    // Initialize data
    onMount(async () => {
        mounted = true;
        query = $page.url.searchParams.get('q') || '';
        
        if (query) {
            await fetchSearchResults();
        } else {
            await fetchSuggestions();
            // Load all content by default when "All" is selected
            if (selectedGenre === 'all') {
                await fetchAllContent();
            }
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

    // Fetch all movies and TV shows when "All" is selected
    const fetchAllContent = async () => {
        if (!mounted) return;
        
        isLoadingAll = true;
        try {
            // Fetch multiple pages of popular movies and TV shows
            const [
                popularMoviesRes1,
                popularMoviesRes2,
                popularTVRes1,
                popularTVRes2,
                topRatedMoviesRes,
                topRatedTVRes
            ] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=1`),
                fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=2`),
                fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=1`),
                fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=2`),
                fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=1`),
                fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=1`)
            ]);
            
            const [
                popularMovies1,
                popularMovies2,
                popularTV1,
                popularTV2,
                topRatedMovies,
                topRatedTV
            ] = await Promise.all([
                popularMoviesRes1.json(),
                popularMoviesRes2.json(),
                popularTVRes1.json(),
                popularTVRes2.json(),
                topRatedMoviesRes.json(),
                topRatedTVRes.json()
            ]);
            
            // Combine all results and add media_type for consistency
            const movies = [
                ...popularMovies1.results,
                ...popularMovies2.results,
                ...topRatedMovies.results
            ].map(movie => ({ ...movie, media_type: 'movie' }));
            
            const tvShows = [
                ...popularTV1.results,
                ...popularTV2.results,
                ...topRatedTV.results
            ].map(show => ({ ...show, media_type: 'tv' }));
            
            // Combine and shuffle for variety
            const combined = [...movies, ...tvShows];
            allContent = combined
                .sort(() => Math.random() - 0.5) // Shuffle array
                .slice(0, 60); // Limit to 60 items for performance
                
        } catch (error) {
            console.error('Error fetching all content:', error);
        } finally {
            isLoadingAll = false;
        }
    };

    // Fetch content by specific genre
    const fetchContentByGenre = async (genreId) => {
        if (!mounted || genreId === 'all') return;
        
        isLoadingAll = true;
        try {
            // Fetch movies and TV shows with the selected genre
            const [moviesRes, tvRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreId}&page=1`),
                fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreId}&page=1`)
            ]);
            
            const [moviesData, tvData] = await Promise.all([
                moviesRes.json(),
                tvRes.json()
            ]);
            
            const movies = moviesData.results.map(movie => ({ ...movie, media_type: 'movie' }));
            const tvShows = tvData.results.map(show => ({ ...show, media_type: 'tv' }));
            
            // Combine and shuffle
            allContent = [...movies, ...tvShows]
                .sort(() => Math.random() - 0.5)
                .slice(0, 40);
                
        } catch (error) {
            console.error('Error fetching genre content:', error);
        } finally {
            isLoadingAll = false;
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
        
        // Load content based on selected genre when no search query
        if (selectedGenre === 'all') {
            fetchAllContent();
        } else {
            fetchContentByGenre(selectedGenre);
        }
    }
    
    const handleGenreSelect = async (genre) => {
        selectedGenre = genre;
        
        // Only fetch content if there's no active search query
        if (!query) {
            if (genre === 'all') {
                await fetchAllContent();
            } else {
                await fetchContentByGenre(genre);
            }
        }
    };
</script>

<main class="container">
    <h1>Search Movies & TV Shows</h1>
    
    <SearchBar bind:query />

    {#if query && querySuggestions.length > 0}
        <div class="search-suggestions movie-grid"> 
            {#each querySuggestions as item}
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
        <!-- Show genre-filtered content when a genre is selected -->
        {#if selectedGenre !== 'all' || allContent.length > 0}
            <div class="section-header">
                <h2 class="section-title">
                    {#if selectedGenre === 'all'}
                        🎬 All Movies & TV Shows
                    {:else}
                        {popularGenres.find(g => g.id === selectedGenre)?.name || 'Selected Genre'}
                    {/if}
                    ({allContent.length} items)
                </h2>
            </div>

            {#if isLoadingAll}
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            {:else if allContent.length > 0}
                <div class="movie-grid">
                    {#each allContent as item}
                        <MovieCard movie={{
                            ...item,
                            title: item.title || item.name,
                            year: item.release_date || item.first_air_date
                        }} />
                    {/each}
                </div>
            {/if}
        {/if}

        <!-- Show suggestions only when no genre is actively selected with content -->
        {#if selectedGenre === 'all' && allContent.length === 0 && !isLoadingAll}
            <div class="suggestions">
                <section>
                    <div class="section-header">
                        <h2 class="section-title">🔥 Trending Movies</h2>
                        <a href="/movie/trending" class="view-all">View All</a>
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
                        <a href="/tv/popular" class="view-all">View All</a>
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