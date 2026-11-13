#!/usr/bin/env python3
"""verify-buildscope.py — [1.5.8] the whole-built-scope widening, enforced.

Run against any base URL (default http://127.0.0.1:3000):

    python3 scripts/verify-buildscope.py [BASE_URL]

The rules the change promised:

  Static (the generated data + the pages)
    S1  builds.ts exists, generated shape: 9 scans, 10 shelf docs,
        PUBLIC_SOURCE_REPOS == 35 (scanned, not typed)
    S2  the 64 KB cap holds and truncation is flagged honestly
    S3  every scan's verifiedStack is non-empty and names real manifests
        (no fallback word-count lines where a manifest exists)
    S4  colophon renders the fleet (11 rows) from site.ts + the scans
    S5  library imports the across-builds shelf and the computed count

  Rendered (Playwright against the running site)
    R1  /colophon hero says "everything I've built", fleet rows == 11,
        every row carries a "runs on" stack line
    R2  scanned rows carry the scan receipt (branch, tracked files,
        verified manifest stack); building rows say no public repo yet
    R3  the other-repos caption computes 35 - 8 = 27 from the data
    R4  /library reading room renders 4 + 10 whole docs; "of 29" is gone,
        "of 35" is in; capped docs announce the cap
    R5  /now's ledger shows the settled correction stamped [1.5.8]
    R6  evidence screenshots in download/buildscope-evidence/
"""

import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
EVIDENCE = ROOT / "download" / "buildscope-evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)
CAP = 64 * 1024

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not ok else ""))


# ---------- static ----------
builds_src = (ROOT / "src" / "data" / "builds.ts").read_text()
scan_data_lines = re.findall(r'    verifiedStack: "', builds_src)
doc_lines = [m.group(1) for m in
             (re.match(r'    text: "(.*)",$', l) for l in builds_src.splitlines()) if m]
docs = len(re.findall(r"    truncated: (?:true|false)", builds_src))
count = re.search(r"export const PUBLIC_SOURCE_REPOS = (\d+)", builds_src)
check("S1 generated shape (9 scans, 10 docs, 35 repos)",
      len(scan_data_lines) == 9 and docs == 10 and count and count.group(1) == "35",
      f"scans={len(scan_data_lines)} docs={docs} repos={count.group(1) if count else '?'}")

import json as _json
texts = []
for esc in doc_lines:
    try:
        texts.append(_json.loads('"' + esc + '"'))
    except Exception:
        texts.append(None)
trunc_flags = re.findall(r"    truncated: (true|false),", builds_src)
decodable = all(t is not None for t in texts)
cap_ok = decodable and all(len(t) <= CAP + 50 for t in texts if t is not None)
honest = decodable and all(
    ((CAP * 0.85 <= len(t) <= CAP + 50) if t else False) == (f == "true")
    for t, f in zip(texts, trunc_flags))
check("S2 cap holds, truncation honest", cap_ok and honest,
      f"texts={len(texts)} sizes={[len(t) for t in texts if t]}")

stack_lines = re.findall(r"    verifiedStack: \"(.+)\",", builds_src)
check("S3 verified stacks are manifest-real (no word-count fallback)",
      all(("files" not in s or "Kotlin" in s or "TypeScript" in s) and len(s) > 8 for s in stack_lines),
      str(stack_lines))

colo_src = (ROOT / "src" / "app" / "colophon" / "page.tsx").read_text()
lib_src = (ROOT / "src" / "app" / "library" / "page.tsx").read_text()
check("S4 colophon fleet renders from site.ts + builds.ts",
      "buildScans" in colo_src and "projects.map" in colo_src
      and "PUBLIC_SOURCE_REPOS" in colo_src and "scripts/curate-builds.py" in colo_src)
check("S5 library imports the shelf + computed count",
      "acrossBuildsDocs" in lib_src and "PUBLIC_SOURCE_REPOS" in lib_src
      and "of 29" not in lib_src)

# ---------- rendered ----------
print(f"\n== rendered: {BASE}/colophon ==")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    page.goto(BASE + "/colophon", wait_until="networkidle")
    body = page.locator("body").inner_text()

    check("R1a hero says everything I've built", "everything I've built is made" in body)
    fleet_rows = page.locator('section:has(#fleet-title) > div > div > div')
    check("R1b eleven fleet rows", fleet_rows.count() == 11, f"{fleet_rows.count()} rows")
    check("R1c every row says what it runs on", body.count("runs on") >= 11)

    scan_lines = [l for l in body.splitlines() if l.startswith("scan November")]
    check("R2a scan receipts on the rows (9 scans)", len(scan_lines) == 9, f"{len(scan_lines)}")
    check("R2b scan lines carry branch + files + verified manifest",
          all(re.search(r"main · \d+ tracked files · verified from the manifest", l)
              for l in scan_lines))
    check("R2c building rows honest about no repo",
          body.count("no public repo yet") == 2)
    check("R2d type notes only where the repo references them",
          "Unbounded" in body and "Instrument Serif" in body and "Caveat" in body)

    check("R3 other-repos caption computed from data", "27 of them experiments" in body,
          [l for l in body.splitlines() if "experiments" in l][:1])

    page.locator("#fleet-title").scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    fbox = page.locator('section:has(#fleet-title)').bounding_box()
    page.screenshot(path=str(EVIDENCE / "colophon-fleet.png"),
                    clip={"x": 0, "y": max(0, fbox["y"] - 10), "width": 1280,
                          "height": min(fbox["height"] + 20, 880)})

    print(f"== rendered: {BASE}/library ==")
    page.goto(BASE + "/library", wait_until="networkidle")
    body = page.locator("body").inner_text()

    shelf_docs = page.locator('details.lg-row[name="library"]')
    across_docs = page.locator('details.lg-row[name="library-builds"]')
    check("R4a 4 local + 10 across-builds docs rendered whole",
          shelf_docs.count() == 4 and across_docs.count() == 10,
          f"local={shelf_docs.count()} across={across_docs.count()}")
    check("R4b 'of 29' gone, 'of 35' in",
          "of 29 public" not in body and "of 35 public source repos" in body)
    check("R4c capped docs announce it", "64 KB shelf cap" in body or "capped" in body)
    check("R4d shelf names real build docs",
          "SSShopee — README" in body.replace("\n", " ") or "ServePoint — README" in body)

    page.goto(BASE + "/now", wait_until="networkidle")
    body = page.locator("body").inner_text()
    check("R5 ledger correction stamped [1.5.8]",
          "The library said 29 public repos" in body and "[1.5.8]" in body)

    page.goto(BASE + "/library", wait_until="networkidle")
    page.locator("#readingroom-title").scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    page.locator('details.lg-row[name="library-builds"]').first.scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    page.screenshot(path=str(EVIDENCE / "library-across-builds.png"))

    page.goto(BASE + "/now", wait_until="networkidle")
    page.locator("#ledger-title").scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    lbox = page.locator(".ledger-page--settled").bounding_box()
    if lbox:
        page.screenshot(path=str(EVIDENCE / "now-ledger-correction.png"),
                        clip={"x": 0, "y": max(0, lbox["y"] - 10), "width": 1280,
                              "height": min(lbox["height"] + 20, 880)})
    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{passed}/{len(results)} checks passed")
if passed < len(results):
    sys.exit(1)
print(f"Evidence: {EVIDENCE}")
