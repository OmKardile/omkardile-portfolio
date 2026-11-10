#!/usr/bin/env python3
"""[1.5.4] verifier — the honesty pass.

Runs against VERIFY_BASE (default http://localhost:3000) with urllib only.
Covers every [1.5.4] claim plus regression guards for [1.5.0]-[1.5.3]:
  - case studies: empty sections hidden in prod, Taar renamed, embeds wired
  - embed stages: chrome-free, noindexed
  - share cards: per-page og+twitter + 7 rendered OG images
  - library: 7 of 29 repos / 237 docs (fork dropped), AI note, sites guide
  - colophon: answer counts computed (82 = 72 + 10)
  - resume at /resume.pdf, learning chips, last-commit chips, bench card
  - [1.5.2] regression: the three download chips still live on the rows
"""

import os
import re
import urllib.request

BASE = os.environ.get("VERIFY_BASE", "http://localhost:3000")

ok = fail = 0


def get(path: str) -> str:
    return urllib.request.urlopen(BASE + path, timeout=30).read().decode("utf-8", "replace")


def strip_comments(html: str) -> str:
    return html.replace("<!-- -->", "")


def txt(html: str) -> str:
    return re.sub(r"<[^>]+>", "", strip_comments(html))


def check(label: str, cond: bool) -> None:
    global ok, fail
    print(("PASS " if cond else "FAIL ") + label)
    ok += bool(cond)
    fail += (not cond)


# ---------------------------------------------------------------- home
h = strip_comments(get("/"))
ht = txt(h)
check("home: 5 last-commit chips rendered", len(re.findall(r"last commit [A-Za-z]{3} \d{1,2}", ht)) == 5)
check("home: work note visitor-voiced", "Every link opens the real thing" in ht and "verified destinations" not in ht)
check("home: learning chips marked", "UX Research · learning" in ht and "Native iOS · learning" in ht)
check("home: learning legend", "evidence pending, the receipts land as they ship" in ht)
check("home: resume hosted on-site", "/resume.pdf" in h and "drive.google.com" not in ht)
check("home: og.png self card", 'property="og:image"' in h and "/og.png" in h)

# ------------------------------------------------------- case studies
t = strip_comments(get("/uiux/taar"))
tt = txt(t)
check("taar: Design rationale (renamed)", "Design rationale" in tt and ">Research<" not in t)
check("taar: 'Who it's for' hidden", "Who it\u2019s for" not in tt)
check("taar: 'Usability test' hidden", "Usability test" not in tt)
check("taar: no numbering gap (01..02 after rationale)", 'ux-section-n mono" aria-hidden="true">01<' in t and ">02<" in t)
check("taar: Try it with embed stage", "/uiux/taar/prototype/embed" in t and "Try it" in tt)
check("taar: live copy replaces deploy copy", "runs live on this site" in tt and "deploys separately and embeds" not in tt)
check("taar: og+twitter unique", "og:title\" content=\"Taar | UI/UX Case Study 01\"" in t and "twitter:title" in t and "/og/uiux-taar.png" in t)

s = strip_comments(get("/uiux/sutra"))
ss = txt(s)
check("sutra: empty sections hidden", "Who it\u2019s for" not in ss and "Usability test" not in ss)
check("sutra: Try it with embed stage", "/uiux/sutra/prototype/embed" in s)
check("sutra: deploy next-step removed", "Deploy separately; the embed lands" not in ss)
check("sutra: og+twitter unique", "/og/uiux-sutra.png" in s and "twitter:title" in s)

g = strip_comments(get("/uiux/ghar"))
gg = txt(g)
check("ghar: empty sections hidden", "Who it\u2019s for" not in gg and "Usability test" not in gg)
check("ghar: no embed (no prototype yet)", "Try it" not in gg)
check("ghar: deploy next-step kept (honest)", "Deploy separately; the embed lands" in gg)

# ------------------------------------------------------ embed stages
for slug in ("taar", "sutra"):
    e = get(f"/uiux/{slug}/prototype/embed")
    check(f"{slug} embed: noindex", "noindex" in e)
    check(f"{slug} embed: chrome suppressed", "body:has(.ux-embed-stage) .site-header" in e and ".ao-pill" in e)

# ------------------------------------------------------ share cards
for path, img, frag in [
    ("/now", "/og/now.png", "Now \u2014 what Omkar is building right now"),
    ("/colophon", "/og/colophon.png", "Colophon \u2014 how this site is made"),
    ("/library", "/og/library.png", "Library \u2014 the docs, as shipped"),
    ("/uiux", "/og/uiux.png", "UI/UX Design Portfolio"),
]:
    p = get(path)
    check(f"{path}: og+twitter own card", frag in p and img in p and "twitter:card" in p and "twitter:image" in p)

imgs_ok = True
for img in ["uiux", "uiux-taar", "uiux-ghar", "uiux-sutra", "now", "colophon", "library"]:
    r = urllib.request.urlopen(f"{BASE}/og/{img}.png", timeout=30)
    imgs_ok = imgs_ok and r.status == 200 and "image/png" in (r.headers.get("Content-Type") or "")
check("og: all 7 cards served as PNG", imgs_ok)

# ---------------------------------------------------------- library
l = strip_comments(get("/library"))
lt = txt(l)
sec02 = txt(l[l.index("02 / Across GitHub"):l.index("03 / The sites")])
check("library: 7 of 29 public repos", "7 of 29 public repos" in sec02)
check("library: 237 markdown documents", "237 markdown documents" in sec02)
check("library: 3 design systems", "3 design systems" in sec02)
check("library: FMHY fork gone", "FMHY edits" not in lt and "1337x" not in lt)
check("library: lead row is servepoint", sec02.index("servepoint") < sec02.index("handOff") < sec02.index("ecommerce-5.2"))
check("library: AI note pre-empts", "The tools draft; Omkar decides" in lt and "AGENT_LOG" in lt)
check("library: sites guide intact", "What my sites run on." in lt and "11 sites and apps" in lt)
check("library: hand bank still 72", "72 pre-written answers" in lt)
check("library: CHANGELOG card shows 1.5.4", "latest [1.5.4]" in lt or "1.5.4" in lt)
# [1.5.2] regression: the three download chips still sit on the rows
check("library: handOff download chip", "download \u2193 23" in strip_comments(l))
check("library: servepoint download chip", "download \u2193 11" in strip_comments(l))
check("library: ecommerce-5.2 download chip", "download \u2193 6" in strip_comments(l))

# --------------------------------------------------------- colophon
c = strip_comments(get("/colophon"))
ct = txt(c).replace("\u00a0", " ").replace("  ", " ")
check("colophon: 82 = 72 hand + 10 derived", "82 pre-written answers (72 hand-written, 10 derived" in ct)
check("colophon: model fetched on first ask", "fetched once when you first ask" in ct)
check("colophon: no typed 82 mismatch remains", "82 pre-written answers, embedded" not in ct)

# ------------------------------------------------------------- now
n = strip_comments(get("/now"))
nt = txt(n)
check("now: bench card stamps 1.5.4", "Version [1.5.4] just shipped" in nt)
check("now: playlists still intact", "THE PLAYLISTS" in n or "the playlists" in nt.lower())

# ---------------------------------------------------------- resume
r = urllib.request.urlopen(f"{BASE}/resume.pdf", timeout=30)
check("resume: served as PDF", r.status == 200 and "pdf" in (r.headers.get("Content-Type") or ""))

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
