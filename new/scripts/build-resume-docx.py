#!/usr/bin/env python3
"""build-resume-docx.py — the .docx copy of the resume, from the same fields.

Some portals want Word, not PDF — this prints the same one source
(src/data/site.ts + src/data/resume.ts) into an ATS-safe .docx: single
column, real text, plain headings, no tables. Run:

    python3 scripts/build-resume-docx.py

Writes download/resume.docx (the deliverable copy). The PDF printer's
assertions (one page, no phone, no glued words) don't apply here, but the
contact line and the no-phone rule are checked the same way.
"""

import pathlib
import re
import sys

from docx import Document
from docx.shared import Pt, RGBColor

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "download" / "resume.docx"
OUT.parent.mkdir(parents=True, exist_ok=True)

site_ts = (ROOT / "src" / "data" / "site.ts").read_text()
resume_ts = (ROOT / "src" / "data" / "resume.ts").read_text()


def field(key, src=site_ts):
    m = re.search(rf"{key}: '([^']*)'", src)
    if not m:
        sys.exit(f"missing {key}")
    return m.group(1)


def joined_string(name, src=resume_ts):
    m = re.search(rf"export const {name} =\n((?:  .*\n)+)", src)
    if not m:
        sys.exit(f"missing {name}")
    return " ".join(
        part.strip().strip("'").strip("+").strip().strip("'").strip()
        for part in m.group(1).splitlines()
    ).replace("' +", "").replace("+ '", "").replace("''", "'")


name = field("name")
role = field("role")
email = field("email")
url = field("url").replace("https://", "")
location = field("location")

# roles from site.ts's experience array, in order
roles = re.findall(
    r"title: '([^']*)',\s*\n\s*org: '([^']*)',\s*\n\s*period: ['\"]([^'\"]*)['\"],\s*\n\s*kind: '(Role|Education)'",
    site_ts,
)
role_entries = [(t, o, p) for t, o, p, k in roles if k == "Role"]
edu_entries = [(t, o, p) for t, o, p, k in roles if k == "Education"]

# resume-only education rows
resume_edu = re.findall(
    r"what: '([^']*)',\s*\n\s*when: '([^']*)',\s*\n\s*score: '([^']*)'",
    resume_ts,
)

# usage lines and the keyword skills line
proof_usage = re.findall(r"(\w+):\s*\n\s*'([^']*)',", resume_ts.split("roleBullets")[0])
usage = {k: v for k, v in proof_usage}
resume_skills = joined_string("resumeSkills")
resume_summary = joined_string("resumeSummary")

# role bullets (org → list of strings)
bullets_block = resume_ts.split("roleBullets")[1]
bullets = {}
for org, body in re.findall(r"'([^']+)': \[\n((?:    .*\n)*?)  \]", bullets_block):
    bullets[org] = re.findall(r"'([^']+)'", body)

# project picks mirror the route: first three live projects by site.ts order
projects_src = site_ts.split("export const projects")[1].split("export const", 2)[0]
project_blocks = re.findall(r"\{\s*slug: '([^']+)'(.{0,2200}?)\},\n", projects_src, re.S)
live = []
for slug, body in project_blocks:
    if "status: 'live'" in body:
        title_m = re.search(r"title: '([^']+)'", body)
        stack_m = re.search(r"stack: '([^']+)'", body)
        kind_m = re.search(r"kind: '([^']+)'", body)
        year_m = re.search(r"year: ['\"]?(\d{4})", body)
        if not (title_m and stack_m and kind_m and year_m):
            continue
        live.append((slug, title_m.group(1).split(" — ")[0], kind_m.group(1),
                     year_m.group(1), stack_m.group(1)))
live = live[:3]

doc = Document()
style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(10.5)

def para(text, bold=False, size=10.5, color=None, space_after=2):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text)
    r.bold = bold
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = RGBColor(*color)
    return p

def head(text):
    para(text, bold=True, size=12, space_after=4)

para(name, bold=True, size=20, space_after=0)
para(role, size=11.5, color=(0x52, 0x52, 0x52), space_after=0)
para(f"{email} · {location} · {url} · github.com/OmKardile · linkedin.com/in/omkar-kardile-49501b213", size=9, space_after=8)

head("Summary")
para(resume_summary)

head("Experience")
for t, o, p in role_entries:
    para(f"{t} · {o} — {p}", bold=False, size=10.5)
    for b in bullets.get(o, []):
        para(f"• {b}", size=10, color=(0x3F, 0x3F, 0x46))

head("Projects")
for slug, title, kind, year, stack in live:
    para(f"{title} — {kind}, {year}", size=10.5)
    if slug in usage:
        para(usage[slug], size=10)
    para(stack, size=9.5, color=(0x3F, 0x3F, 0x46))

head("Education")
for t, o, p in edu_entries:
    para(f"{t} — {o} — {p}")
for what, when, score in resume_edu:
    para(f"{what} — {when} · {score}")

head("Skills")
para(" · ".join(re.findall(r"'([^']+)'", site_ts.split("export const capabilities")[1].split("export const experience")[0].split("learning:")[0])), size=10)
para(f"Also: {resume_skills}", size=10, color=(0x3F, 0x3F, 0x46))

text = "\n".join(p.text for p in doc.paragraphs)
if "88887" in text:
    sys.exit("FAIL: phone leaked into the docx — it lives on /receipt's vCard QR")
for must in (email, "omkardile.is-a.dev", "Summary", "Experience", "Projects", "Education", "Skills", "MongoDB"):
    if must not in text:
        sys.exit(f"FAIL: {must} missing from the docx")

doc.save(OUT)
print(f"wrote {OUT} — {len(doc.paragraphs)} paragraphs, contact verified, no phone, MongoDB present")
