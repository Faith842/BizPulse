// localdb.js

const DB_NAME = 'AccountingAppDB';
const DB_VERSION = 1;
export const SALES_STORE = 'sales';
export const EXPENSES_STORE = 'expenses';
export const STOCK_STORE = 'stock';
export const SYNC_QUEUE_STORE = 'syncQueue'; // Universal queue

let db;

/**
 * Opens and initializes the IndexedDB database, creating all necessary object stores.
 */
export function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = event => {
            console.error('IndexedDB error:', event.target.errorCode);
            reject('Error opening DB');
        };

        request.onsuccess = event => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = event => {
            const db = event.target.result;
            // Create data stores with a client-side temporary ID (tempId)
            db.createObjectStore(SALES_STORE, { keyPath: 'tempId', autoIncrement: true });
            db.createObjectStore(EXPENSES_STORE, { keyPath: 'tempId', autoIncrement: true });
            db.createObjectStore(STOCK_STORE, { keyPath: 'tempId', autoIncrement: true });
            
            // Create the universal sync queue store
            db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
            console.log('Database setup complete.');
        };
    });
}

/**
 * Performs a CRUD operation locally and queues it for server sync.
 */
export async function performOfflineOperation(storeName, method, recordData, endpoint) {
    const db = await openDB();
    const tx = db.transaction([storeName, SYNC_QUEUE_STORE], 'readwrite');
    const dataStore = tx.objectStore(storeName);
    const syncQueueStore = tx.objectStore(SYNC_QUEUE_STORE);

    // Prepare metadata
    recordData.synced = false;
    recordData.timestamp = new Date().toISOString(); // For conflict resolution

    let tempId = recordData.tempId;

    if (method === 'POST') {
        // --- CREATE (POST) ---
        const addRequest = dataStore.add(recordData);
        addRequest.onsuccess = event => {
            tempId = event.target.result;
            // Queue the action
            syncQueueStore.add({
                method: method,
                store: storeName,      
                endpoint: endpoint,
                tempId: tempId,        
                data: { ...recordData, tempId: tempId } 
            });
        };
    } else {
        // --- UPDATE (PUT) or DELETE ---
        // For PUT/DELETE, recordData should already have the 'tempId' or 'server_id'
        // For simplicity, we assume we use 'tempId' for local lookups here.
        
        if (method === 'PUT') {
            await dataStore.put(recordData);
        } else if (method === 'DELETE') {
             await dataStore.delete(tempId); // Delete locally immediately
        }

        // Queue the action for the server
        syncQueueStore.add({
            method: method,
            store: storeName,      
            endpoint: endpoint,
            tempId: tempId,        
            data: recordData // Contains the data/ID needed for server action
        });
    }

    return tx.complete; 
}


// --- Functions used by the Service Worker ---

export async function getUnsyncedActions() {
    const db = await openDB();
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
    });
}

export async function clearSyncedAction(id) {
    const db = await openDB();
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    store.delete(id);
    return tx.complete;
}

/**
 * Updates the local record with the official server ID after successful sync.
 */
export async function updateLocalRecord(storeName, tempId, serverId) {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    const getRequest = store.get(tempId);
    getRequest.onsuccess = event => {
        const record = event.target.result;
        if (record) {
            record.synced = true;
            record.server_id = serverId;
            
            // To prevent conflicts, remove the old tempId record and re-add 
            // with a preference for the server_id as the new identifier
            
            // Simplified: Just update the existing record
            store.put(record); 
        }
    };
    return tx.complete;
}