# SafarCare website

*Travel Prepared. Travel Confident.* — a website that explains flight tickets in plain English, Somali and Arabic.

- `website/` — published by Netlify as-is (no build step)
  - `index.html`, `styles.css` — the page
  - `main.js` — motion (globe, split-flap board, scroll-driven ticket decoding, airport journey, baggage scale, checklist, runway) and the ticket reader
  - `i18n.js` — Somali and Arabic text, plus the departures board, airport stages and decoder copy
  - `parser.js` — reads tickets in the browser; nothing is uploaded
  - `vendor/` — GSAP + ScrollTrigger (animation) and pdf.js (reading PDF tickets), hosted with the site
- `netlify.toml` — publish settings and security headers

Motion respects the visitor's "reduce motion" setting: everything stays readable and still.
