# Cinema App

A modern, responsive cinema application built with SvelteKit that allows users to discover, search, and manage their favorite movies and TV shows. The app integrates with The Movie Database (TMDB) and OMDb APIs to provide comprehensive entertainment content.


##  Features

###  Content Discovery
- **Search Movies & TV Shows**: Real-time search with autocomplete suggestions
- **Trending Content**: Daily trending movies and popular TV shows
- **Genre Browsing**: Browse content by specific genres
- **Detailed Information**: Comprehensive movie/TV show details with cast, ratings, and streaming availability

###  User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preference storage
- **Watchlist Management**: Add/remove items from personal watchlist with watched status tracking
- **Streaming Integration**: Direct links to popular streaming platforms

### Technical Features
- **Server-Side Rendering**: Fast initial page loads with SvelteKit
- **Progressive Enhancement**: Works without JavaScript enabled
- **Local Storage**: Persistent theme and watchlist preferences
- **Error Handling**: Graceful error handling with user-friendly messages


## Quick Start

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/apondi-art/cinema.git
   cd cinema
   cd my-cinema-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_OMDB_API_KEY=your_omdb_api_key_here
 
   ```

   **Getting API Keys:**
   - **TMDB API**: Register at [themoviedb.org](https://www.themoviedb.org/settings/api)
   - **OMDb API**: Get your key at [omdbapi.com](http://www.omdbapi.com/apikey.aspx)

4. **Start development server**
   ```bash
   npm run dev
   # or start and open in browser
   npm run dev -- --open
   ```

## 🛠️ Development


## 📁 Project Structure

```
my-cinema-app/
├── 📁 src/                          # Source code
│   ├── 📁 lib/                      # Shared libraries and utilities
│   │   ├── 📁 api/                  # API integration modules
│   │   │   ├── 📁 genres/           # Genre API endpoints
│   │   │   │   └── +server.js       # Server-side genre API
│   │   │   ├── tmdb.js              # TMDB API functions
│   │   │   └── omdb.js              # OMDb API functions
│   │   ├── 📁 components/           # Reusable Svelte components
│   │   │   ├── MovieCard.svelte     # Movie/TV show card component
│   │   │   ├── MovieDetail.svelte   # Detailed view component
│   │   │   ├── SearchBar.svelte     # Search input component
│   │   │   └── ThemeToggle.svelte   # Theme switcher component
│   │   ├── 📁 stores/               # Svelte stores for state management
│   │   │   ├── genres.js            # Genre data store
│   │   │   ├── theme.js             # Theme preference store
│   │   │   └── watchlist.js         # Watchlist management store
│   │   └── index.js                 # Library exports
│   ├── 📁 routes/                   # SvelteKit routes (pages)
│   │   ├── +layout.svelte           # Root layout component
│   │   ├── +page.svelte             # Home page
│   │   ├── 📁 genre/                # Genre browsing pages
│   │   │   ├── +page.svelte         # Genre listing page
│   │   │   └── 📁 [id]/             # Dynamic genre pages
│   │   │       ├── +page.server.js  # Server-side data loading
│   │   │       └── +page.svelte     # Genre detail page
│   │   ├── 📁 movie/                # Movie pages
│   │   │   ├── 📁 [id]/             # Dynamic movie pages
│   │   │   │   ├── +page.js         # Client-side data loading
│   │   │   │   └── +page.svelte     # Movie detail page
│   │   │   └── 📁 trending/         # Trending movies
│   │   │       ├── +page.server.js  # Server-side data loading
│   │   │       └── +page.svelte     # Trending movies page
│   │   ├── 📁 search/               # Search functionality
│   │   │   └── +page.svelte         # Search page
│   │   ├── 📁 tv/                   # TV show pages
│   │   │   ├── 📁 [id]/             # Dynamic TV show pages
│   │   │   │   ├── +page.js         # Client-side data loading
│   │   │   │   └── +page.svelte     # TV show detail page
│   │   │   └── 📁 popular/          # Popular TV shows
│   │   │       ├── +page.server.js  # Server-side data loading
│   │   │       └── +page.svelte     # Popular TV shows page
│   │   └── 📁 watchlist/            # Watchlist management
│   │       └── +page.svelte         # Watchlist page
│   ├── app.css                      # Global styles
│   ├── app.html                     # HTML template
│   └── demo.spec.js                 # Demo test file
├── 📁 static/                       # Static assets
│   └── favicon.png                  # App favicon
├── 📁 e2e/                          # End-to-end tests
│   └── demo.test.js                 # E2E test examples
├── 📁 node_modules/                 # Dependencies (auto-generated)
├── .env                             # Environment variables (create this)
├── .gitignore                       # Git ignore rules
├── .npmrc                           # npm configuration
├── .prettierignore                  # Prettier ignore rules
├── .prettierrc                      # Prettier configuration
├── eslint.config.js                 # ESLint configuration
├── jsconfig.json                    # JavaScript configuration
├── package.json                     # Project dependencies and scripts
├── package-lock.json                # Dependency lock file
├── playwright.config.js             # Playwright test configuration
├── svelte.config.js                 # Svelte configuration
├── vite.config.js                   # Vite build configuration
├── vitest-setup-client.js           # Vitest client setup
└── README.md                        # This file
```

## 🎨 Adding Images and Assets

### Static Assets
Place images and other static assets in the `static/` directory:

```
static/
├── favicon.png                      # App icon
├── images/                          # Image assets
│   ├── logo.png                     # App logo
│   ├── placeholder-movie.jpg        # Movie placeholder
│   └── backgrounds/                 # Background images
│       ├── hero-bg.jpg              # Hero section background
│       └── pattern.svg              # Pattern overlays
├── icons/                           # Icon assets
│   ├── play.svg                     # Play button icon
│   ├── heart.svg                    # Favorite icon
│   └── search.svg                   # Search icon
└── fonts/                           # Custom fonts (if needed)
    └── custom-font.woff2
