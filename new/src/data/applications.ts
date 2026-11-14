/* /for/<slug> — per-application pages from [1.6.0]. One page per real
   application target: three teardown notes on the company's product
   (written from public documentation only — no internal info, no
   speculation about their roadmap), the three shipped proofs that match
   the role, and the resume. The slug doubles as tracking: the URL sent
   in the application tells you which one was opened.

   The rule set, enforced by scripts/verify-for-pages.py:
   - at most FIVE entries — these ride on applications actually going
     out, and a stale page is worse than none;
   - every proof slug must exist in site.ts's projects (verified from
     their repos, so the page can't claim anything unshipped);
   - every page is noindex, outside the sitemap — unlisted is not
     private, so the notes stay constructive and public-info only.

   The two seeded targets were picked because their products overlap
   what is already shipped and repo-verified here. Role titles are the
   only per-application field to set when a real posting is attached. */

export type ApplicationNote = {
  title: string;
  note: string;
};

export type Application = {
  slug: string;
  company: string;
  product: string;
  role: string;
  sent: string;
  fit: string;
  notes: ApplicationNote[];
  proofs: string[];
};

export const applications: Application[] = [
  {
    slug: 'zoho-books',
    company: 'Zoho',
    product: 'Zoho Books',
    role: 'Frontend Engineer / UI-UX Designer',
    sent: '2026-11-13',
    fit: 'The work here is invoicing, GST and small-retail money flows — which is what the SSShopee ERP ships for a real store: POS with barcode scanning, GST receipts, udhar ledgers, serial-tracked warranty. Built the domain first, in production, before ever applying to build it at scale.',
    notes: [
      {
        title: 'Counter sales still route through a customer record',
        note:
          'Books\u2019 invoice creation is guided and compliance-deep, but a walk-in cash or UPI sale still passes through a customer entity first. SSShopee\u2019s POS treats the counter as first-class — scan, cart, GST receipt in one pass, no record created. A counter-sales lane in Books would be a small change with a big retail win.',
      },
      {
        title: 'E-invoicing is a separate destination, not a status',
        note:
          'IRP upload, validation and signing live in their own flow — the right compliance design, but it means a retailer reconciling at month-end hops between the invoice list and the e-invoice state. Surfacing the e-invoice status as a column on the invoice list would close that gap without touching the compliance flow.',
      },
      {
        title: 'The receivables story is strong; the udhar story is missing',
        note:
          'Client portal plus online payment collection covers formal receivables well. But the receivables system Indian retail actually runs on is the udhar ledger — a running credit per customer, part payments, aging. SSShopee ships exactly that, and it is the screen the store owner checks first. Books could offer it without touching accounting rules: it is a view, not a ledger change.',
      },
    ],
    proofs: ['ssshopee', 'servepoint', 'patelnetworks'],
  },
  {
    slug: 'razorpay',
    company: 'Razorpay',
    product: 'the Razorpay Dashboard',
    role: 'Frontend Engineer / UI-UX Designer',
    sent: '2026-11-13',
    fit: 'Payments dashboards live or die on trust: money shown accurately, settled money distinguished from pending money, and reconciliation a merchant can do alone. PatelNetworks runs Razorpay checkout inside a real client storefront with GST invoicing, and SSShopee tracks every rupee of purchases, income and expenses for a real shop — the merchant side of the same table.',
    notes: [
      {
        title: 'Single View Reconciliation is gated on Optimizer',
        note:
          'The consolidated settlement view exists and is good — for businesses on Optimizer. A merchant on a single gateway but two channels (web checkout plus in-person) still reads settlement break-ups per product. Extending the single view across channels would remove the reconciliation work small merchants do by hand in spreadsheets.',
      },
      {
        title: 'Route is a power tool; micro-merchants need a one-screen mode',
        note:
          'Route\u2019s splitting — sellers, third parties, dedicated settlement cycles — is built for marketplaces and mutual-fund platforms. The shop-owner version of the same need is one screen: \u201cpay this vendor a fixed share of every sale.\u201d A simple rule mode on top of Route would widen its reach without changing the engine.',
      },
      {
        title: 'The dashboard leads with insights; merchants lead with \u201cdid it settle\u201d',
        note:
          'The home page opens with payments overview, insights and product recommendations. From watching shop owners run day-end close, the first question is narrower: what came in today versus what has actually settled. Leading with that split — settled, in transit, pending — would answer the question before the insights get a chance.',
      },
    ],
    proofs: ['patelnetworks', 'ssshopee', 'servepoint'],
  },
];
