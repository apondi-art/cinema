// src/routes/api/genres/+server.js
import { TMDB_API_KEY } from '$env/static/private';

export async function GET() {
	try {
		const [movieRes, tvRes] = await Promise.all([
			fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`),
			fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`)
		]);

		const movieGenres = (await movieRes.json()).genres;
		const tvGenres = (await tvRes.json()).genres;

		const all = [...movieGenres, ...tvGenres];
		const unique = all.filter((g, i, arr) => arr.findIndex(x => x.id === g.id) === i);

		return new Response(JSON.stringify(unique), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch genres' }), { status: 500 });
	}
}
