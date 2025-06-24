<script>
  import { goto } from '$app/navigation';
  
  export let query = '';
  
  const handleSearch = () => {
    if (query.trim()) {
      goto(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
</script>

<div class="search-container">
  <input
    type="text"
    placeholder="Search movies and TV shows..."
    bind:value={query}
    on:keydown={handleKeydown}
    class="search-input"
  />
  <button 
    type="button"
    on:click={handleSearch}
    class="search-button"
    aria-label="Search"
  >
    🔍
  </button>
</div>

<style>
  .search-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 600px;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #1a1a1a;
    color: white;
    font-size: 1rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #e50914;
  }
  
  .search-input::placeholder {
    color: #666;
  }
  
  .search-button {
    padding: 0.75rem 1rem;
    background-color: #e50914;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background-color: #b20710;
  }
</style>