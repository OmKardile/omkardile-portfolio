# Omkar Dile Portfolio (Next.js)

Portfolio website rebuilt from Framer into Next.js (App Router).

## Tech Stack

- `next@16`
- `react@19`
- `tailwindcss@4` (imported via `@import "tailwindcss"` in global CSS)
- `eslint` with `eslint-config-next`
- `next/font` using `Jost`

## Routes

- `/` Home page (hero, tech stack, skills, projects, experience, socials)
- `/resume` Resume summary + resume download button
- `/contact` Contact summary + embedded Typeform

## Project Structure

```txt
src/
  app/
    layout.js          # Root layout + metadata + global font setup
    globals.css        # All global styles, dark theme, responsive behavior
    page.js            # Home page content and section data arrays
    resume/page.js     # Resume route content
    contact/page.js    # Contact route content + Typeform iframe
  components/
    site-shell.js      # Shared header/nav wrapper for all pages
```

## How Content Is Managed

1. Home page section data is in `src/app/page.js`.
   `projectCards`, `skillChips`, and `experience` control most visible content.
2. Header navigation links are in `src/components/site-shell.js` (`navItems`).
3. Resume download URL is in `src/app/resume/page.js`.
4. Contact form embed URL is in `src/app/contact/page.js` (`iframe src`).

## Styling System

1. Theme colors/tokens live in `:root` in `src/app/globals.css`.
2. Shared layout classes include:
   `.site-shell`, `.site-header`, `.site-nav`, `.section-frame`.
3. Home page layout classes include:
   `.hero-grid`, `.projects-grid`, `.chip-grid`, `.timeline`.
4. Route-specific classes include:
   `.single-column` for `/resume`, `.contact-layout` and `.form-frame` for `/contact`.
5. Mobile behavior is controlled by the media query at `max-width: 1199px`.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

3. Run quality checks:

```bash
npm run lint
npm run build
```

## Scripts

- `npm run dev` starts local dev server
- `npm run build` creates production build
- `npm run start` runs production server locally
- `npm run lint` runs ESLint

## Path Alias

- `@/*` maps to `src/*` (configured in `jsconfig.json`)
- Example: `import SiteShell from "@/components/site-shell";`

## Deployment (Vercel)

1. Preview deployment:

```bash
vercel deploy --target preview -y
```

2. Production deployment:

```bash
vercel --prod
```

## Beginner Edit Guide

1. Change text/content:
   edit `src/app/page.js`, `src/app/resume/page.js`, `src/app/contact/page.js`.
2. Add or remove nav links:
   edit `navItems` in `src/components/site-shell.js`.
3. Change colors/spacing/layout:
   edit CSS variables and classes in `src/app/globals.css`.
4. Add a new route:
   create `src/app/<route>/page.js`, then add the link in `navItems`.

## Notes

- This app currently uses static content (no CMS/database).
- External links currently include placeholder social URLs (`github.com`, `linkedin.com`).
