/**
 * ui/quote-controller.js
 * ---------------------------------------------------------------------
 * Wires up the "Add to quote" / "Remove" / "Clear quote" interactions.
 * Talks to the Store for state and the Renderer for redraw, and reports
 * every action through Analytics — but owns no DOM structure itself.
 * ---------------------------------------------------------------------
 */

import { Store } from '../core/store.js';
import { resolvePrice } from '../core/pricing.js';
import { renderQuote } from './renderer.js';
import { ping } from '../utils/analytics.js';

function addServiceToQuote(serviceId) {
  const service = Store.getAllServices().find((s) => s.id === serviceId);
  if (!service) return;

  const size = Store.getPetSize();
  const amount = resolvePrice(service, size);
  const item = Store.addQuoteItem({
    serviceId: service.id,
    name: service.name,
    price: amount,
    size: service.pricesBySize ? size : null,
  });

  renderQuote(Store.getQuote());
  ping('service added to quote', item.name);
}

function removeServiceFromQuote(cartId) {
  Store.removeQuoteItem(cartId);
  renderQuote(Store.getQuote());
  ping('service removed from quote', cartId);
}

function clearQuote() {
  Store.clearQuote();
  renderQuote(Store.getQuote());
  ping('quote cleared');
}

/** Wires up event delegation for the grid, quote list, and clear button. */
export function initQuoteController() {
  document.getElementById('services-grid').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-service-id]');
    if (btn) addServiceToQuote(btn.dataset.serviceId);
  });

  document.getElementById('quote-list').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-cart-id]');
    if (btn) removeServiceFromQuote(btn.dataset.cartId);
  });

  document.getElementById('clear-quote').addEventListener('click', clearQuote);
}