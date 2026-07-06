# The Gilded Paw — Pricing Ledger

A digital pricing ledger for a luxury pet grooming salon's floor staff — replaces manual paper sheets and Excel with a fast, offline-tolerant lookup and quoting tool.

Pure HTML5 + vanilla CSS + vanilla JS (ES modules). No frameworks, no build step, no external UI libraries.

## Quick start

Because the JS uses native ES modules (`import`/`export`), opening `index.html` directly via `file://` will be blocked by the browser's module CORS policy. Serve it over `http://` instead:

```bash
# Option 1 — Node
npx serve .

# Option 2 — Python
python3 -m http.server 8080

# Option 3 — VS Code
Right-click index.html → "Open with Live Server"
```

Then visit the printed local URL (e.g. `http://localhost:8080`).

No dependencies to install, no environment variables, no API keys.

## Deploying (Vercel / Netlify)

This is a static site — drag-and-drop the folder onto Netlify, or run:

```bash
npx vercel deploy      # Vercel
netlify deploy --prod  # Netlify
```

No build command or output directory needs to be configured; deploy the project root as-is.

## Project structure

```
pet-salon-ledger/
├── index.html
├── css/
│   ├── tokens.css          # design tokens: color, type, spacing — single source of truth
│   ├── base.css             # reset, typography, focus states, a11y utilities
│   ├── layout.css           # page-level structure (header, grid, form layout)
│   ├── components.css       # cards, buttons, tabs, quote panel, form fields
│   └── states.css           # loading skeleton, empty/error state visuals
└── js/
    ├── main.js               # entry point — wires modules together, no business logic
    ├── data/
    │   └── services-data.js  # static service catalog (stand-in for a real API response)
    ├── core/
    │   ├── store.js          # single source of truth for app state
    │   ├── pricing.js        # price resolution + currency formatting
    │   └── filter-engine.js  # pure function: category + search → filtered list
    ├── services/
    │   └── api.js            # simulated backend calls (the one file a real API replaces)
    ├── ui/
    │   ├── connection-indicator.js  # header online/offline/syncing dot
    │   ├── renderer.js              # all DOM writes for the grid + quote panel
    │   ├── tabs.js                  # accessible tablist (roving tabindex, arrow keys)
    │   ├── quote-controller.js      # add/remove/clear quote interactions
    │   ├── form-validator.js        # field validation rules
    │   └── form-controller.js       # form submit lifecycle, sanitizing, confirmation
    └── utils/
        ├── analytics.js       # simulated telemetry ping
        └── sanitize.js        # XSS-safe text cleaning
```

Each module has one job and imports only what it needs. `main.js` is the only file that knows about every other module.

## Features

- **Pet size selector** — recalculates dog-service pricing across the whole ledger instantly.
- **Live search + category tabs** — narrows the ledger without a page reload.
- **Quote builder** — add/remove services, running subtotal, sticky panel.
- **Client save form** — attaches the current quote to a client record with validation.

## Edge cases handled

| Scenario | Behavior |
|---|---|
| Empty search results | "No services match that search" panel, not a blank grid |
| Slow / spotty connection | Skeleton loading cards while the (simulated) network call is in flight; header status dot shows *Syncing…* |
| Failed network call | ~1-in-8 simulated failure rate on both the catalog load and the quote save, surfaced as a retry-capable error panel or inline form message — never a silent crash |
| Invalid form submission | Required fields and a phone/email format check block submission; invalid fields get a red outline, `aria-invalid`, and inline error text; focus jumps to the first problem field |

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`-equivalent tablist, `footer`)
- Full keyboard support: skip link, roving-tabindex tabs with arrow/Home/End navigation, visible focus rings everywhere
- `aria-live` regions announce loading, search results, and quote changes to screen readers
- Every form field has a bound `<label>`, `aria-describedby` error text, and `aria-invalid` state
- Respects `prefers-reduced-motion`

## Security

- All form input passes through `utils/sanitize.js` (tag stripping + entity escaping) before it's stored in state
- All dynamic rendering uses `textContent`/DOM APIs, never `innerHTML` with unescaped data
- No API keys, secrets, or real PII in source — `services/api.js` is fully mocked

## Telemetry (simulated)

Every primary action logs a line to the browser console, e.g.:

```
[Analytics] User interacted with Luxury Pet Grooming Salon Pricing Page: service added to quote — Full Signature Groom
```

Open DevTools → Console to see these fire as you use the app.

## Design system

Monochromatic corporate palette (charcoal / bone / taupe) plus one deliberate brass accent, defined once in `css/tokens.css`. Spacing follows an 8px-based scale (8/16/24/32/48/64). No colors are introduced outside that token file.

## Browser support

Any evergreen browser (Chrome, Firefox, Safari, Edge). Relies on native ES modules, `fetch`-style Promises, and CSS custom properties — no polyfills included, none needed for modern browsers.