<script>
	import { onMount } from 'svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';

	// Fetch trending movies from TMDB API
	let trendingMovies = [];
	let popularTvShows = [];
	let isLoadingMovies = true;
	let isLoadingTvShows = true;
	let movieError = null;
	let tvError = null;

	const fetchTrendingMovies = async () => {
		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch trending movies');
			}
			const data = await response.json();
			trendingMovies = data.results.slice(0, 8);
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
			if (!response.ok) {
				throw new Error('Failed to fetch popular TV shows');
			}
			const data = await response.json();
			popularTvShows = data.results.slice(0, 8);
		} catch (err) {
			tvError = err.message;
			console.error('Error fetching TV shows:', err);
		} finally {
			isLoadingTvShows = false;
		}
	};

	// Fetch on component mount
	onMount(() => {
		fetchTrendingMovies();
		fetchPopularTvShows();
	});
</script>

<div class="container">
	<!-- Hero Section -->
	<section class="hero">
		<h1>Discover Your Next Favorite</h1>
		<p>Explore millions of movies and TV shows with personalized recommendations</p>
	</section>

	<!-- Search Section -->
	<section class="search-section">
		<div class="search-container">
			<span class="search-icon"><i class="fas fa-search"></i></span>
			<input
				type="text"
				class="search-input"
				placeholder="Search for movies, TV shows, actors..."
			/>
		</div>
	</section>

	<!-- Trending Movies Section -->
	<section>
		<div class="section-header">
			<h2 class="section-title">🔥 Trending Movies</h2>
			<a href="/movie/trending" class="view-all">View All</a>
		</div>
		
		<!-- Loading State for Movies -->
		{#if isLoadingMovies}
			<div class="loading">
				<div class="spinner"></div>
			</div>
		<!-- Error State for Movies -->
		{:else if movieError}
			<div class="error-message">
				<p>Error loading movies: {movieError}</p>
				<button on:click={fetchTrendingMovies} class="btn btn-primary">
					Retry
				</button>
			</div>
		<!-- Movies Content -->
		{:else}
			<div class="movie-grid">
				{#each trendingMovies as movie}
					<MovieCard {movie} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- Popular TV Shows Section -->
	<section>
		<div class="section-header">
			<h2 class="section-title">📺 Popular TV Shows</h2>
			<a href="/tv/popular" class="view-all">View All</a>
		</div>
		
		<!-- Loading State for TV Shows -->
		{#if isLoadingTvShows}
			<div class="loading">
				<div class="spinner"></div>
			</div>
		<!-- Error State for TV Shows -->
		{:else if tvError}
			<div class="error-message">
				<p>Error loading TV shows: {tvError}</p>
				<button on:click={fetchPopularTvShows} class="btn btn-primary">
					Retry
				</button>
			</div>
		<!-- TV Shows Content -->
		{:else}
			<div class="movie-grid">
				{#each popularTvShows as tvShow}
					<MovieCard movie={tvShow} />
				{/each}
			</div>
		{/if}
	</section>
</div>