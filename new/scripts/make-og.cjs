// Regenerate public/og.png from the live hero, with the Next.js dev indicator hidden.
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const out = process.argv[2] || path.join(process.env.HOME || '', 'my-project/public/og.png');
  const b = await chromium.launch({ headless: true });
  const page = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await page.waitForTimeout(2600); // loader + intro + wave reveal
  await page.screenshot({ path: out });
  await b.close();
  console.log('wrote', out);
})();
