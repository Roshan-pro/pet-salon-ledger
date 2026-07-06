/**
 * ui/form-validator.js
 * ---------------------------------------------------------------------
 * Required-field and format validation for the inquiry form. Kept
 * separate from form-controller.js (which handles submission/network)
 * so validation rules can be read, changed, or unit tested on their own.
 * ---------------------------------------------------------------------
 */

const FIELD_RULES = {
  'client-name': { required: true, label: 'Client name' },
  'pet-name': { required: true, label: 'Pet name' },
  'contact-info': {
    required: true,
    label: 'Phone or email',
    test: (value) => /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(value) || /^[0-9()+\-.\s]{7,}$/.test(value),
    testMessage: 'Enter a valid phone number or email address.',
  },
  notes: { required: false },
};

/**
 * Validates a single field and reflects the result in the DOM
 * (aria-invalid + inline error message).
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl
 * @returns {boolean} whether the field is valid
 */
export function validateField(inputEl) {
  const rule = FIELD_RULES[inputEl.id];
  const errorEl = document.getElementById(`err-${inputEl.id}`);
  const value = inputEl.value.trim();

  let message = '';
  if (rule.required && !value) {
    message = `${rule.label} is required.`;
  } else if (value && rule.test && !rule.test(value)) {
    message = rule.testMessage;
  }

  const isInvalid = Boolean(message);
  inputEl.setAttribute('aria-invalid', String(isInvalid));
  if (errorEl) errorEl.textContent = message;
  return !isInvalid;
}

/**
 * Validates every rule-bound field in the form, focusing the first
 * invalid one it finds.
 * @param {HTMLFormElement} form
 * @returns {boolean} whether the whole form is valid
 */
export function validateAll(form) {
  let firstInvalid = null;
  let allValid = true;

  Object.keys(FIELD_RULES).forEach((id) => {
    const input = form.querySelector(`#${id}`);
    const valid = validateField(input);
    if (!valid) {
      allValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (firstInvalid) firstInvalid.focus();
  return allValid;
}