```

### Using Images in Components

**In Svelte components:**
```svelte
<script>
  // Import from static directory (no /static prefix needed)
  const logoSrc = '/images/logo.png';
</script>

<img src={logoSrc} alt="Cinema App Logo" />

<!-- Or directly -->
<img src="/images/hero-bg.jpg" alt="Hero Background" />
```

**In CSS:**
```css
.hero {
  background-image: url('/images/backgrounds/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}

.icon {
  background-image: url('/icons/play.svg');
}
```

### Dynamic Images from APIs
The app automatically handles movie posters and backdrops from TMDB:

```svelte
<script>
  // TMDB image URLs are constructed in components
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  $: posterUrl = movie.poster_path
    ? `${imageBaseUrl}${movie.poster_path}`
    : '/images/placeholder-movie.jpg';
</script>

<img src={posterUrl} alt={movie.title} />
```

## 🔌 API Integration

### TMDB API Functions (`src/lib/api/tmdb.js`)

```javascript
// Movie operations
getMovieDetails(movieId)          // Get detailed movie information
getTVDetails(tvId)                // Get detailed TV show information
searchMovies(query, page)         // Search movies and TV shows
getPopularMovies(page)            // Get popular movies
getPopularTVShows(page)           // Get popular TV shows
getTrendingMovies()               // Get daily trending movies
```

### OMDb API Functions (`src/lib/api/omdb.js`)

```javascript
getOmdbDetails(imdbId)            // Get additional movie details from OMDb
```

### Server-Side API Routes

**Genre API** (`src/lib/api/genres/+server.js`):
- `GET /api/genres` - Returns combined movie and TV genres

### API Usage Examples

**Fetching movie details:**
```javascript
import { getMovieDetails } from '$lib/api/tmdb';

const movie = await getMovieDetails(550); // Fight Club
console.log(movie.title, movie.overview);
```

**Searching content:**
```javascript
import { searchMovies } from '$lib/api/tmdb';

const results = await searchMovies('inception');
console.log(results.results); // Array of search results
```

## 🗃️ State Management

### Stores Overview

The app uses Svelte stores for state management with localStorage persistence:

#### Theme Store (`src/lib/stores/theme.js`)
```javascript
import { theme } from '$lib/stores/theme';

// Usage in components
$theme                            // Current theme ('light' or 'dark')
theme.set('dark')                 // Set theme
theme.update(t => t === 'light' ? 'dark' : 'light') // Toggle theme
```

#### Watchlist Store (`src/lib/stores/watchlist.js`)
```javascript
import { watchlist } from '$lib/stores/watchlist';

// Usage in components
$watchlist                        // Array of watchlist items
watchlist.add(movieObject)        // Add movie/TV show to watchlist
watchlist.remove(movieId)         // Remove item from watchlist
watchlist.update(updaterFunction) // Update watchlist items
```

#### Genres Store (`src/lib/stores/genres.js`)
```javascript
import { genres, fetchGenres, getGenreName } from '$lib/stores/genres';

await fetchGenres()               // Load genres from API
$genres                           // Array of genre objects
const genreName = getGenreName(28) // Get genre name by ID
```

### Store Data Structures

**Watchlist Item:**
```javascript
{
  id: 550,                        // TMDB ID
  title: "Fight Club",            // Movie/TV show title
  poster_path: "/path.jpg",       // Poster image path
  media_type: "movie",            // "movie" or "tv"
  release_date: "1999-10-15",     // Release date
  watched: false                  // Watched status
}
```

**Genre Object:**
```javascript
{
  id: 28,                         // Genre ID
  name: "Action"                  // Genre name
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env



```

### SvelteKit Configuration (`svelte.config.js`)

```javascript
import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter()              // Static site generation
  }
};
```

### Vite Configuration (`vite.config.js`)

The project includes comprehensive testing setup:
- **Client tests**: Svelte component tests with jsdom
- **Server tests**: Node.js environment tests
- **E2E tests**: Playwright browser tests

### ESLint Configuration (`eslint.config.js`)

Configured with:
- Svelte-specific linting rules
- Prettier integration
- Modern JavaScript standards







### Writing Tests

**Unit Test Example:**
```javascript
// src/lib/components/MovieCard.svelte.test.js
import { render, screen } from '@testing-library/svelte';
import MovieCard from './MovieCard.svelte';

test('renders movie title', () => {
  const movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg'
  };

  render(MovieCard, { movie });
  expect(screen.getByText('Test Movie')).toBeInTheDocument();
});
```

**E2E Test Example:**
```javascript
// e2e/search.test.js
import { test, expect } from '@playwright/test';

