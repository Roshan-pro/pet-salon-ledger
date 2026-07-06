/**
 * main.js
 * ---------------------------------------------------------------------
 * Application entry point. This is the only file that knows about every
 * other module — its job is wiring, not logic. It bootstraps the app,
 * loads data, and connects each UI module's callbacks to the shared
 * Store + Renderer, so individual modules never need to import each
 * other's controllers directly.
 * ---------------------------------------------------------------------
 */

import { Store } from './core/store.js';
import { applyFilters } from './core/filter-engine.js';
import { fetchServices } from './services/api.js';
import { ping } from './utils/analytics.js';

import { initConnectionIndicator, setConnectionState } from './ui/connection-indicator.js';
import { renderSkeleton, renderError, renderServices, renderQuote } from './ui/renderer.js';
import { initTabs } from './ui/tabs.js';
import { initQuoteController } from './ui/quote-controller.js';
import { initFormController } from './ui/form-controller.js';

/** Re-renders the grid from whatever filters/size are currently active. */
function refreshServiceGrid() {
  const filtered = applyFilters(
    Store.getAllServices(),
    Store.getActiveCategory(),
    Store.getSearchTerm(),
  );
  renderServices(filtered, Store.getPetSize());
}

/** Simple debounce so search doesn't re-render on every keystroke. */
function debounce(fn, waitMs) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), waitMs);
  };
}

/** Loads the service catalog, with a retry-capable error path. */
async function loadServices() {
  renderSkeleton();
  setConnectionState('syncing');
  try {
    const services = await fetchServices();
    Store.setAllServices(services);
    setConnectionState('online');
    refreshServiceGrid();
  } catch (err) {
    setConnectionState('offline');
    renderError(err.message, loadServices);
  }
}

/** Binds the pet-size selector and search input. */
function bindControls() {
  document.getElementById('pet-size').addEventListener('change', (event) => {
    Store.setPetSize(event.target.value);
    ping('pet size changed', event.target.value);
    refreshServiceGrid();
  });

  const searchInput = document.getElementById('service-search');
  const debouncedSearch = debounce((value) => {
    Store.setSearchTerm(value);
    ping('service search', value || '(cleared)');
    refreshServiceGrid();
  }, 180);
  searchInput.addEventListener('input', (event) => debouncedSearch(event.target.value));
}

function init() {
  initConnectionIndicator();
  initTabs((category) => {
    Store.setActiveCategory(category);
    ping('category filter changed', category);
    refreshServiceGrid();
  });
  initQuoteController();
  initFormController();
  bindControls();

  renderQuote(Store.getQuote());
  loadServices();
}

document.addEventListener('DOMContentLoaded', init);