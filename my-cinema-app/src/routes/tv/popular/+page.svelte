<!-- src/routes/tv/popular/+page.svelte -->
<script>
    import MovieCard from '$lib/components/MovieCard.svelte';
    export let data;
    
    $: tvShows = data.popularTVShows;
</script>

<svelte:head>
    <title>Popular TV Shows</title>
    <meta name="description" content="Currently popular TV shows" />
</svelte:head>

<div class="tv-shows-page">
    <h1>Popular TV Shows</h1>
    
    {#if tvShows?.results?.length > 0}
        <div class="tv-shows-grid">
            {#each tvShows.results as tvShow}
                <MovieCard movie={tvShow} />
            {/each}
        </div>
    {:else}
        <p>No popular TV shows found</p>
    {/if}
</div>

<style>
    .tv-shows-page {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    h1 {
        margin-bottom: 2rem;
        color: var(--text-primary);
        font-size: 2rem;
    }
    
    .tv-shows-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 2rem;
    }
    
    @media (max-width: 768px) {
        .tv-shows-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        h1 {
            font-size: 1.5rem;
        }
    }
</style>