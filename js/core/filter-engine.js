/**
 * core/filter-engine.js
 * ---------------------------------------------------------------------
 * A pure function: given the full service list plus the current
 * category and search term, returns the narrowed list. No side effects,
 * no DOM access — easy to unit test on its own.
 * ---------------------------------------------------------------------
 */

/**
 * @param {Array} services - full catalog
 * @param {string} category - 'all' | 'dog' | 'cat' | 'addon'
 * @param {string} term - raw search input
 * @returns {Array} filtered services
 */
export function applyFilters(services, category, term) {
  const cleanTerm = term.trim().toLowerCase();
  return services.filter((service) => {
    const matchesCategory = category === 'all' || service.category === category;
    const matchesTerm = !cleanTerm
      || service.name.toLowerCase().includes(cleanTerm)
      || service.description.toLowerCase().includes(cleanTerm);
    return matchesCategory && matchesTerm;
  });
}