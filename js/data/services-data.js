/**
 * data/services-data.js
 * ---------------------------------------------------------------------
 * Static catalog of services offered by the salon. In a real deployment
 * this file would not exist — it would be replaced entirely by whatever
 * the API returns. Keeping it isolated here means services/api.js is the
 * only file that ever needs to change when a real backend comes online.
 * ---------------------------------------------------------------------
 */

export const SERVICES_DATA = [
  { id: 'dog-bath-brush', category: 'dog', name: 'Bath & Brush-Out', description: 'Shampoo, conditioner, blow-dry, and full brush-out to the skin.', pricesBySize: { small: 45, medium: 60, large: 78, giant: 98 } },
  { id: 'dog-full-groom', category: 'dog', name: 'Full Signature Groom', description: 'Bath, breed-standard cut, ear cleaning, nail trim, and finishing spritz.', pricesBySize: { small: 75, medium: 95, large: 120, giant: 150 } },
  { id: 'dog-deshed', category: 'dog', name: 'De-Shed Treatment', description: 'Undercoat rake and high-velocity blow-out to cut seasonal shedding.', pricesBySize: { small: 35, medium: 48, large: 62, giant: 80 } },
  { id: 'dog-puppy-intro', category: 'dog', name: "Puppy's First Groom", description: 'Gentle introductory session focused on comfort and positive association.', pricesBySize: { small: 40, medium: 50, large: 60, giant: 70 } },
  { id: 'cat-bath-groom', category: 'cat', name: 'Feline Bath & Groom', description: 'Low-stress bath, gentle dry, and brush-out for cats of any coat length.', price: 65 },
  { id: 'cat-lion-cut', category: 'cat', name: 'Lion Cut', description: 'Full-body clip leaving a mane, ideal for heavily matted or senior cats.', price: 85 },
  { id: 'cat-nail-trim', category: 'cat', name: 'Nail Trim', description: 'Quick, calm nail trim for cats — no bath included.', price: 20 },
  { id: 'addon-pawdicure', category: 'addon', name: 'Pawdicure & Paw Balm', description: 'Nail trim, pad trim, and moisturizing balm for city-worn paws.', price: 18 },
  { id: 'addon-teeth', category: 'addon', name: 'Teeth Brushing', description: 'Enzymatic toothpaste brushing add-on for any grooming visit.', price: 12 },
  { id: 'addon-blueberry-facial', category: 'addon', name: 'Blueberry Facial', description: 'Tear-stain treatment and gentle facial scrub, blueberry-scented.', price: 15 },
  { id: 'addon-aromatherapy', category: 'addon', name: 'Aromatherapy Spa Soak', description: '10-minute calming soak with lavender or chamomile essence.', price: 22 },
  { id: 'addon-express', category: 'addon', name: 'Express Finish (30 min)', description: 'Priority slot for clients on a tight schedule.', price: 25 },
];