/**
 * ui/tabs.js
 * ---------------------------------------------------------------------
 * Accessible tablist for the service categories: roving tabindex,
 * arrow-key navigation, and correct aria-selected/aria-labelledby
 * bookkeeping. It has no knowledge of filtering or rendering — it just
 * reports the selected category via the onChange callback it's given,
 * keeping it reusable and independently testable.
 * ---------------------------------------------------------------------
 */

/**
 * @param {(category: string) => void} onCategoryChange
 */
export function initTabs(onCategoryChange) {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panel = document.getElementById('panel-services');

  function activate(tab, { focus = true } = {}) {
    tabs.forEach((t) => {
      const isActive = t === tab;
      t.setAttribute('aria-selected', String(isActive));
      t.tabIndex = isActive ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    onCategoryChange(tab.dataset.category);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab, { focus: false }));
    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;
      if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') targetIndex = 0;
      else if (event.key === 'End') targetIndex = tabs.length - 1;

      if (targetIndex !== null) {
        event.preventDefault();
        activate(tabs[targetIndex]);
      }
    });
  });
}