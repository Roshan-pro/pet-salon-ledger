/**
 * utils/sanitize.js
 * ---------------------------------------------------------------------
 * Input sanitization. Anything a user typed passes through here before
 * it's stored in state or rendered, defending against XSS injection.
 * ---------------------------------------------------------------------
 */

const ENTITY_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escapes HTML-significant characters. Safe to store and safe to log.
 * @param {string} input
 * @returns {string}
 */
export function escapeHTML(input) {
  return String(input).replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch]);
}

/**
 * Strips any tag-like sequences entirely, then escapes what remains and
 * trims whitespace. This is the function form-facing code should use
 * before writing user input into state.
 * @param {string} input
 * @returns {string}
 */
export function cleanText(input) {
  const noTags = String(input).replace(/<[^>]*>/g, '');
  return escapeHTML(noTags).trim();
}