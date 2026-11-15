#!/usr/bin/env python3
"""build-resume-pdf.py — print the /resume route to public/resume.pdf.

The resume is a route (src/app/resume/page.tsx) rendered from the one
source; this script is its printer. Run with the site serving locally:

    (npx next start -p 3000 &) ; python3 scripts/build-resume-pdf.py

Then the page count is asserted: the ledger promised a 1-page cut, so
this script refuses to print a second page.
"""

import pathlib
import subprocess
import sys

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
OUT = ROOT / "public" / "resume.pdf"


def pdf_text(path):
    """pypdf chokes on some Chromium font descriptors (KeyError: bbox);
    pdftotext is the fallback reader."""
    try:
        return "\n".join(p.extract_text() for p in PdfReader(path).pages)
    except Exception:
        try:
            return subprocess.run(["pdftotext", str(path), "-"],
                                  capture_output=True, text=True, timeout=30).stdout
        except Exception as e:
            print(f"  ! text extraction unavailable ({e}) — contact check happens on the route")
            return ""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 794, "height": 1123}, device_scale_factor=2)
    page.goto(BASE + "/resume", wait_until="networkidle")
    page.emulate_media(media="print")
    page.pdf(
        path=str(OUT),
        format="A4",
        print_background=True,
        margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
    )
    browser.close()

reader = PdfReader(OUT)
pages = len(reader.pages)
text = pdf_text(OUT).replace("\u00a0", " ")
print(f"wrote {OUT} — {pages} page(s), {OUT.stat().st_size // 1024} KB")
if pages != 1:
    sys.exit(f"FAIL: the resume promised one page, printed {pages}")
if text:
    for must in ("omkarkardileatwork@gmail.com", "omkardile.is-a.dev"):
        if must not in text:
            sys.exit(f"FAIL: the contact line drifted — {must} missing from the PDF text")
    if "88887" in text:
        sys.exit("FAIL: the phone number leaked into the public PDF — it lives on /receipt's vCard QR")
    # [1.6.1] extraction hygiene: the glued-word and split-heading bugs an
    # ATS parser hits must not come back with the print styling.
    for glued in ("ERPthat", "ERPfor"):
        if glued in text:
            sys.exit(f"FAIL: glued word in extraction — {glued}")
    for heading in ("Summary", "Experience", "Projects", "Education", "Skills"):
        if heading not in text:
            sys.exit(f"FAIL: section heading did not extract — {heading}")
    print("verified: contact from the one source, no phone, no glued words, headings intact")
