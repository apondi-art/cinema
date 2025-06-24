<script>
 export let movie;
 
// Define placeholder once at the top
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent('<svg width="300" height="450" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0" stroke="#ddd"/><text x="150" y="225" text-anchor="middle" font-size="16" fill="#999">No Image</text></svg>')}`;

// Safely get full poster URL with fallback
const getPosterUrl = (path) => {
return path
 ? `https://image.tmdb.org/t/p/w500${path}`
 : PLACEHOLDER;
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
on:error={(e) => { if (e.target.src !== PLACEHOLDER) e.target.src = PLACEHOLDER; }}
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

<style>
.movie-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  background: white;
}

.movie-card:hover {
  transform: translateY(-2px);
}

.movie-poster {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.movie-info {
  padding: 12px;
}

.movie-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 1.2;
  color: #333;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.rating {
  font-weight: 500;
  color: #007bff;
}
</style>