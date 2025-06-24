<!-- src/lib/components/ThemeToggle.svelte -->
<script>
  import { theme } from '$lib/stores/theme';
  
  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }
</script>

<button on:click={toggleTheme} aria-label="Toggle theme" class="theme-toggle">
  {#if $theme === 'light'}
    🌙 Dark
  {:else}
    ☀️ Light
  {/if}
</button>

<style>
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.2s ease;
  }
  
  .theme-toggle:hover {
    opacity: 0.8;
  }
</style>