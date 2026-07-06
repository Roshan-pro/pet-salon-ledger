/**
 * core/pricing.js
 * ---------------------------------------------------------------------
 * All price-resolution logic lives here in one place, so "how do we
 * price a service for a given pet size" is never duplicated or drifted
 * between the renderer, the quote controller, and the form.
 * ---------------------------------------------------------------------
 */

/**
 * Resolves the display price for a service at a given pet size.
 * Falls back to the flat `price` field for services without size tiers.
 * @param {object} service
 * @param {string} size - 'small' | 'medium' | 'large' | 'giant'
 * @returns {number}
 */
export function resolvePrice(service, size) {
  if (service.pricesBySize) {
    return service.pricesBySize[size] ?? service.pricesBySize.medium;
  }
  return service.price;
}

/**
 * Formats a number as a US-style currency string.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}