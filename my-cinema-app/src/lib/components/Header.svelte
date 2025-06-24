<script>
  import { page } from '$app/stores';
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/watchlist', label: 'Watchlist' }
  ];
</script>

<header class="header">
  <nav class="nav-container">
    <a href="/" class="logo">CineDiscover</a>
    <ul class="nav-links">
      {#each navItems as item}
        <li>
          <a 
            href={item.path} 
            class={$page.url.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>