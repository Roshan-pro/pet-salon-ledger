/**
 * ui/form-controller.js
 * ---------------------------------------------------------------------
 * Handles the inquiry form's submit flow: validates, sanitizes, calls
 * the (simulated) save API, and renders a confirmation or error state.
 * Depends on form-validator.js for rules but owns the submit lifecycle.
 * ---------------------------------------------------------------------
 */

import { Store } from '../core/store.js';
import { formatCurrency } from '../core/pricing.js';
import { saveQuote } from '../services/api.js';
import { cleanText } from '../utils/sanitize.js';
import { ping } from '../utils/analytics.js';
import { setConnectionState } from './connection-indicator.js';
import { validateField, validateAll } from './form-validator.js';

const form = document.getElementById('inquiry-form');
const submitBtn = document.getElementById('submit-inquiry');
const statusEl = document.getElementById('form-status');
const confirmationCard = document.getElementById('confirmation-card');

function buildConfirmation(sanitized, reference) {
  confirmationCard.innerHTML = '';
  confirmationCard.hidden = false;

  const heading = document.createElement('h3');
  heading.textContent = `Quote saved — reference ${reference}`;

  const summary = document.createElement('p');
  summary.textContent = `${sanitized.petName}'s quote is now attached to ${sanitized.clientName}'s file.`;

  const list = document.createElement('ul');
  Store.getQuote().forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name}${item.size ? ` (${item.size})` : ''} — ${formatCurrency(item.price)}`;
    list.appendChild(li);
  });

  confirmationCard.append(heading, summary, list);
}

async function handleSubmit(event) {
  event.preventDefault();
  statusEl.textContent = '';
  confirmationCard.hidden = true;

  if (!validateAll(form)) {
    statusEl.textContent = 'Please fix the highlighted fields.';
    ping('form validation failed');
    return;
  }

  const sanitized = {
    clientName: cleanText(form.clientName.value),
    petName: cleanText(form.petName.value),
    contact: cleanText(form.contact.value),
    notes: cleanText(form.notes.value),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving…';
  statusEl.textContent = 'Saving to the client file…';
  setConnectionState('syncing');

  try {
    const result = await saveQuote({ ...sanitized, quote: Store.getQuote() });
    setConnectionState('online');
    statusEl.textContent = 'Saved.';
    buildConfirmation(sanitized, result.reference);
    ping('quote saved to client file', result.reference);
  } catch (err) {
    setConnectionState('offline');
    statusEl.textContent = `${err.message} Please try saving again.`;
    ping('quote save failed', err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save quote to client file';
  }
}

/** Wires up submit handling and on-blur validation. */
export function initFormController() {
  form.addEventListener('submit', handleSubmit);
  ['client-name', 'pet-name', 'contact-info'].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => validateField(input));
  });
}