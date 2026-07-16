# Pataki Dev Portfolio Website

A static, bilingual portfolio and lead-generation website for full-stack web development, web applications, AI automation, API integrations, and cybersecurity learning.

The site is framework-free and deploys as plain HTML, CSS, JavaScript modules, static assets, and one Vercel-style serverless contact endpoint.

## What This Repo Contains

- Hungarian canonical pages at the root, including the homepage, service pages, project index, blog index, blog articles, and contact page.
- English canonical pages under `/en/`.
- Clean public URLs through Vercel `cleanUrls`.
- SEO metadata on indexable pages: unique titles, descriptions, canonical URLs, reciprocal `hreflang`, Open Graph, Twitter cards, and JSON-LD.
- `sitemap.xml` with canonical URLs and language alternates.
- `robots.txt` pointing crawlers to the sitemap.
- A blue `PB` favicon system: `favicon.svg`, `favicon.ico`, and `apple-touch-icon.png`.
- `api/contact.js` for contact form submissions through Resend.

## Main Public Routes

Hungarian:

- `/`
- `/weboldal-keszites`
- `/webalkalmazas-fejlesztes`
- `/ai-automatizacio`
- `/projektek`
- `/blog`
- `/blog/weboldal-keszites-arak`
- `/blog/wordpress-vagy-egyedi-weboldal`
- `/blog/milyen-folyamatokat-erdemes-automatizalni`
- `/kapcsolat`
- `/projects/coachtimize`
- `/projects/ai-call-handling`
- `/projects/portfolio-website`
- `/projects/mediabox`
- `/projects/nadasdi-zoltan`
- `/projects/rush-market`

English:

- `/en/`
- `/en/website-development`
- `/en/web-application-development`
- `/en/ai-automation`
- `/en/projects`
- `/en/blog`
- `/en/blog/website-development-costs`
- `/en/blog/wordpress-vs-custom-website`
- `/en/blog/business-processes-to-automate`
- `/en/contact`
- `/en/projects/coachtimize`
- `/en/projects/ai-call-handling`
- `/en/projects/portfolio-website`
- `/en/projects/mediabox`
- `/en/projects/nadasdi-zoltan`
- `/en/projects/rush-market`

Legacy contact redirects:

- `/contact` -> `/kapcsolat`
- `/contact.html` -> `/kapcsolat`
- `/en/contact.html` -> `/en/contact`

## Features

- Bilingual Hungarian and English static pages.
- Dark and light theme toggle with saved preference.
- Responsive navigation and page layouts.
- Service pages with lead-focused copy and visible FAQ sections.
- Project detail pages and project index pages.
- Blog index pages and three starter articles in both languages.
- Contact form validation and submission to `/api/contact`.
- Booking CTA powered by a shared external scheduling URL.
- Clean URL routing and static SEO architecture for Google indexing.

## Stack

- HTML
- CSS
- JavaScript ES modules
- Vercel static hosting configuration
- Vercel-style serverless function
- Resend API for contact email delivery

## Project Structure

