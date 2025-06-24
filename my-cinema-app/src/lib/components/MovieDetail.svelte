<script>
    import { getMovieDetails, getTVDetails } from '$lib/api/tmdb';
    import { getOmdbDetails } from '$lib/api/omdb';
    import { watchlist } from '$lib/stores/watchlist';
    
    export let data;
    
    $: media = data.media;
    $: omdbData = data.omdbData;
    $: isInWatchlist = $watchlist.some(item => item.id === media.id);
    
    // Watch providers and streaming platforms
    let showWatchModal = false;
    
    // Common streaming platforms with their URLs
    const streamingPlatforms = [
        {
            name: 'YouTube',
            url: 'https://www.youtube.com/results?search_query=',
            color: '#FF0000',
            icon: '📺',
            description: 'Free with ads'
        },
        {
            name: 'Netflix',
            url: 'https://www.netflix.com/search?q=',
            color: '#E50914',
            icon: '🎬',
            description: 'Subscription'
        },
        {
            name: 'Amazon Prime',
            url: 'https://www.amazon.com/s?k=',
            color: '#00A8E1',
            icon: '📺',
            description: 'Rent/Buy/Prime'
        },
        {
            name: 'Disney+',
            url: 'https://www.disneyplus.com/search?q=',
            color: '#113CCF',
            icon: '🏰',
            description: 'Subscription'
        },
        {
            name: 'Hulu',
            url: 'https://www.hulu.com/search?q=',
            color: '#1CE783',
            icon: '📽️',
            description: 'Subscription'
        },
        {
            name: 'HBO Max',
            url: 'https://play.hbomax.com/search?q=',
            color: '#6441A4',
            icon: '🎭',
            description: 'Subscription'
        },
        {
            name: 'Apple TV+',
            url: 'https://tv.apple.com/search?term=',
            color: '#000000',
            icon: '🍎',
            description: 'Rent/Buy/Sub'
        }
    ];
    
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
    
    function openWatchModal() {
        showWatchModal = true;
    }
    
    function closeWatchModal() {
        showWatchModal = false;
    }
    
    function searchOnPlatform(platform) {
        const query = encodeURIComponent(media.title || media.name);
        const year = new Date(media.release_date || media.first_air_date).getFullYear();
        
        // For YouTube, add additional search terms for better results
        if (platform.name === 'YouTube') {
            const mediaType = media.title ? 'movie' : 'tv show';
            const fullQuery = `${query} ${year} ${mediaType} full`;
            window.open(platform.url + encodeURIComponent(fullQuery), '_blank');
        } else {
            window.open(platform.url + query, '_blank');
        }
        
        closeWatchModal();
    }
    
    // Alternative: Direct watch function for specific streaming service
    function watchNow() {
        // You can customize this based on your preferred streaming service
        // or integrate with a streaming API
        const title = encodeURIComponent(media.title || media.name);
        const year = new Date(media.release_date || media.first_air_date).getFullYear();
        
        // Example: Search on Google for streaming options
        const searchQuery = `${title} ${year} watch online streaming`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
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
            <!-- Primary Watch Button -->
            <button class="btn btn-watch" on:click={openWatchModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Now
            </button>
            
            <button 
                class="btn {isInWatchlist ? 'btn-secondary' : 'btn-primary'}" 
                on:click={toggleWatchlist}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            
            {#if isInWatchlist}
                <button 
                    class="btn {isWatched ? 'btn-success' : 'btn-secondary'}" 
                    on:click={toggleWatched}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {isWatched ? 'Watched' : 'Mark as Watched'}
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

<!-- Watch Modal -->
{#if showWatchModal}
    <div class="modal-overlay" on:click={closeWatchModal}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>Watch "{media.title || media.name}"</h2>
                <button class="close-btn" on:click={closeWatchModal}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <p>Choose a streaming platform to search for this {media.title ? 'movie' : 'TV show'}:</p>
                
                <div class="streaming-grid">
                    {#each streamingPlatforms as platform}
                        <button 
                            class="streaming-btn {platform.name === 'YouTube' ? 'youtube-special' : ''}" 
                            style="--platform-color: {platform.color}"
                            on:click={() => searchOnPlatform(platform)}
                        >
                            <span class="platform-icon">{platform.icon}</span>
                            <span class="platform-name">{platform.name}</span>
                            <span class="platform-desc">{platform.description}</span>
                        </button>
                    {/each}
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" on:click={watchNow}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="21 21l-4.35-4.35"/>
                        </svg>
                        Search Google
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

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
    
    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-size: 0.9rem;
    }
    
    .btn-watch {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        font-size: 1rem;
        padding: 1rem 2rem;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }
    
    .btn-watch:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }
    
    .btn-primary {
        background: var(--accent);
        color: white;
    }
    
    .btn-primary:hover {
        background: var(--accent-secondary);
        transform: translateY(-1px);
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .btn-success {
        background: #2ecc71;
        color: white;
    }
    
    .btn-success:hover {
        background: #27ae60;
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
    
    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: var(--bg-secondary, #1a1a1a);
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-header h2 {
        margin: 0;
        color: var(--text-primary);
    }
    
    .close-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .modal-body p {
        margin-bottom: 1.5rem;
        color: var(--text-secondary);
    }
    
    .streaming-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .streaming-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid transparent;
        border-radius: 10px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        text-align: center;
        position: relative;
    }
    
    .streaming-btn:hover {
        border-color: var(--platform-color);
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    .streaming-btn.youtube-special {
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.05));
    }
    
    .streaming-btn.youtube-special:hover {
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.1));
        box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
    }
    
    .platform-icon {
        font-size: 2rem;
    }
    
    .platform-name {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .platform-desc {
        color: var(--text-secondary);
        font-size: 0.75rem;
        opacity: 0.8;
    }
    
    .modal-footer {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: center;
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
        
        .action-buttons {
            flex-direction: column;
        }
        
        .streaming-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }
        
        .modal-content {
            width: 95%;
            margin: 1rem;
        }
    }
</style>