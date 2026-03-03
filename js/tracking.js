// js/tracking.js
import { generarIdUnico } from './utils.js';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBF0n3GK3vhvL7OZacTq8wZEd_-wZWbXhwEeLUyWG44bSKhNioB1LzNoFQr8YMZcxXKA/exec';

/**
 * Enregistre une visite dans Google Sheets
 */
export function registrarVisita() {
    let userId = localStorage.getItem('visitor_id');
    if (!userId) {
        userId = generarIdUnico();
        localStorage.setItem('visitor_id', userId);
    }
    let visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
    localStorage.setItem('visit_count', visitCount);

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            type: 'visit',
            userId: userId,
            page: window.location.pathname,
            visitCount: visitCount
        })
    }).catch(err => console.error('Error tracking visit:', err));
}
