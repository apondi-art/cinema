<script>
  export let movie;
  
  // Safely get full poster URL with fallback
  const getPosterUrl = (path) => {
    return path 
      ? `https://image.tmdb.org/t/p/w500${path}`
      : '/placeholder-poster.jpg';
  };

  // Safely get release year
  const getReleaseYear = () => {
    if (movie.release_date) return movie.release_date.substring(0, 4);
    if (movie.first_air_date) return movie.first_air_date.substring(0, 4);
    return '';
  };

  // Safely get title with fallback
  const getTitle = () => movie.title || movie.name || 'Untitled';

  // Format rating if available
  const getRating = () => movie.vote_average ? movie.vote_average.toFixed(1) : null;
</script>

<div class="movie-card">
  <img 
    src={getPosterUrl(movie.poster_path)} 
    alt={getTitle()} 
    class="movie-poster"
    on:error={(e) => e.target.src = '/placeholder-poster.jpg'}
  />
  <div class="movie-info">
    <div class="movie-title">{getTitle()}</div>
    <div class="movie-meta">
      <span>{getReleaseYear()}</span>
      {#if getRating()}
        <span class="rating">{getRating()}</span>
      {/if}
    </div>
  </div>
</div>