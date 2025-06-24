// src/lib/stores/genres.js
import { writable, derived } from 'svelte/store';

export const genres = writable([]);
export const isLoading = writable(false);
export const error = writable(null);

export async function fetchGenres() {
	isLoading.set(true);
	error.set(null);
	try {
		const res = await fetch('/api/genres');
		if (!res.ok) throw new Error('Failed to load genres');
		const data = await res.json();
		genres.set(data);
	} catch (err) {
		error.set(err.message);
	} finally {
		isLoading.set(false);
	}
}

export function getGenreName(id) {
	return derived(genres, $genres => {
		const found = $genres.find(g => g.id === id);
		return found?.name || 'Unknown';
	});
}

export async function getPopularGenres() {
	return new Promise(resolve => {
		const unsubscribe = genres.subscribe($genres => {
			if ($genres.length > 0) {
				resolve($genres.slice(0, 6));
				unsubscribe();
			}
		});
	});
}
