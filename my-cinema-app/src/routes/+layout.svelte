<script>
	import { theme } from '$lib/stores/theme';
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	
	// `url` is passed as a prop to this component
	export let url;

	// This reactive statement updates `currentPath` whenever `url` changes.
	// If `url` is not defined, it defaults to '/'
	$: currentPath = url?.pathname || '/';

	// Helper function to check if a path is active
	const isActive = (path) => {
		if (path === '/') {
			// Home is only active for exact match
			return currentPath === '/';
		}
		// Other paths are active if current path starts with them
		return currentPath.startsWith(path);
	};
</script>

<!-- Header section of the page -->
<header class="header">
	<nav class="nav-container">
		<!-- Logo that links to the home page -->
		<a href="/" class="logo">Cinema</a>

		<!-- Navigation links -->
		<ul class="nav-links">
			<li>
				<!-- Highlights 'Home' only when currentPath is exactly '/' -->
				<a href="/" class={isActive('/') ? 'active' : ''}>Home</a>
			</li>
			<li>
				<!-- Highlights 'Search' when currentPath starts with '/search' -->
				<a href="/search" class={isActive('/search') ? 'active' : ''}>Search</a>
			</li>
			<li>
				<!-- Highlights 'Watchlist' when currentPath starts with '/watchlist' -->
				<a href="/watchlist" class={isActive('/watchlist') ? 'active' : ''}>Watchlist</a>
			</li>
		</ul>

		<!-- Add ThemeToggle component here -->
		<ThemeToggle />
	</nav>
</header>

<!-- Main content area; will show whatever is placed in this layout's <slot /> -->
<main class="container">
	<slot />
</main>

<svelte:head>
  <style>
    :root.light {
      --color-bg: #f8f9fa;
      --color-text: #212529;
      --color-card: #ffffff;
      --color-header: rgba(255, 255, 255, 0.9);
      --color-border: rgba(0, 0, 0, 0.1);
    }
    
    :root.dark {
      --color-bg: #0a0a0a;
      --color-text: #f5f5f5;
      --color-card: rgba(30, 30, 30, 0.9);
      --color-header: rgba(0, 0, 0, 0.9);
      --color-border: rgba(255, 255, 255, 0.1);
    }
    
    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .header {
      background-color: var(--color-header);
    }
    
    .movie-card {
      background-color: var(--color-card);
      border-color: var(--color-border);
    }
  </style>
</svelte:head>