// sw.js 
// Note: This must be accessible from the root scope, typically by placing it in static/

// Import the IndexedDB logic so the Service Worker can access it
// The path must be relative to the Service Worker's location (static/)
importScripts('/static/js/localdb.js'); 

const CACHE_NAME = 'accounting-app-v3';
const urlsToCache = [
    '/', 
    '/index.html',
    '/styles.css',
    '/static/js/app.js',
    '/static/js/localdb.js' 
    // Add all static assets needed to run the app shell
];

// --- 1. Installation: Cache the App Shell ---
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache).catch(e => console.error("Failed to cache all:", e)))
    );
});

// --- 2. Fetch: Serve from Cache First ---
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    return response; // Cache hit
                }
                return fetch(event.request); // Cache miss, go to network
            })
        );
    }
});

// --- 3. Background Sync: Universal Sync Handler ---
self.addEventListener('sync', event => {
    if (event.tag === 'universal-sync') {
        console.log('Service Worker: Universal sync event triggered.');
        event.waitUntil(syncQueuedData());
    }
});

async function syncQueuedData() {
    try {
        const unsyncedActions = await getUnsyncedActions(); 
        if (unsyncedActions.length === 0) {
            console.log('Sync complete, no actions in the queue.');
            return;
        }

        console.log(`Attempting to sync ${unsyncedActions.length} queued records...`);

        for (const action of unsyncedActions) {
            try {
                const response = await fetch(action.endpoint, {
                    method: action.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(action.data)
                });

                if (response.ok) {
                    const serverResponse = await response.json();
                    
                    // On successful POST, the server returns the new official ID
                    if (action.method === 'POST' && serverResponse.id) {
                        await updateLocalRecord(action.store, action.tempId, serverResponse.id);
                    }
                    
                    await clearSyncedAction(action.id);
                    console.log(`Action (ID: ${action.id}) synced successfully.`);
                } else {
                    console.warn(`Server Error syncing action ID ${action.id}: ${response.status}`);
                    // Leave in queue for retry if it's a transient server issue.
                }
            } catch (networkError) {
                console.warn(`Network failure during sync for action ID ${action.id}. Retrying later.`);
                // Throwing the error tells the browser to schedule a retry
                throw networkError; 
            }
        }
    } catch (error) {
        console.error('Fatal error during sync process:', error);
        throw error; 
    }
}