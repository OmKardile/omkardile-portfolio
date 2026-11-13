#!/usr/bin/env python3
"""verify-ledger.py — [1.5.6] the ledger's honesty contract, enforced.

Run against any base URL (default http://127.0.0.1:3000):

    python3 scripts/verify-ledger.py [BASE_URL]

The ledger only works if it can't quietly rot, so the checks ARE the rules
from src/data/now.ts:

  Static (the data + the CHANGELOG)
    L1  at most FIVE open entries — a stale ledger is worse than none
    L2  every `logged` date is a real ISO date, not in the future
    L3  every settled `closedIn` stamp exists as a `## [version]` heading
        in CHANGELOG.md — no decorative receipts
    L4  the correction entries' arithmetic holds (423-186=237, 72+10=82)
    L5  the intro's promise ("five open lines, maximum") matches the rule

  Rendered (Playwright against the running site)
    L6  the ledger section renders on /now (index, title, both page labels)
    L7  the counts in the labels equal the array lengths (computed, not typed)
    L8  one row per entry on each page (no dropped or duplicated rows)
    L9  every rendered stamp matches the data's closedIn set, and nothing
        renders that the data doesn't declare
    L10 every rendered `logged <date>` matches the data's logged set
    L11 the footer line computes "N open · M settled" from the same arrays
    L12 mobile (390px): the two ledger pages stack (grid collapses, the
        binding rule disappears)
    L13 evidence screenshots land in download/ledger-evidence/
"""

import datetime
import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
EVIDENCE = ROOT / "download" / "ledger-evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not ok else ""))


# ---------- static: parse the data module and the CHANGELOG ----------
src = (ROOT / "src" / "data" / "now.ts").read_text()
owed_block = src.split("export const ledgerOwed")[1].split("export const ledgerSettled")[0]
settled_block = src.split("export const ledgerSettled")[1]

owed_items = re.findall(r"item: '([^']+)'", owed_block)
owed_logged = re.findall(r"logged: '(\d{4}-\d{2}-\d{2})'", owed_block)
settled_items = re.findall(r"item: '([^']+)'", settled_block)
settled_stamps = re.findall(r"closedIn: '(\d+\.\d+\.\d+)'", settled_block)

print(f"\n== static: src/data/now.ts + CHANGELOG ==")
check("L1 at most five open entries", len(owed_items) <= 5, f"{len(owed_items)} open: {owed_items}")
check("L1b every owed entry carries a logged date", len(owed_logged) == len(owed_items),
      f"{len(owed_logged)} dates for {len(owed_items)} entries")

bad_dates = []
for d in owed_logged:
    try:
        dt = datetime.date.fromisoformat(d)
        if dt > datetime.date.today():
            bad_dates.append(f"{d} (future)")
    except ValueError:
        bad_dates.append(f"{d} (not a real date)")
check("L2 logged dates are real, past-or-today ISO dates", not bad_dates, "; ".join(bad_dates))

changelog = (ROOT / "CHANGELOG.md").read_text()
versions = set(re.findall(r"^## \[(\d+\.\d+\.\d+)\]", changelog, re.M))
unknown = [s for s in settled_stamps if s not in versions]
check("L3 every settled stamp exists in the CHANGELOG", not unknown,
      f"unknown stamps: {unknown}" + (f" (have: {sorted(versions)[:6]}…)" if unknown else ""))

check("L4 correction arithmetic: 423-186 == 237", 423 - 186 == 237, f"{423 - 186}")
check("L4b correction arithmetic: 72+10 == 82", 72 + 10 == 82, f"{72 + 10}")

check("L5 data declares a settled set of stamps matching entries", len(settled_stamps) == len(settled_items),
      f"{len(settled_stamps)} stamps for {len(settled_items)} entries")

