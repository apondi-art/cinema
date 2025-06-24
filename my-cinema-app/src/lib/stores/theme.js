import { writable } from 'svelte/store';

export const theme = writable('light');

// Load saved theme from localStorage
if (typeof localStorage !== 'undefined') {
	const saved = localStorage.getItem('theme');
	if (saved) theme.set(saved);
}

// Save theme to localStorage whenever it changes
theme.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('theme', value);
	}
});