test('search functionality works', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'inception');
  await page.click('[data-testid="search-button"]');
  await expect(page.locator('.movie-card')).toBeVisible();
});
```

## Deployment

### Static Site Generation

The app is configured for static site generation using `@sveltejs/adapter-static`:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```



### Environment Variables for Production

Ensure these are set in your deployment platform:
```env
VITE_TMDB_API_KEY=your_production_tmdb_key
VITE_OMDB_API_KEY=your_production_omdb_key

```

## 🔧 Troubleshooting

### Common Issues

**API Key Errors:**
```
Error: Failed to fetch movie details
```
- Verify API keys are correctly set in `.env`
- Check API key permissions and quotas
- Ensure environment variables are loaded

**Build Errors:**
```
Error: Cannot resolve module
```
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run prepare`

**Styling Issues:**
- Ensure CSS custom properties are defined in `app.css`
- Check browser compatibility for CSS features
- Verify theme store is properly initialized

### Development Tips

1. **Hot Reload Issues**: Restart dev server if hot reload stops working
2. **API Rate Limits**: Implement caching for API calls in production
3. **Image Loading**: Add loading states for better UX
4. **Error Boundaries**: Implement error boundaries for robust error handling

##  Writing New Features

### Adding a New Page

1. **Create route file**: `src/routes/new-page/+page.svelte`
2. **Add data loading** (if needed): `src/routes/new-page/+page.js` or `+page.server.js`
3. **Update navigation**: Add links in `+layout.svelte`
4. **Write tests**: Create corresponding test files

### Adding a New Component

1. **Create component**: `src/lib/components/NewComponent.svelte`
2. **Export from lib**: Add to `src/lib/index.js`
3. **Write tests**: `src/lib/components/NewComponent.svelte.test.js`
4. **Document props**: Add JSDoc comments for props

### Adding a New Store

1. **Create store file**: `src/lib/stores/newStore.js`
2. **Implement persistence**: Add localStorage integration if needed
3. **Export from lib**: Add to `src/lib/index.js`
4. **Write tests**: Test store functionality

### API Integration

1. **Add API functions**: Extend `src/lib/api/tmdb.js` or create new API file
2. **Handle errors**: Implement proper error handling
3. **Add types**: Document expected response structures
4. **Test API calls**: Mock API responses in tests

##  Contributing

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/new-feature`
5. Make changes and test: `npm run test`
6. Format code: `npm run format`
7. Commit changes: `git commit -m "Add new feature"`
8. Push to fork: `git push origin feature/new-feature`
9. Create pull request

### Code Standards

- **Formatting**: Use Prettier (run `npm run format`)
- **Linting**: Follow ESLint rules (run `npm run lint`)
- **Testing**: Write tests for new features
- **Documentation**: Update README for significant changes
- **Commits**: Use conventional commit messages

### Pull Request Guidelines

- Describe changes clearly in PR description
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused and atomic

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

##  Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [OMDb API](http://www.omdbapi.com/) for additional movie information
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Vite](https://vitejs.dev/) for fast development experience
- [Playwright](https://playwright.dev/) for reliable E2E testing

