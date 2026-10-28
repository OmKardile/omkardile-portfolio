# Business Documentation — Portfolio Site

What this website is for, who reads it, and how the project portfolio is organized. Facts only; no invented numbers.

## Purpose

A single personal site that presents Omkar Kardile (Pune, India) as a **developer and UI/UX designer** — someone who designs the product and ships it in code. The site serves three audiences from one codebase:

1. **Recruiters/hiring managers** — the developer portfolio at `/` (project proof, skills, experience, contact) and the resume link.
2. **Design clients/employers** — the UI/UX portfolio at `/uiux` (case studies, Liquid Glass redesign studies with downloadable PDFs, live Relay prototype).
3. **The owner** — content is fully self-serve from `src/data/site.ts`; no page edits needed for content changes.

## Portfolio composition (developer projects)

Eleven cards, deliberately grouped so a reader can tell at a glance what is real, what is client work, what is academic, and what is still being built. The `kind` label on each card carries this distinction; the status dot carries only live vs in-development.

### Live products (owner-built, deployed)

- **SSShopee — Retail ERP + Storefront.** The flagship: one real retail business, two applications — an owner-facing ERP (POS with barcode/GST receipts, inventory with restock/stock-take/expiry tracking, purchases, income/expenses, udhar credit ledgers, analytics, reports) and a separate customer storefront (cart, COD/UPI checkout, order tracking) with its own database. Products sync between the two.
- **ServePoint — Café Operations Platform.** Full café counter workflow: ordering with GST checkout, kitchen queue, bills, end-of-day close-out, inventory with recipes, guest loyalty, floor/booking management; three-role access (superadmin/owner/staff) and QR table-side ordering with live order tracking; installable PWA.
- **tech // site.** Multi-niche technology publication with a split publishing model (admin with Gemini drafting; open-signup writers publish manually), reading library, author profiles/follows/comments, and a product-comparison shopping layer.
- **Aether Weather App** and **AI Recipe Generator.** Smaller products, both live; Aether is the rebuilt, renamed weather app (keyless Open-Meteo data, AI layer with graceful fallbacks), the recipe generator now runs on Google Gemini.
- **HandOff** (web + Android, public beta v1, actively maintained — privacy-first offline vCard QR) and **Bandwidth Bandit** (Android network monitor) — product work shipped outside the browser.

### Client work

- **PatelNetworks — Client E-commerce Platform.** A delivered storefront for a Surat surveillance/networking hardware business (catalog, kit bundles, Razorpay + COD, GST invoicing with serial-tracked warranty, trade accounts, WhatsApp ordering, order tracking). Presented as real client delivery; source stays private, and no metrics or business outcomes are claimed on the site.

### Academic work

- **Online Car Service Station.** The major project of the PG-DMC course (SunBeam Infotech, C-DAC ACTS — completed Feb 2026): hybrid car-service booking/tracking app plus React admin panel.

### In development

- **Full-Stack Food Ordering App** and **Real-Time Chat App.** Both clearly labeled "In development", described as scope-not-yet-shipped, with no links. This honesty rule also applies to them when they launch: links appear only when a working deployment exists.

## Communication principles (enforced in content)

1. **Verified links only.** Every link on a card was HTTP-checked at edit time; dead URLs are removed or flagged rather than left to rot in public.
2. **No fabricated metrics.** No user counts, revenue, ratings or performance numbers appear anywhere; the PatelNetworks card in particular describes capability, not business results.
3. **Stacks match code.** Technology claims come from each project's dependency manifest or README — e.g. SSShopee is published as Next.js/Prisma/Supabase because that is what its repo contains today, and its older Capacitor/Electron claim was retired when the code moved on.
4. **Duplicated apps consolidate.** SSShopee is one project with two labeled app links — a reader never meets the same product twice under different names, and retired URLs (the old Render host) never resurface.
5. **Exclusions honored.** GoldDrip is deliberately absent from the development portfolio at the owner's request.

## Positioning statements used on the site

- Hero: "Designer and developer in Pune. I design digital products and ship them in code."
- Contact: open to UI/UX design and frontend development roles and collaborations; email is the fastest channel (`omkarkardileatwork@gmail.com`).
- Cross-links: the navbar switch pill toggles between the developer (`/`) and UI/UX (`/uiux`) portfolios; both directions are always one click away.
