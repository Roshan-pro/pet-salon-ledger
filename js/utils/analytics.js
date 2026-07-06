/**
 * utils/analytics.js
 * ---------------------------------------------------------------------
 * Stand-in for a real telemetry pipeline (Segment, Amplitude, etc).
 * Every other module calls `ping()` instead of console.log directly, so
 * swapping in a real analytics SDK later means editing one file.
 * ---------------------------------------------------------------------
 */

const EVENT_PREFIX = 'User interacted with Luxury Pet Grooming Salon Pricing Page';

/**
 * Logs a simulated analytics event.
 * @param {string} action - short description of what happened
 * @param {string} [detail] - optional extra context (e.g. a service name)
 */
export function ping(action, detail) {
  const suffix = detail ? ` — ${detail}` : '';
  // eslint-disable-next-line no-console
  console.log(`[Analytics] ${EVENT_PREFIX}: ${action}${suffix}`);
}