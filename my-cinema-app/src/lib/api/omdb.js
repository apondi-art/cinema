export const getMovieDetails = async (imdbId) => {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${imdbId}`
  );
  if (!res.ok) throw new Error(`OMDB Error: ${res.status}`);
  return res.json();
};