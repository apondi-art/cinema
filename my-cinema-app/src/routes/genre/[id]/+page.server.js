// src/routes/genre/[id]/+page.server.js
export async function load({ params }) {
  const genreId = params.id;
  
  // Fetch movies for this genre from your API
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY&with_genres=${genreId}`);
  const genreMovies = await response.json();

  return {
    props: {
      genreMovies,
      params: { id: genreId }
    }
  };
}