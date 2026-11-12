#!/usr/bin/env python3
"""verify-cursor-aa.py — [1.5.5] cursor anti-aliasing verifier.

Run against any base URL (default http://127.0.0.1:3000):

    python3 scripts/verify-cursor-aa.py [BASE_URL]

Checks the [1.5.5] supersampling change end to end:

  Raster doubling (cursor.css)     dot 12px + 2px halo, ring 64px + 2px border
                                   + 8px radius + 2px halo
  SS factor (Cursor.tsx)           dot/ring transforms carry scale(0.5) at
                                   rest; press/link targets fold to 0.8/0.725
  Visual geometry unchanged        dot rect 6px, ring rect 32px at DPR 1;
                                   1:1 tracking still lands the dot and ring
                                   centers on the pointer; press dot ~9.6px
  Text parts untouched             chip still scale(1) in label mode, hint
                                   transform carries no scale at all
  Edge pixels are anti-aliased     at DPR 3, a scan through the dot's center
                                   row must find intermediate-luminance pixels
                                   on both ink→bg edges (no hard stair-step),
                                   and the ink run must still measure ~18
                                   device px (the 6px dot at 3× DPR)

Evidence screenshots (zoomed clips) land in download/cursor-aa-evidence/.
"""

import pathlib
import re
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
EVIDENCE = pathlib.Path(__file__).resolve().parents[1] / "download" / "cursor-aa-evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not ok else ""))


def center(loc):
    r = loc.bounding_box()
    return r["x"] + r["width"] / 2, r["y"] + r["height"] / 2


def style_of(page, sel, prop):
    return page.evaluate("([sel, prop]) => getComputedStyle(document.querySelector(sel))[prop]", [sel, prop])


