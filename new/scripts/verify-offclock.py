#!/usr/bin/env python3
"""verify-offclock.py — [1.5.7] the off-the-clock overhaul, enforced.

Run against any base URL (default http://127.0.0.1:3000):

    python3 scripts/verify-offclock.py [BASE_URL]

The rules the change promised, checked in code:

  Static (the data + the CHANGELOG)
    S1  the rotation kept Daft Punk and dropped the rest of the old queue
    S2  the new queue is Her's (x2), Niyam, Daft Punk — attributed correctly
    S3  the player state is one of the honest three, and never the old
        fake 'playing' — LAST PLAYED is the shipped truth
    S4  the bag: Vapurza (V. P. Kale), Durjoy Datta, Berserk, Vagabond in;
        the old shelf kept; every book carries a genre chip
    S5  learning: ServiceNow present, five topics
    S6  screens: Film and Games present
    S7  Ko-fi in the socials, clean URL (no #setGoalModal fragment)

  Rendered (Playwright against the running site)
    R1  the page says LAST PLAYED and never claims NOW PLAYING
    R2  the disc renders and sits STILL (no spin while last-played)
    R3  four rotation rows, EP + ON REPEAT chips, none of the old tracks
    R4  seven book rows with MARATHI / ROMANCE / MANGA / DESIGN chips
    R5  five learning rows, ServiceNow first
    R6  section indexes 01-08 each exactly once, with the new 06 / On the side
    R7  Ko-fi renders on /now and in the site chrome (>= 2 links)
    R8  evidence screenshots in download/offclock-evidence/
"""

import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
EVIDENCE = ROOT / "download" / "offclock-evidence"
EVIDENCE.mkdir(parents=True, exist_ok=True)

results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail and not ok else ""))


# ---------- static ----------
now_src = (ROOT / "src" / "data" / "now.ts").read_text()
site_src = (ROOT / "src" / "data" / "site.ts").read_text()


def ts_array(src, name):
    """Slice one exported array out of the TS source. Anchors on the exact
    `export const <name>:` form so `playlists` can't shadow `playlist`."""
    m = re.search(rf"export const {re.escape(name)}[:\s]", src)
    return src[m.start():].split("];")[0] if m else ""


def field(block, key):
    return re.findall(rf"{key}: (['\"])(.+?)\1", block)


rotation = ts_array(now_src, "playlist")
titles = [t for _, t in field(rotation, "title")]
artists = [a for _, a in field(rotation, "artist")]

old_queue = {"Holocene", "The Less I Know the Better", "Alright", "Space Song"}
check("S1 old queue gone, Daft Punk kept",
      not (set(titles) & old_queue) and "Something About Us" in titles,
      f"titles: {titles}")

check("S2 new queue attributed right",
      titles == ["Harvey", "Invitation to Her's", "zikr", "Something About Us"]
      and artists.count("Her's") == 2 and artists.count("Niyam") == 1
      and artists.count("Daft Punk") == 1,
      f"{list(zip(titles, artists))}")

np_block = ts_array(now_src, "nowPlaying")
np_status = re.search(r"status: '([a-z-]+)'", np_block).group(1)
check("S3 player state is honest (never the old fake 'playing')",
      np_status in {"now-playing", "last-played", "paused"} and np_status != "playing"
      and np_status == "last-played",
      f"status: {np_status}")

shelf = ts_array(now_src, "reading")
shelf_titles = [t for _, t in field(shelf, "title")]
kinds = [k for _, k in field(shelf, "kind")]
check("S4a new books in", all(t in shelf_titles for t in
      ["Vapurza", "Of Course I Love You!.. Till I Find Someone Better", "Berserk", "Vagabond"]),
      f"shelf: {shelf_titles}")
check("S4b old shelf kept", all(t in shelf_titles for t in
      ["The Design of Everyday Things", "Refactoring UI", "Shape Up"]))
check("S4c every book wears a genre chip", len(kinds) == len(shelf_titles) and set(kinds) ==
      {"Marathi", "Romance", "Manga", "Design"}, f"kinds: {kinds}")
check("S4d Vapurza credited to V. P. Kale",
      any("V. P. Kale" in a for _, a in field(shelf, "author")))

learning = ts_array(now_src, "learning")
topics = [t for _, t in field(learning, "topic")]
check("S5 ServiceNow in learning, five topics", len(topics) == 5 and topics[0] == "ServiceNow",
      f"topics: {topics}")

screens_block = ts_array(now_src, "screens")
screens_labels = [l for _, l in field(screens_block, "label")]
check("S6 Film and Games present", screens_labels == ["Film", "Games"], f"{screens_labels}")

kofi = re.search(r"\{[^}]*Ko-fi[^}]*\}", site_src)
check("S7 Ko-fi in the socials, clean URL",
      bool(kofi) and "ko-fi.com/whysoserious_omik" in kofi.group(0)
      and "setGoalModal" not in kofi.group(0),
      kofi.group(0) if kofi else "no Ko-fi entry")

