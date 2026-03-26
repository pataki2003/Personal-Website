# Personal Portfolio Website

A bilingual personal portfolio built with plain HTML, CSS, and JavaScript. The site is designed to stay lightweight while still supporting shared theme logic, shared translations, dedicated project pages, and a contact flow backed by a serverless API route.

## What The Site Includes

- Responsive homepage, contact page, and project detail pages
- Dark and light theme toggle with saved preference
- English and Hungarian translations with shared client-side i18n
- Shared styling tokens and reusable page-level layout styles
- Contact form that posts to `/api/contact`

## Tech Stack

- HTML
- CSS
- JavaScript modules
- Vercel-style serverless function for contact handling

## Project Structure

```text
Personal-Website/
|-- index.html
|-- contact.html
|-- README.md
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
|   |       |-- contact-form.js
|   |       |-- i18n.js
|   |       |-- nav.js
|   |       `-- theme.js
|   `-- styles/
|       |-- base.css
|       |-- home.css
|       `-- project-detail.css
|-- Images/
|   |-- coachtimize-dashboard.png
|   |-- coachtimize-login.png
|   `-- profile.jpg
`-- projects/
    |-- ai-call-handling.html
    |-- coachtimize.html
    `-- portfolio-website.html
```

## Frontend Architecture

- `assets/scripts/main.js` is the entrypoint for the homepage and contact page.
- `assets/scripts/project-page.js` is the entrypoint for project detail pages.
- `assets/scripts/shared/theme.js` owns theme persistence and toggle labels.
- `assets/scripts/shared/i18n.js` owns language state, translation application, and active language button state.
- `assets/scripts/shared/nav.js` handles the mobile navigation menu.
- `assets/scripts/shared/contact-form.js` validates and submits the contact form.
- `assets/styles/base.css` contains shared tokens, layout primitives, header/footer styles, and shared controls.
- `assets/styles/home.css` contains homepage and contact-page-specific layout and component styles.
- `assets/styles/project-detail.css` contains project-page-specific layout and panel styling.

## Contact API

The frontend sends this payload shape to `/api/contact`:

- `name`
- `email`
- `projectType`
- `budget`
- `message`

The API route in `api/contact.js` expects these environment variables:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

If any of them are missing, the route returns an error instead of sending email.

## Local Verification

- Open `index.html` and `contact.html` through a simple static server so ES modules load correctly.
- Verify both languages switch correctly and that `theme` and `language` are persisted in `localStorage`.
- Test the contact form with valid and invalid data.
- Review the project pages to make sure shared theme and i18n behavior stays consistent.

## Status

The site is in a polished, lightweight state with a modular frontend structure that is easier to maintain and easier to migrate later if a framework is introduced.
