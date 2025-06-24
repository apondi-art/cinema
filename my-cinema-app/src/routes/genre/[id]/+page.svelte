<!-- src/routes/genre/[id]/+page.svelte -->
<script>
	export let data;
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { getGenreName } from '../../../lib/stores/genres';

	const genreTitle = getGenreName(+data.genreId);
</script>

<main class="container">
	<h1>🎬 {$genreTitle} Movies</h1>

	{#if data.movies.length > 0}
		<div class="movie-grid">
			{#each data.movies as movie}
				<MovieCard movie={{
					...movie,
					title: movie.title,
					year: movie.release_date?.slice(0, 4)
				}} />
			{/each}
		</div>
	{:else}
		<p>No movies found for this genre.</p>
	{/if}
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	.movie-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}
</style>
