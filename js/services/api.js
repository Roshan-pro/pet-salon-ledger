/**
 * services/api.js
 * ---------------------------------------------------------------------
 * Simulates the salon's backend. This is the ONLY file that would need
 * to change if a real API replaced the mock data — every other module
 * just calls fetchServices()/saveQuote() and reacts to success/failure.
 *
 * Artificial latency + a random failure rate are baked in on purpose, so
 * the "spotty 3G connection" requirement is actually exercised rather
 * than handled in theory only.
 * ---------------------------------------------------------------------
 */

import { SERVICES_DATA } from '../data/services-data.js';

const NETWORK_DELAY_MS = 900;
const SAVE_DELAY_MS = 700;
const SIMULATED_FAILURE_RATE = 0.12; // ~1 in 8 calls, to exercise retry paths

/**
 * Simulates GET /services.
 * @returns {Promise<Array>} resolves with a defensive copy of the catalog
 */
export function fetchServices() {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < SIMULATED_FAILURE_RATE) {
        reject(new Error('The connection dropped before the ledger could sync.'));
        return;
      }
      resolve(JSON.parse(JSON.stringify(SERVICES_DATA)));
    }, NETWORK_DELAY_MS);
  });
}

/**
 * Simulates POST /quotes — saving a client's quote to their file.
 * @param {object} payload - sanitized client details + quote line items
 * @returns {Promise<{savedAt: string, reference: string}>}
 */
export function saveQuote(payload) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < SIMULATED_FAILURE_RATE) {
        reject(new Error('The save was interrupted. Nothing was recorded.'));
        return;
      }
      void payload; // a real backend would persist this; the mock just echoes a reference
      resolve({
        savedAt: new Date().toISOString(),
        reference: `GP-${Math.floor(Math.random() * 90000 + 10000)}`,
      });
    }, SAVE_DELAY_MS);
  });
}