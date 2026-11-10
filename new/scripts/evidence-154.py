#!/usr/bin/env python3
"""[1.5.4] behavioral evidence — the claims HTML can't prove.

Playwright (chromium, sync). Evidence lands in download/evidence-154/.
  1. Opening the AskOmkar drawer fires ZERO requests to the model CDN
     (the ~23 MB download used to start 700ms after open).
  2. A chip click answers instantly, still with no CDN request.
  3. The first free-typed question answers by keyword (note present) and
     only THEN triggers the background model warm-up.
  4. [1.5.2] regression: the /library servepoint zip chip still builds a
     real 11-entry ZIP in the browser.
  5. /uiux/taar renders the live prototype iframe (embed wired).
"""

import os
import re
import shutil
import zipfile
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.environ.get("VERIFY_BASE", "http://localhost:3000")
OUT = Path("/home/z/my-project/download/evidence-154")
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

CDN = "cdn.jsdelivr.net"
ok = fail = 0


def check(label, cond):
    global ok, fail
    print(("PASS " if cond else "FAIL ") + label)
    ok += bool(cond)
    fail += (not cond)


with sync_playwright() as pw:
    browser = pw.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1366, "height": 900}, accept_downloads=True)
    page = ctx.new_page()
    cdn_hits = []

    def on_request(req):
        if CDN in req.url:
            cdn_hits.append(req.url)

    page.on("request", on_request)

    # --- 1 + 2: drawer open and chip answer cost nothing ---
    page.goto(BASE + "/", wait_until="networkidle")
    cdn_hits.clear()
    page.click(".ao-pill")
    page.wait_for_timeout(2000)  # longer than the old 700ms warm-up trigger
    check("drawer open: zero model CDN requests", len(cdn_hits) == 0)

    page.click(".ao-chip >> nth=0")
    page.wait_for_selector(".ao-msg >> nth=2", timeout=5000)
    check("chip answer: instant, still zero CDN requests", len(cdn_hits) == 0)
    page.screenshot(path=str(OUT / "askomkar-chip-instant.png"))

    # --- 3: first free question = keyword answer, then background warm ---
    page.fill(".ao-form input", "what does ssshopoe run on?")
    page.press(".ao-form input", "Enter")
    page.wait_for_timeout(1500)
    log_text = page.inner_text(".ao-log")
    check("first free question: keyword note shown", "Matched by keyword" in log_text)
    check("first free question: answer not held hostage", "Warming up the matcher" not in log_text)
    page.wait_for_timeout(2500)
    check("model warms in background after first question", len(cdn_hits) >= 1)
    page.screenshot(path=str(OUT / "askomkar-keyword-first.png"))

    # --- 4: /library zip chip still builds a real zip ---
    page.goto(BASE + "/library", wait_until="networkidle")
    chip = page.locator("summary button", has_text="download ↓ 11").first
    chip.scroll_into_view_if_needed()
    with page.expect_download(timeout=60000) as dl:
        chip.click()
    zpath = OUT / "servepoint-design-system.zip"
    dl.value.save_as(str(zpath))
    with zipfile.ZipFile(zpath) as z:
        names = z.namelist()
    check("servepoint zip: 11 entries", len(names) == 11)
    check("servepoint zip: real file contents", any(n.endswith("design-system.md") or "tokens" in n for n in names))
    print(f"       zip entries: {names[:4]}...")

    # --- 5: /uiux/taar renders the live prototype iframe ---
    page.goto(BASE + "/uiux/taar", wait_until="networkidle")
    # The DeviceFrame mounts its iframe only when the frame is near the
    # viewport (IntersectionObserver) — bring the Try it row into view first.
    page.locator(".ux-tryit").scroll_into_view_if_needed()
    page.wait_for_selector('iframe[title="Live prototype of Taar"]', timeout=15000)
    src = page.get_attribute('iframe[title="Live prototype of Taar"]', "src")
    check("taar case: prototype iframe embeds the stage", src and src.endswith("/uiux/taar/prototype/embed"))
    page.wait_for_timeout(3000)
    page.screenshot(path=str(OUT / "taar-tryit-embed.png"))

    # --- evidence screenshots of the changed pages ---
    page.goto(BASE + "/", wait_until="load")
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / "home-chips.png"), full_page=False)
    skills = page.locator("#skills")
    skills.scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(path=str(OUT / "home-skills-learning.png"))
    page.goto(BASE + "/library", wait_until="load")
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / "library-top.png"))
    browser.close()

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
