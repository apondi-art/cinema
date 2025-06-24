import { writable } from 'svelte/store';

function createWatchlist() {
    const { subscribe, set, update } = writable([]);
    
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('watchlist');
        if (stored) set(JSON.parse(stored));
    }
    
    return {
        subscribe,
        add: (item) => {
            update(items => {
                // Check if item already exists
                if (!items.some(i => i.id === item.id)) {
                    const newItems = [...items, item];
                    localStorage.setItem('watchlist', JSON.stringify(newItems));
                    return newItems;
                }
                return items;
            });
        },
        remove: (id) => {
            update(items => {
                const newItems = items.filter(i => i.id !== id);
                localStorage.setItem('watchlist', JSON.stringify(newItems));
                return newItems;
            });
        },
        update: (updater) => {
            update(items => {
                const newItems = updater(items);
                localStorage.setItem('watchlist', JSON.stringify(newItems));
                return newItems;
            });
        }
    };
}

export const watchlist = createWatchlist();