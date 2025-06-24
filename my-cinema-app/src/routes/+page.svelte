<script>
  import { onMount } from 'svelte';
  import MovieCard from '$lib/components/MovieCard.svelte';
  
  // State variables
  let trendingMovies = [];
  let popularTvShows = [];
  let searchResults = [];
  let isLoadingMovies = true;
  let isLoadingTvShows = true;
  let isSearching = false;
  let movieError = null;
  let tvError = null;
  let searchError = null;
  let searchQuery = '';
  let searchTimeout;
  
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch trending movies');
      trendingMovies = (await response.json()).results.slice(0, 8);
    } catch (err) {
      movieError = err.message;
      console.error('Error fetching movies:', err);
    } finally {
      isLoadingMovies = false;
    }
  };
  
  const fetchPopularTvShows = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch popular TV shows');
      popularTvShows = (await response.json()).results.slice(0, 8);
    } catch (err) {
      tvError = err.message;
      console.error('Error fetching TV shows:', err);
    } finally {
      isLoadingTvShows = false;
    }
  };
  
  const searchContent = async (query) => {
    if (!query.trim()) {
      searchResults = [];
      return;
    }
    
    isSearching = true;
    searchError = null;
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to search content');
      searchResults = (await response.json()).results.slice(0, 12);
    } catch (err) {
      searchError = err.message;
      console.error('Error searching:', err);
    } finally {
      isSearching = false;
    }
  };
  
  const handleSearchInput = (event) => {
    searchQuery = event.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchContent(searchQuery), 300);
  };
  
  const clearSearch = () => {
    searchQuery = '';
    searchResults = [];
    searchError = null;
  };
  
  onMount(() => {
    fetchTrendingMovies();
    fetchPopularTvShows();
  });
</script>

<div class="container">
  <!-- Hero Section -->
  <section class="hero" aria-labelledby="hero-heading">
    <h1 id="hero-heading">Discover Your Next Favorite</h1>
    <p>Explore millions of movies and TV shows with personalized recommendations</p>
  </section>

  <!-- Search Section -->
  <section class="search-section" aria-labelledby="search-heading">
    <h2 id="search-heading" class="sr-only">Search</h2>
    <div class="search-container">
      <label for="search-input" class="sr-only">Search for movies, TV shows, actors</label>
      <span class="search-icon" aria-hidden="true">
        <i class="fas fa-search"></i>
      </span>
      <input
        id="search-input"
        type="text"
        class="search-input"
        placeholder="Search for movies, TV shows, actors..."
        bind:value={searchQuery}
        on:input={handleSearchInput}
        aria-describedby="search-instructions"
      />
      {#if searchQuery}
        <button 
          class="clear-search" 
          on:click={clearSearch}
          aria-label="Clear search"
        >
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      {/if}
    </div>
    <p id="search-instructions" class="sr-only">Type to search for content</p>
  </section>

  <!-- Search Results Section -->
  {#if searchQuery}
    <section class="search-results-section" aria-labelledby="search-results-heading">
      <h2 id="search-results-heading" class="section-title">
        Search Results for "{searchQuery}"
      </h2>
      
      {#if isSearching}
        <div class="loading" aria-busy="true" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <p>Searching...</p>
        </div>
      {:else if searchError}
        <div class="error-message" aria-live="assertive">
          <p>Error searching: {searchError}</p>
          <button 
            on:click={() => searchContent(searchQuery)} 
            class="btn btn-primary"
          >
            Retry Search
          </button>
        </div>
      {:else if searchResults.length === 0}
        <div class="no-results" aria-live="polite">
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching with different keywords</p>
        </div>
      {:else}
        <div class="movie-grid">
          {#each searchResults as item (item.id)}
            <MovieCard movie={item} />
          {/each}
        </div>
      {/if}
    </section>
  {/if}

  <!-- Only show trending/popular sections if not searching -->
  {#if !searchQuery}
    <!-- Trending Movies Section -->
    <section aria-labelledby="trending-movies-heading">
      <div class="section-header">
        <h2 id="trending-movies-heading" class="section-title">🔥 Trending Movies</h2>
        <a href="/movie/trending" class="view-all">View All</a>
      </div>
      
      {#if isLoadingMovies}
        <div class="loading" aria-busy="true">
          <div class="spinner" aria-hidden="true"></div>
        </div>
      {:else if movieError}
        <div class="error-message" aria-live="assertive">
          <p>Error loading movies: {movieError}</p>
          <button on:click={fetchTrendingMovies} class="btn btn-primary">
            Retry
          </button>
        </div>
      {:else}
        <div class="movie-grid">
          {#each trendingMovies as movie (movie.id)}
            <MovieCard {movie} />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Popular TV Shows Section -->
    <section aria-labelledby="popular-tv-heading">
      <div class="section-header">
        <h2 id="popular-tv-heading" class="section-title">📺 Popular TV Shows</h2>
        <a href="/tv/popular" class="view-all">View All</a>
      </div>
      
      {#if isLoadingTvShows}
        <div class="loading" aria-busy="true">
          <div class="spinner" aria-hidden="true"></div>
        </div>
      {:else if tvError}
        <div class="error-message" aria-live="assertive">
          <p>Error loading TV shows: {tvError}</p>
          <button on:click={fetchPopularTvShows} class="btn btn-primary">
            Retry
          </button>
        </div>
      {:else}
        <div class="movie-grid">
          {#each popularTvShows as tvShow (tvShow.id)}
            <MovieCard movie={tvShow} />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .search-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    margin-top: 30px;
  }

  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 16px 20px 16px 55px;
    font-size: 1.1rem;
    border: 2px solid #e0e0e0;
    border-radius: 50px;
    background: white;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .clear-search {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-message {
    color: #e53e3e;
    text-align: center;
    padding: 2rem;
  }

  .no-results {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  @media (max-width: 768px) {
    .search-input {
      padding: 14px 18px 14px 50px;
    }
  }
</style>