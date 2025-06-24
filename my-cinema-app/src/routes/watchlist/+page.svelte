<script>
    import MovieCard from '$lib/components/MovieCard.svelte';
    import { watchlist } from '$lib/stores/watchlist';
    
    let filter = 'all';
    
    $: filteredItems = $watchlist.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'watched') return item.watched;
        if (filter === 'to-watch') return !item.watched;
        if (filter === 'movies') return item.media_type === 'movie';
        if (filter === 'tv') return item.media_type === 'tv';
        return true;
    });
</script>

<h1>My Watchlist</h1>

<!-- Watchlist Controls -->
<div class="watchlist-controls">
    <button 
        class="filter-btn {filter === 'all' ? 'active' : ''}"
        on:click={() => filter = 'all'}
    >
        All ({$watchlist.length})
    </button>
    <button 
        class="filter-btn {filter === 'to-watch' ? 'active' : ''}"
        on:click={() => filter = 'to-watch'}
    >
        To Watch ({$watchlist.filter(i => !i.watched).length})
    </button>
    <button 
        class="filter-btn {filter === 'watched' ? 'active' : ''}"
        on:click={() => filter = 'watched'}
    >
        Watched ({$watchlist.filter(i => i.watched).length})
    </button>
    <button 
        class="filter-btn {filter === 'movies' ? 'active' : ''}"
        on:click={() => filter = 'movies'}
    >
        Movies ({$watchlist.filter(i => i.media_type === 'movie').length})
    </button>
    <button 
        class="filter-btn {filter === 'tv' ? 'active' : ''}"
        on:click={() => filter = 'tv'}
    >
        TV Shows ({$watchlist.filter(i => i.media_type === 'tv').length})
    </button>
</div>

{#if filteredItems.length > 0}
    <div class="movie-grid">
        {#each filteredItems as item}
            <MovieCard 
                movie={{ 
                    ...item, 
                    title: item.title || item.name,
                    year: item.release_date || item.first_air_date
                }} 
            />
        {/each}
    </div>
{:else}
    <p>Your watchlist is empty. Add some movies or TV shows!</p>
{/if}

<style>
    .watchlist-controls {
        display: flex;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        border: none;
        padding: 0.7rem 1.5rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: var(--accent-secondary);
    }
</style>