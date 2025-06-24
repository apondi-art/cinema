<script>
	import { theme } from '$lib/stores/theme';
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	export let url;
	$: currentPath = url?.pathname || '/';

	const isActive = (path) => {
		if (path === '/') return currentPath === '/';
		return currentPath.startsWith(path);
	};

	// Apply theme to <html>
	$: {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add($theme);
		}
	}
</script>

<header class="header">
	<nav class="nav-container">
		<a href="/" class="logo">Cinema</a>
		<ul class="nav-links">
			<li><a href="/" class={isActive('/') ? 'active' : ''}>Home</a></li>
			<li><a href="/search" class={isActive('/search') ? 'active' : ''}>Search</a></li>
			<li><a href="/watchlist" class={isActive('/watchlist') ? 'active' : ''}>Watchlist</a></li>
		</ul>
		<ThemeToggle />
	</nav>
</header>

<main class="container">
	<slot />
</main>
