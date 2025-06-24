<script>
    import { getMovieDetails, getTVDetails } from '$lib/api/tmdb';
    import { getOmdbDetails } from '$lib/api/omdb';
    import { watchlist } from '$lib/stores/watchlist';
    
    export let data;
    
    $: media = data.media;
    $: omdbData = data.omdbData;
    $: isInWatchlist = $watchlist.some(item => item.id === media.id);
    
    function toggleWatchlist() {
        if (isInWatchlist) {
            watchlist.remove(media.id);
        } else {
            watchlist.add({
                id: media.id,
                title: media.title || media.name,
                poster_path: media.poster_path,
                media_type: media.title ? 'movie' : 'tv',
                release_date: media.release_date || media.first_air_date,
                watched: false
            });
        }
    }
    
    function toggleWatched() {
        watchlist.update(items => {
            return items.map(item => {
                if (item.id === media.id) {
                    return { ...item, watched: !item.watched };
                }
                return item;
            });
        });
    }
    
    $: isWatched = $watchlist.find(item => item.id === media.id)?.watched || false;
</script>

<div class="movie-detail">
    <div class="detail-poster">
        {#if media.poster_path}
            <img 
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`} 
                alt={media.title || media.name}
                loading="lazy"
            />
        {:else}
            <i class="fas fa-film"></i>
        {/if}
    </div>
    
    <div class="detail-info">
        <h1>{media.title || media.name} 
            <span>({new Date(media.release_date || media.first_air_date).getFullYear()})</span>
        </h1>
        
        <div class="detail-meta">
            {#if media.runtime}
                <span>{Math.floor(media.runtime / 60)}h {media.runtime % 60}m</span>
                <span>•</span>
            {/if}
            <span>{media.genres?.map(g => g.name).join(', ')}</span>
        </div>
        
        <!-- Ratings -->
        <div class="rating-section">
            <div class="rating-badge">
                <div class="rating-value">{media.vote_average?.toFixed(1)}</div>
                <div class="rating-source">TMDB</div>
            </div>
            
            {#if omdbData?.imdbRating}
                <div class="rating-badge">
                    <div class="rating-value">{omdbData.imdbRating}</div>
                    <div class="rating-source">IMDB</div>
                </div>
            {/if}
            
            {#if omdbData?.Ratings?.find(r => r.Source === 'Rotten Tomatoes')}
                <div class="rating-badge">
                    <div class="rating-value">
                        {omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes').Value}
                    </div>
                    <div class="rating-source">RT</div>
                </div>
            {/if}
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
            <button 
                class="btn {isInWatchlist ? 'btn-secondary' : 'btn-primary'}" 
                on:click={toggleWatchlist}
            >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            
            {#if isInWatchlist}
                <button 
                    class="btn {isWatched ? 'btn-primary' : 'btn-secondary'}" 
                    on:click={toggleWatched}
                >
                    {isWatched ? '✓ Watched' : 'Mark as Watched'}
                </button>
            {/if}
        </div>
        
        <!-- Overview -->
        <h3>Overview</h3>
        <p>{media.overview}</p>
        
        <!-- Cast -->
        {#if media.credits?.cast}
            <h3>Cast</h3>
            <div class="cast-grid">
                {#each media.credits.cast.slice(0, 10) as person}
                    <div class="cast-member">
                        {#if person.profile_path}
                            <img 
                                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                                alt={person.name}
                                loading="lazy"
                            />
                        {:else}
                            <div class="placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                        {/if}
                        <div class="cast-info">
                            <strong>{person.name}</strong>
                            <span>{person.character}</span>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .movie-detail {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 3rem;
        margin: 2rem 0;
    }
    
    .detail-poster {
        width: 100%;
        height: 450px;
        background: linear-gradient(45deg, var(--accent), var(--accent-secondary));
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }
    
    .detail-poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .detail-info h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .detail-meta {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        color: var(--text-secondary);
        align-items: center;
        flex-wrap: wrap;
    }
    
    .rating-section {
        display: flex;
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .rating-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 10px;
        min-width: 80px;
    }
    
    .rating-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent);
    }
    
    .rating-source {
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .action-buttons {
        display: flex;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    
    .cast-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.5rem;
        margin: 1rem 0;
    }
    
    .cast-member {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .cast-member img,
    .cast-member .placeholder {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .cast-member .placeholder {
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
    }
    
    .cast-info {
        padding: 1rem;
    }
    
    .cast-info strong {
        display: block;
        margin-bottom: 0.3rem;
    }
    
    .cast-info span {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
        .movie-detail {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .detail-poster {
            height: 300px;
        }
        
        .cast-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
    }
</style>