```text
Personal-Website/
|-- index.html
|-- kapcsolat.html
|-- weboldal-keszites.html
|-- webalkalmazas-fejlesztes.html
|-- ai-automatizacio.html
|-- projektek.html
|-- blog.html
|-- 404.html
|-- sitemap.xml
|-- robots.txt
|-- vercel.json
|-- favicon.ico
|-- favicon.svg
|-- apple-touch-icon.png
|-- api/
|   `-- contact.js
|-- assets/
|   |-- scripts/
|   |   |-- main.js
|   |   |-- project-page.js
|   |   |-- data/
|   |   |   |-- en.js
|   |   |   |-- hu.js
|   |   |   `-- translations.js
|   |   `-- shared/
|   |       |-- booking.js
|   |       |-- contact-form.js
|   |       |-- currency.js
|   |       |-- i18n.js
|   |       |-- nav.js
|   |       `-- theme.js
|   `-- styles/
|       |-- base.css
|       |-- home.css
|       `-- project-detail.css
|-- blog/
|   |-- weboldal-keszites-arak.html
|   |-- wordpress-vagy-egyedi-weboldal.html
|   `-- milyen-folyamatokat-erdemes-automatizalni.html
|-- en/
|   |-- index.html
|   |-- contact.html
|   |-- website-development.html
|   |-- web-application-development.html
|   |-- ai-automation.html
|   |-- projects.html
|   |-- blog.html
|   |-- blog/
|   `-- projects/
|-- Images/
`-- projects/
```

## Frontend Entry Points

- `assets/scripts/main.js` boots shared page behavior.
- `assets/scripts/project-page.js` boots project detail behavior.
- `assets/scripts/shared/theme.js` manages theme state.
- `assets/scripts/shared/i18n.js` manages language state for shared translated UI.
- `assets/scripts/shared/nav.js` controls the mobile navigation menu.
- `assets/scripts/shared/currency.js` manages budget/currency UI where used.
- `assets/scripts/shared/booking.js` injects the live booking URL into `[data-booking-link]` elements.
- `assets/scripts/shared/contact-form.js` validates and submits the contact form.

## Local Development

No frontend build step is required. Run a simple static server so ES modules load correctly during local development.

Examples:

```powershell
python -m http.server 5500
```

```powershell
npx serve .
```

Then open `http://localhost:5500` or the port your server prints.

For full production routing behavior, deploy to Vercel or preview with a tool that respects `vercel.json`.

## Contact Form Setup

The contact form sends this payload to `/api/contact`:

- `name`
- `email`
- `projectType`
- `budget`
- `message`

`api/contact.js` expects these environment variables:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Important:

- A plain static server will not execute `api/contact.js`.
- For full contact form behavior, deploy to a platform that supports this serverless route, such as Vercel.
- If the environment variables are missing, the endpoint returns an error instead of sending mail.

## SEO And Routing Notes

- Production domain: `https://www.pataki-dev.hu/`.
- Hungarian root pages are canonical; English pages live under `/en/`.
- Do not add a `/hu/` duplicate.
- Public URLs should be clean URLs without `.html`.
- `sitemap.xml` must remain valid XML with the sitemap and XHTML namespaces.
- `vercel.json` sets an explicit XML response header for `/sitemap.xml`.
- `robots.txt` allows crawling and points to `https://www.pataki-dev.hu/sitemap.xml`.
- Redirected URLs should not be added to `sitemap.xml`.

## Favicon System

The favicon system uses the current blue accent color:

- `favicon.svg`: blue `PB` monogram SVG.
- `favicon.ico`: 16x16, 32x32, and 48x48 ICO entries.
- `apple-touch-icon.png`: 180x180 PNG.

All HTML pages should reference these with root-absolute cache-busted URLs:

```html
<link rel="icon" href="/favicon.ico?v=2" sizes="any" />
<link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
```

## Project-Specific Configuration

- Booking link: update `BOOKING_URL` in `assets/scripts/shared/booking.js`.
- Sitemap date: update `<lastmod>` values in `sitemap.xml` when publishing meaningful content changes.
- Accent color: update the central CSS variables in `assets/styles/base.css`.

## Quick Verification Checklist

- Open `/`, `/en/`, `/kapcsolat`, one service page, one blog article, and one project page.
- Verify the theme toggle works and persists between reloads.
- Verify language links navigate between matching HU/EN clean URLs.
- Verify booking buttons open the configured scheduling page.
- Test the contact form in a deployed environment with the required env vars set.
- Confirm `sitemap.xml` parses as XML and returns `Content-Type: application/xml; charset=utf-8` after deployment.
- Confirm `robots.txt` points to the production sitemap.
- Confirm no internal indexable link uses `.html` or `?lang=`.

## Notes

The site is intentionally static-first and easy to maintain. Most content updates can be made by editing the relevant HTML page, shared CSS, or one of the small frontend modules in `assets/scripts/shared`.
