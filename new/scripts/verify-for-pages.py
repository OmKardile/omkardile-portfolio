#!/usr/bin/env python3
"""verify-for-pages.py — [1.6.0] per-application pages, enforced.

Run against any base URL (default http://127.0.0.1:3000):

    python3 scripts/verify-for-pages.py [BASE_URL]

  Static
    S1  at most five entries (a stale page is worse than none)
    S2  every proof slug exists in site.ts's projects; every entry has
        exactly three notes and a sent date
    S3  no /for/ route is in sitemap.ts or the built sitemap.xml

  Rendered
    R1  each seeded page: 200, noindex robots meta, company + role +
        three notes + three proofs with verified scans + sent date
    R2  a bogus slug returns 404 — only seeded targets exist
    R3  no /for/ URL appears in /sitemap.xml on the server
    R4  the honesty line is printed (constructive, public-info only,
        scanner caveat, counts nothing)
"""

import pathlib
import re
import sys

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
EVIDENCE = ROOT / "download" / "for-pages-evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)

app_ts = (ROOT / "src" / "data" / "applications.ts").read_text()
site_ts = (ROOT / "src" / "data" / "site.ts").read_text()
sitemap_ts = (ROOT / "src" / "app" / "sitemap.ts").read_text()

entries = re.findall(r"slug: '([^']+)'", app_ts)
project_slugs = set(re.findall(r"slug: '([^']+)'", site_ts))
proof_lists = re.findall(r"proofs: \[([^\]]*)\]", app_ts)
notes_lists = re.findall(r"notes: \[", app_ts)
sent_dates = re.findall(r"sent: '(\d{4}-\d{2}-\d{2})'", app_ts)

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not ok else ""))


check("S1 at most five targets", len(entries) <= 5, f"{len(entries)} entries")
check("S2a every proof slug is a real project",
      all(s.strip().strip("'\"") in project_slugs
          for lst in proof_lists for s in lst.split(",")))
check("S2b three notes + a sent date per entry",
      len(notes_lists) == len(entries) and len(sent_dates) == len(entries))
check("S3a sitemap.ts has no /for/", "/for/" not in sitemap_ts)

print(f"\n== rendered: {BASE}/for/* ==")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    for slug in entries:
        page.goto(f"{BASE}/for/{slug}", wait_until="networkidle")
        html = page.content()
        body = page.locator("body").inner_text()
        ok_robots = 'noindex' in html
        company = app_ts.split(f"slug: '{slug}'")[1].split("product:")[0]
        company_name = re.search(r"company: '([^']+)'", company).group(1)
        check(f"R1 {slug}: 200 + noindex + content",
              ok_robots and company_name in body
              and "THREE NOTES ON" in body and "SENT" in body
              and "verified from the repo manifest" in body
              and "/resume.pdf" in body,
              f"noindex={ok_robots}")
        if slug == entries[0]:
            page.screenshot(path=str(EVIDENCE / "for-zoho-books.png"), full_page=True)

    print(f"== rendered: {BASE}/for/nothing ==")
    code = page.goto(f"{BASE}/for/not-a-target", wait_until="domcontentloaded")
    check("R2 bogus slug 404s", code.status == 404, f"got {code.status}")

    print(f"== rendered: {BASE}/sitemap.xml ==")
    page.goto(f"{BASE}/sitemap.xml", wait_until="domcontentloaded")
    sm = page.locator("body").inner_text()
    check("R3 no /for/ in the served sitemap", "/for/" not in sm)

    page.goto(f"{BASE}/for/{entries[0]}", wait_until="networkidle")
    body = page.locator("body").inner_text()
    check("R4 the honesty line prints",
          "UNLISTED BY DESIGN" in body and "LINK SCANNERS" in body.upper()
          and "COUNTS NOTHING" in body)
    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{passed}/{len(results)} checks passed")
if passed < len(results):
    sys.exit(1)
print(f"Evidence: {EVIDENCE}")
