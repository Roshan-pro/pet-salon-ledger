/**
 * ui/connection-indicator.js
 * ---------------------------------------------------------------------
 * Owns the small "online / offline / syncing" dot in the header. Reacts
 * to real browser connectivity events plus manual state pushes from
 * whatever module is currently making a simulated network call.
 * ---------------------------------------------------------------------
 */

const STATE_LABELS = {
  online: 'Ledger synced',
  offline: 'Offline — showing last known rates',
  syncing: 'Syncing ledger…',
};

let dotEl = null;
let textEl = null;

/**
 * Pushes a new connection state to the indicator.
 * @param {'online'|'offline'|'syncing'} state
 */
export function setConnectionState(state) {
  if (!dotEl || !textEl) return;
  dotEl.dataset.state = state;
  textEl.textContent = STATE_LABELS[state] || STATE_LABELS.online;
}

/** Wires up DOM refs and browser connectivity listeners. */
export function initConnectionIndicator() {
  dotEl = document.querySelector('.status-dot');
  textEl = document.querySelector('.status-text');
  setConnectionState(navigator.onLine === false ? 'offline' : 'online');
  window.addEventListener('online', () => setConnectionState('online'));
  window.addEventListener('offline', () => setConnectionState('offline'));
}