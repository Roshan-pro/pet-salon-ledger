/**
 * core/store.js
 * ---------------------------------------------------------------------
 * Single source of truth for services, active filters, pet size, and the
 * in-progress quote. Nothing outside this file touches these variables
 * directly — every read/write goes through an exported function, which
 * keeps state changes traceable and easy to test in isolation.
 * ---------------------------------------------------------------------
 */

let allServices = [];
let activeCategory = 'all';
let searchTerm = '';
let petSize = 'medium';
let quote = []; // { cartId, serviceId, name, price, size }
let cartCounter = 0;

export const Store = {
  getAllServices: () => allServices,
  setAllServices: (list) => { allServices = list; },

  getActiveCategory: () => activeCategory,
  setActiveCategory: (category) => { activeCategory = category; },

  getSearchTerm: () => searchTerm,
  setSearchTerm: (term) => { searchTerm = term; },

  getPetSize: () => petSize,
  setPetSize: (size) => { petSize = size; },

  getQuote: () => quote,

  addQuoteItem: ({ serviceId, name, price, size }) => {
    cartCounter += 1;
    const item = { cartId: `cart-${cartCounter}`, serviceId, name, price, size: size || null };
    quote = [...quote, item];
    return item;
  },

  removeQuoteItem: (cartId) => {
    quote = quote.filter((item) => item.cartId !== cartId);
  },

  clearQuote: () => {
    quote = [];
  },
};