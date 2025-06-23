<script>
	import { onMount } from 'svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';

	// Fetch trending movies from TMDB API
	let trendingMovies = [];
	let isLoading = true;
	let error = null;

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
			error = err.message;
			console.error('Error fetching movies:', err);
		} finally {
			isLoading = false;
		}
	};

	// Fetch on component mount
	onMount(fetchTrendingMovies);
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

	<!-- Loading State -->
	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
		</div>
	<!-- Error State -->
	{:else if error}
		<div class="error-message">
			<p>Error loading movies: {error}</p>
			<button on:click={fetchTrendingMovies} class="btn btn-primary">
				Retry
			</button>
		</div>
	<!-- Content -->
	{:else}
		<!-- Trending Movies Section -->
		<section>
			<div class="section-header">
				<h2 class="section-title">🔥 Trending Movies</h2>
				<a href="/movies/trending" class="view-all">View All</a>
			</div>
			<div class="movie-grid">
				{#each trendingMovies as movie}
					<MovieCard {movie} />
				{/each}
			</div>
		</section>

		<!-- Popular TV Shows Section -->
		<section>
			<div class="section-header">
				<h2 class="section-title">📺 Popular TV Shows</h2>
				<a href="/tv/popular" class="view-all">View All</a>
			</div>
			<!-- TV shows would go here -->
			<div class="movie-grid">
				<!-- Placeholder for TV shows -->
				<div class="placeholder-text">
					TV shows will be displayed here
				</div>
			</div>
		</section>
	{/if}
</div>