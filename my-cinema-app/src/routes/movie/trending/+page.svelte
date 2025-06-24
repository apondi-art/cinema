<!-- src/routes/movies/trending/+page.svelte -->
<script>
    import MovieCard from '$lib/components/MovieCard.svelte';
    export let data;
    
    $: movies = data.trendingMovies;
</script>

<svelte:head>
    <title>Trending Movies</title>
    <meta name="description" content="Currently trending movies" />
</svelte:head>

<div class="trending-page">
    <h1>Trending Movies</h1>
    
    {#if movies?.results?.length > 0}
        <div class="movies-grid">
            {#each movies.results as movie}
                <MovieCard {movie} />
            {/each}
        </div>
    {:else}
        <p>No trending movies found</p>
    {/if}
</div>

<style>
    .trending-page {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    h1 {
        margin-bottom: 2rem;
        color: var(--text-primary);
        font-size: 2rem;
    }
    
    .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 2rem;
    }
    
    @media (max-width: 768px) {
        .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        h1 {
            font-size: 1.5rem;
        }
    }
</style>