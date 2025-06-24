<script>
	// Import the global CSS styles
	import '../app.css';
	
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
		<a href="/" class="logo">CineDiscover</a>
		
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
	</nav>
</header>

<!-- Main content area; will show whatever is placed in this layout's <slot /> -->
<main class="container">
	<slot />
</main>