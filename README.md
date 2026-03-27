# Personal Portfolio Website

A lightweight bilingual portfolio site built with plain HTML, CSS, and JavaScript modules. The project is static-first, with shared frontend logic for theme and language handling, dedicated project detail pages, a booking CTA, and a serverless contact endpoint for inbound leads.

## What This Repo Contains

- `index.html` for the homepage
- `contact.html` for the contact form and booking section
- `projects/*.html` for project detail pages
- Shared frontend modules for theme, i18n, mobile nav, booking links, and contact form handling
- `api/contact.js` for sending contact form submissions through Resend

## Features

- English and Hungarian content with shared client-side translations
- Dark and light theme toggle with saved preference
- Responsive navigation and page layouts
- Dedicated detail pages for featured projects
- Contact form validation and submission to `/api/contact`
- Booking CTA powered by a shared external scheduling URL

## Stack

- HTML
- CSS
- JavaScript ES modules
- Vercel-style serverless function
- Resend API for contact email delivery

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
|   |       |-- booking.js
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
|   |-- facebook.svg
|   |-- instagram.svg
|   |-- profile.jpg
|   `-- twitter.svg
`-- projects/
    |-- ai-call-handling.html
    |-- coachtimize.html
    `-- portfolio-website.html
```

## Frontend Entry Points

- `assets/scripts/main.js` boots the homepage and contact page
- `assets/scripts/project-page.js` boots the project detail pages
- `assets/scripts/shared/theme.js` manages theme state and toggle labels
- `assets/scripts/shared/i18n.js` manages language state and translation updates
- `assets/scripts/shared/nav.js` controls the mobile navigation menu
- `assets/scripts/shared/booking.js` injects the live booking URL into all `[data-booking-link]` elements
- `assets/scripts/shared/contact-form.js` validates and submits the contact form

## Local Development

This repo does not need a build step for the frontend. Run it from a simple static server so the ES modules load correctly.

Examples:

```powershell
python -m http.server 5500
```

```powershell
npx serve .
```

Then open `http://localhost:5500` or the port your server prints.

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

- A plain static server will not execute `api/contact.js`
- For full contact form behavior, deploy to a platform that supports this serverless route, such as Vercel
- If the environment variables are missing, the endpoint returns an error instead of sending mail

## Project-Specific Configuration

- Booking link: update `BOOKING_URL` in `assets/scripts/shared/booking.js`
- Analytics: replace `G-XXXXXXX` anywhere the analytics snippet is present, or remove the snippet if you do not use Google Analytics

## Quick Verification Checklist

- Open the homepage, contact page, and each project page from a static server
- Verify both languages switch correctly
- Verify the selected theme persists between reloads
- Verify booking buttons open the expected external scheduling page
- Test the contact form in a deployed environment with the required env vars set

## Notes

The site is intentionally framework-free and easy to maintain. Most updates can be made by editing HTML content, shared styles, or one of the small frontend modules in `assets/scripts/shared`.
