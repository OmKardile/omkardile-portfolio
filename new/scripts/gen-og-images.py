#!/usr/bin/env python3
"""Generate the site's Open Graph card images (1200x630) into public/og/.

Design: the site's own ink system — white paper, ink #18181b, hairline
frame, mono meta line, oversized display title, one accent bar. Rendered
with headless Chromium via Playwright from inline HTML, so the type is real
browser type, not Pillow approximations. Fonts: the sandbox's DejaVu family
(the site's Archivo/Fragment Mono aren't installed here; DejaVu Sans Bold
and DejaVu Sans Mono keep the grotesk/mono split of the site).

Usage: python3 scripts/gen-og-images.py   (writes 7 PNGs, prints sizes)
"""

from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
OUT.mkdir(parents=True, exist_ok=True)

INK = "#18181b"
PAPER = "#ffffff"
MUTED = "#5c5c66"
LINE = "#e4e4e9"

# file, meta line, title, sub line, accent, right label, url path
CARDS = [
    ("uiux.png", "OMKAR KARDILE · UI/UX DESIGN PORTFOLIO", "I design interfaces that are honest.",
     "Three case studies, the prototypes embedded, the Liquid Glass redesigns — then I build what I design.",
     "#ea580c", "OPEN TO WORK", "omkardile.is-a.dev/uiux"),
    ("uiux-taar.png", "OMKAR KARDILE · UI/UX CASE STUDY 01", "Taar.",
     "Fashion discovery — fewer taps to narrow the catalogue.",
     "#1F2A44", "CASE STUDY · IN PROGRESS", "omkardile.is-a.dev/uiux/taar"),
    ("uiux-ghar.png", "OMKAR KARDILE · UI/UX CASE STUDY 02", "Ghar.",
     "Home-cooked tiffin around Pimpri-Chinchwad — a three-step order flow.",
     "#A63D1F", "CASE STUDY · IN PROGRESS", "omkardile.is-a.dev/uiux/ghar"),
    ("uiux-sutra.png", "OMKAR KARDILE · UI/UX CASE STUDY 03", "Sutra.",
     "A forgiving mobile checkout, on a design system two stores share.",
     "#2563eb", "CASE STUDY · IN PROGRESS", "omkardile.is-a.dev/uiux/sutra"),
    ("now.png", "OMKAR KARDILE · /NOW · UPDATED NOVEMBER 2026", "Now.",
     "What I'm building and looking for at this exact moment — dated, so it can go stale honestly.",
     "#2563eb", "THE DATED PRESENT", "omkardile.is-a.dev/now"),
    ("colophon.png", "OMKAR KARDILE · /COLOPHON", "Colophon.",
     "How this site is made — the type, the ink, the motion and the machine underneath.",
     "#18181b", "THE RECEIPT", "omkardile.is-a.dev/colophon"),
    ("library.png", "OMKAR KARDILE · /LIBRARY", "Library.",
     "The docs, as shipped — rendered whole from the repo, with the design systems downloadable as zips.",
     "#18181b", "THE DOCS", "omkardile.is-a.dev/library"),
]

HTML = """<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {{ font-family:'DVS'; src: local('DejaVu Sans'); font-weight:400; }}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html,body {{ width:1200px; height:630px; background:{paper}; }}
  .card {{
    width:1200px; height:630px; position:relative;
    font-family:'DVS', sans-serif; color:{ink};
    padding:64px 72px; display:flex; flex-direction:column;
    outline:1px solid {line}; outline-offset:-24px;
  }}
  .meta {{
    font-family:'DejaVu Sans Mono', monospace; font-size:19px; letter-spacing:2.5px;
    color:{muted}; display:flex; justify-content:space-between; align-items:center;
  }}
  .bar {{ width:150px; height:10px; background:{accent}; margin-top:26px; }}
  h1 {{
    font-size:112px; font-weight:700; letter-spacing:-3px; line-height:1.02;
    margin-top:34px; flex:0 0 auto; max-width:1000px;
  }}
  .sub {{
    font-size:30px; line-height:1.42; color:{muted}; margin-top:22px; max-width:880px;
  }}
  .foot {{
    margin-top:auto; display:flex; justify-content:space-between; align-items:center;
    font-family:'DejaVu Sans Mono', monospace; font-size:18px; color:{muted};
    border-top:1px solid {line}; padding-top:22px;
  }}
  .tag {{ color:{accent}; letter-spacing:2px; }}
</style></head>
<body>
  <div class="card">
    <div class="meta"><span>{meta}</span><span class="tag">{tag}</span></div>
    <div class="bar"></div>
    <h1>{title}</h1>
    <p class="sub">{sub}</p>
    <div class="foot"><span>{url}</span><span>OMKARDILE.IS-A.DEV</span></div>
  </div>
</body></html>
"""


def main() -> None:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        for fname, meta, title, sub, accent, tag, url in CARDS:
            html = HTML.format(
                paper=PAPER, ink=INK, muted=MUTED, line=LINE,
                accent=accent, meta=meta, title=title, sub=sub, tag=tag, url=url,
            )
            page.set_content(html, wait_until="networkidle")
            page.evaluate("document.fonts.ready.then(() => true)")
            path = OUT / fname
            page.screenshot(path=str(path))
            print(f"{fname}: {path.stat().st_size} bytes")
        browser.close()


if __name__ == "__main__":
    main()