changelog = (ROOT / "CHANGELOG.md").read_text()
check("S8 CHANGELOG has the [1.5.7] entry", "## [1.5.7] — 2026-11-13" in changelog)

# ---------- rendered ----------
print(f"\n== rendered: {BASE}/now ==")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    page.goto(BASE + "/now", wait_until="networkidle")
    body = page.locator("body").inner_text()

    check("R1 says LAST PLAYED, never claims NOW PLAYING",
          "LAST PLAYED" in body and "NOW PLAYING" not in body)

    disc = page.locator(".disc")
    check("R2 disc renders and sits still",
          disc.count() == 1
          and disc.evaluate("el => getComputedStyle(el).animationName") == "none",
          disc.evaluate("el => getComputedStyle(el).animationName") if disc.count() else "no disc")

    rot_titles = page.locator('section:has(#listening-title) .player-card ~ div > p > strong')
    check("R3a four rotation rows", rot_titles.count() == 4,
          f"{rot_titles.count()} rows — selector counts only rotation rows, not the playlists block")
    chips = [c.strip() for c in page.locator(".tag-chip").all_inner_texts()]
    check("R3b EP + ON REPEAT chips rendered", "EP" in chips and "ON REPEAT" in chips,
          f"chips: {chips}")
    check("R3c none of the old tracks on the page",
          not any(t in body for t in old_queue))

    book_rows = page.locator('section:has(#reading-title) > div > div')
    check("R4a seven book rows", book_rows.count() == 7, f"{book_rows.count()} rows")
    for k in ("MARATHI", "ROMANCE", "MANGA", "DESIGN"):
        check(f"R4b {k} chip rendered", k in chips)
    check("R4c Vapurza + author on the page", "Vapurza" in body and "V. P. Kale" in body)

    learn_rows = page.locator('section:has(#learning-title) > div > div')
    check("R5 five learning rows, ServiceNow first",
          learn_rows.count() == 5 and body.find("ServiceNow") < body.find("WebGL & GLSL"),
          f"{learn_rows.count()} rows")

    indexes = page.locator(".section-index").all_inner_texts()
    expect = [f"0{i} /" for i in range(1, 9)]
    check("R6 indexes 01-08 each exactly once",
          [i.split(" ")[0] for i in indexes] == [f"0{i}" for i in range(1, 9)],
          f"{indexes}")
    check("R6b new section titled On the side", "06 / On the side" in indexes)
    for label in ("Film", "Games"):
        check(f"R6c {label} row rendered", label in body)

    kofi_on_now = page.locator('a[href*="ko-fi.com"]')
    check("R7 Ko-fi link on /now (the Elsewhere list)", kofi_on_now.count() == 1,
          f"{kofi_on_now.count()} links")
    frag = kofi_on_now.first.get_attribute("href") if kofi_on_now.count() else ""
    check("R7b Ko-fi href clean (no #fragment)", frag and "#" not in frag, frag)

    # the one-source contract: home page and JSON-LD sameAs carry Ko-fi too
    home = browser.new_page(viewport={"width": 1280, "height": 900})
    home.goto(BASE + "/", wait_until="networkidle")
    check("R7c Ko-fi on the home page socials", home.locator('a[href*="ko-fi.com"]').count() == 1)
    ld = home.locator('script[type="application/ld+json"]').all_inner_texts()
    check("R7d Ko-fi in JSON-LD sameAs", any("ko-fi.com" in s for s in ld))
    home.close()

    # evidence
    page.locator("#listening-title").scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    box = page.locator('section:has(#listening-title)').bounding_box()
    page.screenshot(path=str(EVIDENCE / "listening-desktop.png"),
                    clip={"x": 0, "y": max(0, box["y"] - 10), "width": 1280,
                          "height": min(box["height"] + 20, 880)})
    page.locator("#reading-title").scroll_into_view_if_needed()
    page.wait_for_timeout(400)
    rbox = page.locator('section:has(#reading-title)').bounding_box()
    page.screenshot(path=str(EVIDENCE / "reading-desktop.png"),
                    clip={"x": 0, "y": max(0, rbox["y"] - 10), "width": 1280,
                          "height": min(rbox["height"] + 20, 880)})

    mob = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mob.goto(BASE + "/now", wait_until="networkidle")
    mob.locator("#listening-title").scroll_into_view_if_needed()
    mob.wait_for_timeout(500)
    mob.screenshot(path=str(EVIDENCE / "listening-mobile.png"))
    mob.close()
    browser.close()

passed = sum(1 for _, ok, _ in results if ok)
print(f"\n{passed}/{len(results)} checks passed")
if passed < len(results):
    sys.exit(1)
print(f"Evidence: {EVIDENCE}")
