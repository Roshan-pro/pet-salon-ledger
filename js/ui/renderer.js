/**
 * ui/renderer.js
 * ---------------------------------------------------------------------
 * Every DOM write for the services grid and the quote panel lives here.
 * Dynamic text is always set via textContent (never innerHTML with
 * unescaped data), so this module is also the second line of defense
 * against XSS, after utils/sanitize.js.
 * ---------------------------------------------------------------------
 */

import { resolvePrice, formatCurrency } from '../core/pricing.js';

const grid = document.getElementById('services-grid');
const statusEl = document.getElementById('services-status');
const panel = document.getElementById('panel-services');
const quoteListEl = document.getElementById('quote-list');
const quoteTotalEl = document.getElementById('quote-total');

function announce(message) {
  if (statusEl) statusEl.textContent = message;
}

/** Shows shimmering placeholder cards while services are loading. */
export function renderSkeleton() {
  panel.setAttribute('aria-busy', 'true');
  grid.innerHTML = '';
  for (let i = 0; i < 6; i += 1) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<div class="skeleton-bar" style="width:60%"></div><div class="skeleton-bar" style="width:90%"></div><div class="skeleton-bar" style="width:40%"></div>';
    grid.appendChild(card);
  }
  announce('Loading today’s service rates…');
}

/**
 * Shows a retry-capable error panel in place of the grid.
 * @param {string} message
 * @param {Function} onRetry
 */
export function renderError(message, onRetry) {
  panel.setAttribute('aria-busy', 'false');
  grid.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'state-panel';

  const heading = document.createElement('h3');
  heading.textContent = 'The ledger couldn’t load';

  const body = document.createElement('p');
  body.textContent = message || 'Check the connection and try again.';

  const retryBtn = document.createElement('button');
  retryBtn.className = 'btn btn-primary';
  retryBtn.type = 'button';
  retryBtn.textContent = 'Retry';
  retryBtn.addEventListener('click', onRetry);

  wrap.append(heading, body, retryBtn);
  grid.appendChild(wrap);
  announce('The ledger failed to load. A retry option is available.');
}

function renderEmpty() {
  grid.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'state-panel';

  const heading = document.createElement('h3');
  heading.textContent = 'No services match that search';

  const body = document.createElement('p');
  body.textContent = 'Try a different term or switch categories above.';

  wrap.append(heading, body);
  grid.appendChild(wrap);
  announce('No matching services found.');
}

function buildServiceCard(service, size) {
  const card = document.createElement('article');
  card.className = 'service-card';

  const categoryLabel = document.createElement('p');
  categoryLabel.className = 'service-card-cat';
  categoryLabel.textContent = service.category === 'dog'
    ? 'Dog Grooming'
    : service.category === 'cat' ? 'Cat Grooming' : 'Spa & Add-on';

  const title = document.createElement('h3');
  title.textContent = service.name;

  const desc = document.createElement('p');
  desc.className = 'service-card-desc';
  desc.textContent = service.description;

  const divider = document.createElement('hr');
  divider.className = 'ticket-divider';

  const footer = document.createElement('div');
  footer.className = 'service-card-footer';

  const priceEl = document.createElement('p');
  priceEl.className = 'service-price';
  const amount = resolvePrice(service, size);
  priceEl.textContent = formatCurrency(amount);
  if (service.pricesBySize) {
    const sizeNote = document.createElement('small');
    sizeNote.textContent = `${size} pet`;
    priceEl.appendChild(sizeNote);
  }
  footer.appendChild(priceEl);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-add';
  addBtn.type = 'button';
  addBtn.dataset.serviceId = service.id;
  addBtn.setAttribute('aria-label', `Add ${service.name} at ${formatCurrency(amount)} to the client quote`);
  addBtn.textContent = 'Add to quote';

  card.append(categoryLabel, title, desc, divider, footer, addBtn);
  return card;
}

/**
 * Renders the filtered service list, or an empty state if it's empty.
 * @param {Array} list
 * @param {string} size
 */
export function renderServices(list, size) {
  panel.setAttribute('aria-busy', 'false');
  grid.innerHTML = '';
  if (!list.length) {
    renderEmpty();
    return;
  }
  const fragment = document.createDocumentFragment();
  list.forEach((service) => fragment.appendChild(buildServiceCard(service, size)));
  grid.appendChild(fragment);
  announce(`Showing ${list.length} service${list.length === 1 ? '' : 's'}.`);
}

/**
 * Renders the client quote list and running subtotal.
 * @param {Array} items
 */
export function renderQuote(items) {
  quoteListEl.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'quote-empty';
    empty.textContent = 'No items yet. Add a service from the ledger.';
    quoteListEl.appendChild(empty);
  } else {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'quote-item';

      const name = document.createElement('span');
      name.className = 'quote-item-name';
      name.textContent = `${item.name}${item.size ? ` (${item.size})` : ''} — ${formatCurrency(item.price)}`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'quote-item-remove';
      removeBtn.type = 'button';
      removeBtn.dataset.cartId = item.cartId;
      removeBtn.setAttribute('aria-label', `Remove ${item.name} from the quote`);
      removeBtn.textContent = 'Remove';

      li.append(name, removeBtn);
      quoteListEl.appendChild(li);
    });
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  quoteTotalEl.textContent = formatCurrency(total);
}