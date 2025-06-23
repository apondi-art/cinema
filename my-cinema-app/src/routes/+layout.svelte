<script>
    // Import the global CSS styles
    import '../app.css';

    // `url` is passed as a prop to this component
    export let url;

    // This reactive statement updates `currentPath` whenever `url` changes.
    // If `url` is not defined, it defaults to '/'
    $: currentPath = url?.pathname || '/';
</script>

<!-- Header section of the page -->
<header class="header">
    <nav class="nav-container">
        <!-- Logo that links to the home page -->
        <a href="/" class="logo">CineDiscover</a>

        <!-- Navigation links -->
        <ul class="nav-links">
            <li>
                <!-- Highlights 'Home' when currentPath is '/' -->
                <a href="/" class={currentPath === '/' ? 'active' : ''}>Home</a>
            </li>
            <li>
                <!-- Highlights 'Search' when currentPath is '/search' -->
                <a href="/search" class={currentPath === '/search' ? 'active' : ''}>Search</a>
            </li>
            <li>
                <!-- Highlights 'Watchlist' when currentPath is '/watchlist' -->
                <a href="/watchlist" class={currentPath === '/watchlist' ? 'active' : ''}>Watchlist</a>
            </li>
        </ul>
    </nav>
</header>

<!-- Main content area; will show whatever is placed in this layout's <slot /> -->
<main class="container">
    <slot />
</main>