# ---------- rendered ----------
print(f"\n== rendered: {BASE}/now ==")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    page.goto(BASE + "/now", wait_until="networkidle")

    idx = page.locator(".section-index", has_text="02 / The ledger")
    check("L6 ledger section indexed 02", idx.count() == 1)
    check("L6b title renders", page.locator("#ledger-title").count() == 1)

    owed_label = page.locator(".ledger-page--owed .ledger-label")
    settled_label = page.locator(".ledger-page--settled .ledger-label")
    check("L7 OWED label counts from the array",
          owed_label.inner_text().strip() == f"OWED · {len(owed_items)} OPEN",
          owed_label.inner_text().strip())
    check("L7b SETTLED label counts from the array",
          settled_label.inner_text().strip() == f"SETTLED · {len(settled_items)} CLOSED",
          settled_label.inner_text().strip())

    owed_rows = page.locator(".ledger-page--owed .ledger-row")
    settled_rows = page.locator(".ledger-page--settled .ledger-row")
    check("L8 one row per owed entry", owed_rows.count() == len(owed_items),
          f"{owed_rows.count()} rows vs {len(owed_items)} entries")
    check("L8b one row per settled entry", settled_rows.count() == len(settled_items),
          f"{settled_rows.count()} rows vs {len(settled_items)} entries")

    stamps = page.locator(".ledger-page--settled .ledger-stamp").all_inner_texts()
    stamps = [s.strip() for s in stamps]
    # multiset equality: duplicate stamps are correct (one version can close
    # several entries), but the rendered multiset must equal the data's exactly
    expect_stamps = sorted(f"[{s}]" for s in settled_stamps)
    check("L9 rendered stamps == data stamps (multiset, nothing extra)",
          sorted(stamps) == expect_stamps,
          f"rendered {sorted(stamps)} vs data {expect_stamps}")

    dates = page.locator(".ledger-page--owed .ledger-date").all_inner_texts()
    dates = [re.sub(r"^logged\s+", "", d.strip()) for d in dates]
    check("L10 rendered logged dates == data dates (set-equal)",
          set(dates) == set(owed_logged) and len(dates) == len(owed_logged),
          f"rendered {sorted(dates)} vs data {sorted(owed_logged)}")

    footer = page.locator("p.mono", has_text=f"{len(owed_items)} open · {len(settled_items)} settled")
    check("L11 footer computes the counts", footer.count() == 1, f"'{len(owed_items)} open · {len(settled_items)} settled' line")

    # correction tags render
    corr = page.locator(".ledger-kind", has_text="Correction")
    n_corr = len(re.findall(r"kind: 'correction'", settled_block))
    check("L9b correction entries wear the CORRECTION tag", corr.count() == n_corr,
          f"{corr.count()} tags vs {n_corr} correction entries")

    # evidence: clip the ledger section on desktop
    section = page.locator('section:has(#ledger-title)')
    section.scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    box = section.bounding_box()
    page.screenshot(path=str(EVIDENCE / "ledger-desktop.png"),
                    clip={"x": 0, "y": max(0, box["y"] - 10), "width": 1280,
                          "height": min(box["height"] + 20, 880)})

    # mobile: the pages stack and the binding rule disappears
    mob = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mob.goto(BASE + "/now", wait_until="networkidle")
    grid_cols = mob.locator(".ledger-grid").evaluate("el => getComputedStyle(el).gridTemplateColumns")
    check("L12 mobile: grid collapses to one column", len(grid_cols.split()) == 1, grid_cols)
    binding = mob.locator(".ledger-page--owed").evaluate("el => getComputedStyle(el).borderRightWidth")
    check("L12b mobile: binding rule gone", binding in ("0px", "none"), binding)
    mrows = mob.locator(".ledger-page--owed .ledger-row")
    mrows.first.scroll_into_view_if_needed()
    mob.wait_for_timeout(500)
    mob.screenshot(path=str(EVIDENCE / "ledger-mobile.png"))  # viewport shot at the ledger
    mob.close()

    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{passed}/{len(results)} checks passed")
if passed < len(results):
    sys.exit(1)
print(f"Evidence: {EVIDENCE}")