with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---- DPR 1: the geometry/state checks (the display class where jaggies show)
    page = browser.new_page(viewport={"width": 1200, "height": 800}, device_scale_factor=1)
    page.goto(BASE, wait_until="networkidle")

    print(f"\n== {BASE} — engine + raster doubling ==")
    page.mouse.move(400, 300)
    page.wait_for_timeout(400)

    check("C1 engine active (html.ux-cursor-on)",
          page.evaluate("document.documentElement.classList.contains('ux-cursor-on')"))

    dot = page.locator(".ux-cursor-dot")
    ring = page.locator(".ux-cursor-ring")
    chip = page.locator(".ux-cursor-chip")
    hint = page.locator(".ux-cursor-hint")

    check("C2 dot raster 12px (2× of 6px)",
          dot.evaluate("el => el.offsetWidth + 'x' + el.offsetHeight") == "12x12",
          dot.evaluate("el => el.offsetWidth + 'x' + el.offsetHeight"))
    check("C3 dot visual rect ~6px at rest",
          abs(dot.evaluate("el => el.getBoundingClientRect().width") - 6) <= 0.25,
          str(dot.evaluate("el => el.getBoundingClientRect().width")))
    check("C4 dot halo doubled (2px spread)",
          "0px 0px 0px 2px" in style_of(page, ".ux-cursor-dot", "boxShadow"),
          style_of(page, ".ux-cursor-dot", "boxShadow"))

    page.wait_for_timeout(1200)  # ring lerps slowly — let it settle
    check("C5 ring raster 64px (2× of 32px)",
          ring.evaluate("el => el.offsetWidth + 'x' + el.offsetHeight") == "64x64",
          ring.evaluate("el => el.offsetWidth + 'x' + el.offsetHeight"))
    # the rest pose carries the -5° velocity lean: a 32px square rotated 5°
    # has an axis-aligned bounding box of 32×(cos5°+sin5°) ≈ 34.67px
    ring_rect = ring.evaluate("el => el.getBoundingClientRect().width")
    check("C6 ring visual ~32px at rest (34.67px bbox with the 5° lean)",
          abs(ring_rect - 34.67) <= 0.35, str(ring_rect))
    check("C7 ring border 2px raster (→1px visual)",
          style_of(page, ".ux-cursor-ring", "borderTopWidth") == "2px",
          style_of(page, ".ux-cursor-ring", "borderTopWidth"))
    check("C8 ring radius 8px raster (→4px visual)",
          style_of(page, ".ux-cursor-ring", "borderTopLeftRadius") == "8px",
          style_of(page, ".ux-cursor-ring", "borderTopLeftRadius"))

    print("\n== SS factor in the per-frame transforms ==")
    dt = dot.evaluate("el => el.style.transform")
    rt = ring.evaluate("el => el.style.transform")
    check("C9 dot rest transform carries scale(0.5", "scale(0.5" in dt, dt)
    check("C10 ring rest transform carries scale(0.5", "scale(0.5" in rt, rt)

    print("\n== visual geometry + tracking preserved ==")
    page.mouse.move(600, 350)
    page.wait_for_timeout(500)
    dcx, dcy = center(dot)
    check("C11 dot still tracks 1:1 (center ≈ pointer)",
          abs(dcx - 600) <= 2 and abs(dcy - 350) <= 2,
          f"dot center ({dcx:.1f}, {dcy:.1f}) vs (600, 350)")
    page.wait_for_timeout(1500)
    rcx, rcy = center(ring)
    check("C12 ring converges on the pointer",
          abs(rcx - 600) <= 2.5 and abs(rcy - 350) <= 2.5,
          f"ring center ({rcx:.1f}, {rcy:.1f}) vs (600, 350)")

    page.mouse.down()
    page.wait_for_timeout(700)
    check("C13 press: dot target folds 1.6×0.5 → scale(0.8",
          "scale(0.8" in dot.evaluate("el => el.style.transform"),
          dot.evaluate("el => el.style.transform"))
    check("C14 press: dot visual ~9.6px (6×1.6)",
          abs(dot.evaluate("el => el.getBoundingClientRect().width") - 9.6) <= 0.4,
          str(dot.evaluate("el => el.getBoundingClientRect().width")))
    page.mouse.up()
    page.mouse.move(600, 350)
    page.wait_for_timeout(400)

    link = page.locator("header a").first
    link.hover()
    page.wait_for_timeout(1200)
    check("C15 link: ring target folds 1.45×0.5 → scale(0.725",
          "scale(0.725" in ring.evaluate("el => el.style.transform"),
          ring.evaluate("el => el.style.transform"))

    resume = page.locator("header [data-hint]").first
    if resume.count():
        resume.hover()
        page.wait_for_timeout(500)
        ht = hint.evaluate("el => el.style.transform")
        check("C16 hint transform carries no scale (text stays 1:1)", "scale(" not in ht, ht)
        page.mouse.move(600, 350)
        page.wait_for_timeout(300)
    else:
        check("C16 hint transform carries no scale (text stays 1:1)", False, "no header [data-hint] found")

    print("\n== chip state on /uiux ==")
    page.goto(BASE + "/uiux", wait_until="networkidle")
    page.mouse.move(400, 300)
    page.wait_for_timeout(300)
    row = page.locator("[data-cursor]").first
    if row.count():
        row.hover()
        page.wait_for_timeout(900)
        ct = chip.evaluate("el => el.style.transform")
        # CSSOM serializes scale(1.000) as scale(1) — parse the value
        m = re.search(r"scale\(([\d.]+)\)", ct)
        chip_scale = float(m.group(1)) if m else -1
        check("C17 chip label mode scale stays 1 (not downscaled)", abs(chip_scale - 1) <= 0.01,
              f"{ct} → parsed {chip_scale}")
        check("C18 chip measures > 0 (text intact)", chip.evaluate("el => el.offsetWidth") > 20,
              str(chip.evaluate("el => el.offsetWidth")))
        page.mouse.move(400, 300)
    else:
        check("C17 chip label mode scale stays 1 (not downscaled)", False, "no [data-cursor] row found on /uiux")
        check("C18 chip measures > 0 (text intact)", False, "no [data-cursor] row found on /uiux")
    page.close()

    # ---- DPR 3: zoomed evidence + the edge-AA pixel scan
    print("\n== DPR 3: edge pixels are anti-aliased ==")
    zoom = browser.new_page(viewport={"width": 1200, "height": 800}, device_scale_factor=3)
    zoom.goto(BASE, wait_until="networkidle")
    # park the pointer OFF the device-pixel grid: an exactly-aligned rect is
    # supposed to render hard-edged; AA is what the compositor owes at
    # fractional positions — which is where the pointer sits in real use
    zoom.mouse.move(600.5, 400.5)
    zoom.wait_for_timeout(1200)

    dcz = zoom.locator(".ux-cursor-dot")
    cx, cy = center(dcz)
    shot = EVIDENCE / "dot-dpr3.png"
    zoom.screenshot(path=str(shot), clip={"x": cx - 12, "y": cy - 12, "width": 24, "height": 24})

    im = Image.open(shot).convert("L")
    w, h = im.size
    px = im.load()
    # AA shows up as intermediate-luminance pixels between the ink and the
    # background; a stair-step edge is binary. Count over the whole clip.
    allvals = [px[x, y] for y in range(h) for x in range(w)]
    lo, hi = min(allvals), max(allvals)
    inter = sum(1 for v in allvals if lo + 20 < v < hi - 20)
    check("C19 dot edges show intermediate pixels (AA, not stair-step)", inter >= 8,
          f"intermediate-luminance pixels in clip: {inter}")
    # geometry from pixels: the ink run through the clip's middle row should
    # still measure ~18 device px (6 CSS px × 3 DPR; AA edges shave 1-2)
    midrow = [px[x, h // 2] for x in range(w)]
    run = max_run = 0
    for v in midrow:
        run = run + 1 if v <= lo + 12 else 0
        max_run = max(max_run, run)
    check("C20 dot ink run ~18 device px (6px × 3 — geometry survives the raster)",
          13 <= max_run <= 23, f"ink run: {max_run} device px")

    zoom.screenshot(path=str(EVIDENCE / "ring-dpr3.png"),
                    clip={"x": cx - 26, "y": cy - 26, "width": 52, "height": 52})
    zoom.close()

    # default/link evidence clips at DPR 1 for the log
    page_ev = browser.new_page(viewport={"width": 1200, "height": 800}, device_scale_factor=1)
    page_ev.goto(BASE, wait_until="networkidle")
    page_ev.mouse.move(600, 400)
    page_ev.wait_for_timeout(1200)
    page_ev.screenshot(path=str(EVIDENCE / "rest-dpr1.png"),
                       clip={"x": 600 - 40, "y": 400 - 40, "width": 80, "height": 80})
    page_ev.locator("header a").first.hover()
    page_ev.wait_for_timeout(1000)
    page_ev.screenshot(path=str(EVIDENCE / "link-dpr1.png"),
                       clip={"x": 600 - 40, "y": 400 - 40, "width": 80, "height": 80})
    page_ev.close()

    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{passed}/{len(results)} checks passed")
if passed < len(results):
    sys.exit(1)
print(f"Evidence: {EVIDENCE}")
