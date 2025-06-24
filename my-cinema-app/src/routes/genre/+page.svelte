<script>
	import { onMount } from 'svelte';
	import { genres, fetchGenres } from '$lib/stores/genres.js';

	let allGenres = [];

	onMount(async () => {
		await fetchGenres();
		genres.subscribe(g => allGenres = g);
	});
</script>

<main class="container">
	<h1>🎭 Browse Genres</h1>

	{#if allGenres.length > 0}
		<div class="genre-grid">
			{#each allGenres as genre}
				<a class="genre-card" href={`/genre/${genre.id}`}>
					{genre.name}
				</a>
			{/each}
		</div>
	{:else}
		<p>Loading genres...</p>
	{/if}
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.genre-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.genre-card {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
		transition: background 0.2s ease;
		color: var(--color-text);
		text-decoration: none;
	}

	.genre-card:hover {
		background: var(--accent);
		transform: translateY(-2px);
	}
</style>
