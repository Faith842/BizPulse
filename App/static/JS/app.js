// app.js

import { performOfflineOperation, SALES_STORE, EXPENSES_STORE, STOCK_STORE } from './localdb.js';

// --- 1. Service Worker Registration (Usually in base.html, but included here for completeness) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js', { scope: '/' })
        .then(registration => {
            console.log('Service Worker Registered');
            window.SW_REGISTRATION = registration; 
        })
        .catch(error => console.error('SW registration failed:', error));
}


// --- 2. Universal Form Submission Handler ---
// This example targets an expense form, but the pattern is the same for Sales/Stock.

document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expenseData = Object.fromEntries(formData.entries()); 
    
    // Flask API endpoint for adding an expense
    const endpoint = '/record/addrecord'; 
    const method = 'POST'; // Assuming this is a new expense

    try {
        // 1. Perform the operation: Save to IndexedDB and Queue for sync
        await performOfflineOperation(EXPENSES_STORE, method, expenseData, endpoint);

        // 2. Register Background Sync
        if (window.SW_REGISTRATION && 'sync' in window.SW_REGISTRATION) {
             await window.SW_REGISTRATION.sync.register('universal-sync'); 
        }

        document.getElementById('status-message').innerHTML = 
            '✅ Expense saved! Local record created and sync registered for when you go online.';
        e.target.reset();

    } catch (error) {
        document.getElementById('status-message').innerHTML = 
            '❌ An error occurred while saving locally. Please check your browser console.';
        console.error("Offline operation failed:", error);
    }
});


// --- Helper for Network Check (Optional for better user feedback) ---
async function isServerReachable() {
    try {
        // Ping a lightweight, non-cached Flask endpoint
        const response = await fetch('/api/healthcheck', { 
            method: 'HEAD', 
            cache: 'no-store'
        });
        return response.ok; 
    } catch (error) {
        return false;
    }
}