# SafarCare website

The public website for SafarCare — *Travel Prepared. Travel Confident.*

- `website/` — the site Netlify publishes (no build step)
  - `index.html`, `styles.css`, `main.js` — the landing page, in English, Somali and Arabic
  - `preview/` — the clickable app preview
  - `thanks.html` — shown after someone joins the launch list
- `netlify.toml` — tells Netlify to publish `website/` and adds security headers

Launch-list sign-ups are collected by **Netlify Forms** (form name `launch-list`). See them in Netlify → your project → Forms.
