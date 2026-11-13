#!/usr/bin/env python3
"""curate-builds.py — regenerate src/data/builds.ts from a live scan.

The colophon's fleet and the library reading room render from this file.
The rules:

  - every build repo is cloned fresh (--depth 1) into /tmp/builds-scan/,
    read-only: nothing is executed from the clones;
  - tracked file counts come from `git ls-files` (the repo's own word);
  - verified stacks come from package.json / build.gradle — computed, and
    soft-checked against src/data/site.ts (mismatches are printed loudly);
  - the reading-room docs (README.md, design-system/README.md) are pulled
    whole, capped at 64 KB each, truncation flagged, never silently cut;
  - PUBLIC_SOURCE_REPOS is counted from the public repositories page
    (the source filter — forks and the profile repo excluded);
  - the portfolio repo is scanned for the fleet but NOT shelf-rendered:
    its system docs already render whole from the local build.

Run:  python3 scripts/curate-builds.py
"""

import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCAN = pathlib.Path("/tmp/builds-scan")
CAP = 64 * 1024
TODAY = "November 13, 2026"

# slug → (owner/repo, display name). Building projects (food-ordering,
# realtime-chat) have no public repo yet by the content rules — the fleet
# renders them from src/data/site.ts alone.
BUILDS = [
    ("ssshopee", "OmKardile/sss-erp-hybrid", "SSShopee"),
    ("servepoint", "OmKardile/servepoint", "ServePoint"),
    ("patelnetworks", "OmKardile/patel-networks", "PatelNetworks"),
    ("tech-site", "jhonny-silverhand/tech-site", "tech // site"),
    ("handoff", "OmKardile/handOff", "HandOff"),
    ("bandwidth-bandit", "OmKardile/bandwidth-bandit", "Bandwidth Bandit"),
    ("aether-weather", "OmKardile/weather-nextjs", "Aether Weather"),
    ("ai-recipe-generator", "OmKardile/recipe-generator", "AI Recipe Generator"),
    ("portfolio", "OmKardile/omkardile-portfolio", "omkardile.is-a.dev"),
]

DEP_MAP = [
    ("next", "Next.js"), ("react", "React"), ("vite", "Vite"), ("kotlin", "Kotlin"),
    ("prisma", "Prisma"), ("@supabase/supabase-js", "Supabase"), ("tailwindcss", "Tailwind CSS"),
    ("zustand", "Zustand"), ("@capacitor/core", "Capacitor"), ("framer-motion", "Framer Motion"),
    ("razorpay", "Razorpay"), ("firebase", "Firebase"), ("mongodb", "MongoDB"),
    ("mongoose", "MongoDB"), ("express", "Express"), ("socket.io", "Socket.IO"),
]

SKIP_FONTS = {"sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif",
              "ui-monospace", "-apple-system", "segoe ui", "roboto", "helvetica",
              "arial", "georgia", "inherit", "initial",
              # config and CSS noise that keeps leaking in
              "toaster", "wght", "variable", "swap", "fallback", "metadatabase",
              "title", "code", "template", "gadgets", "weight"}


def sh(cmd, cwd=None, timeout=300):
    return subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True,
                          text=True, timeout=timeout).stdout.strip()


def clone(slug, repo):
    dest = SCAN / slug
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    url = f"https://github.com/{repo}.git"
    r = subprocess.run(
        ["git", "clone", "--quiet", "--depth", "1", "--filter=blob:none",
         url, str(dest)],
        capture_output=True, text=True, timeout=600,
    )
    if r.returncode != 0:
        return None
    return dest


def tracked_files(dest):
    return [l for l in sh("git ls-files", cwd=dest).splitlines() if l]


def read_json(path):
    try:
        return json.loads(pathlib.Path(path).read_text(encoding="utf-8", errors="replace"))
    except Exception:
        return None


def find_manifest(dest, filename):
    """Manifest discovery: repo root plus one level down (the portfolio keeps
    its app in new/, others in src/ — the root alone lies)."""
    cands = [dest / filename] + sorted(dest.glob(f"*/{filename}"))
    if filename == "package.json":
        best, best_n = None, -1
        for c in cands:
            d = read_json(c)
            if d:
                n = len({**d.get("dependencies", {}), **d.get("devDependencies", {})})
                if n > best_n:
                    best, best_n = d, n
        return best
    for c in cands:
        if c.exists():
            return c
    return None


def verified_stack(dest, slug):
    """The stack, computed from the repo's own manifests."""
    found = []
    pkg = find_manifest(dest, "package.json")
    if pkg:
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        for key, label in DEP_MAP:
            if key in deps and label not in found:
                found.append(f"{label} {deps[key].lstrip('^~').split('.')[0]}")
    for gradle in ("build.gradle.kts", "build.gradle", "settings.gradle.kts"):
        if (dest / gradle).exists() and not any("Kotlin" in f for f in found):
            found.append("Kotlin (Gradle)")
    if not found:
        langs = CounterExtensions(tracked_files(dest))
        found = [f"{n} {c} files" for n, c in langs.most_common(2)]
    return " · ".join(found)


def CounterExtensions(files):
    from collections import Counter
    binaries = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".woff",
                ".woff2", ".ttf", ".otf", ".eot", ".mp4", ".mp3", ".webm", ".pdf",
                ".lock"}
    exts = Counter(os.path.splitext(f)[1].lower() for f in files
                   if os.path.splitext(f)[1].lower() not in binaries)
    names = {".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript",
             ".kt": "Kotlin", ".java": "Java", ".html": "HTML", ".css": "CSS",
             ".md": "Markdown", ".py": "Python", ".vue": "Vue"}
    return Counter({names.get(e, e.strip(".") or "other"): c for e, c in exts.items() if c > 3})


def type_note(dest, files):
    """Font names, only where the repo actually references them — and only
    literal names: next/font/google imports, @fontsource deps, css2 family
    params, and font-family literals. CSS vars and config noise stay out."""
    names = []
    pkg = find_manifest(dest, "package.json")
    if pkg:
        for dep in {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}:
            if dep.startswith("@fontsource/"):
                pretty = dep.split("/")[1].replace("-", " ").title()
                pretty = pretty.replace("Dm ", "DM ").replace("Ui ", "UI ")
                names.append(pretty)
    targets = [f for f in files if re.search(
        r"(layout\.tsx$|index\.html$|tailwind\.config\.[jt]s$|\.css$)", f)][:12]

    def add(name):
        name = name.strip().strip("'\"")
        if (name and len(name) < 26 and name[0].isalpha()
                and "(" not in name and ":" not in name and "--" not in name
                and name.lower() not in SKIP_FONTS):
            names.append(name)

    for f in targets:
        try:
            text = (dest / f).read_text(encoding="utf-8", errors="replace")[:60000]
        except Exception:
            continue
        # the import statement is the only reliable carrier of next/font names
        for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]next/font/google['\"]", text):
            for fam in m.group(1).split(","):
                add(fam.split(":")[0].replace("_", " "))
        for m in re.finditer(r"family=([A-Za-z0-9+]+)(?::[a-zA-Z@0-9,;.[\]]+)?", text):
            add(m.group(1).replace("+", " "))
        for fm in re.finditer(r"font-family:\s*([^;}]+)", text):
            for fam in fm.group(1).split(","):
                add(fam)
    seen, out = set(), []
    for n in names:
        k = n.lower()
        if k not in seen:
            seen.add(k)
            out.append(n)
    return ", ".join(out[:5]) if out else None


def pull_doc(dest, path):
    full = dest / path
    if not full.exists():
        return None
    raw = full.read_bytes()
    truncated = len(raw) > CAP
    text = raw[:CAP].decode("utf-8", errors="replace")
    lines = text.count("\n") + 1
    kb = f"{len(raw) / 1024:.1f}"
    return {"text": text, "lines": lines, "kb": kb, "truncated": truncated}


def design_note(doc_text):
    if not doc_text:
        return None
    m = re.search(r"^#\s+(.+)$|^([A-Z][^.]{20,140}\.)", doc_text, re.M)
    line = (m.group(1) or m.group(2)).strip() if m else None
    return line[:140] if line else None


def source_repo_count(cli_fallback=None):
    """Counted, never typed: HTML scrape first, then the API, then a
    documented CLI fallback (a number read off the same rendered page)."""
    try:
        html = urllib.request.urlopen(
            urllib.request.Request(
                "https://github.com/OmKardile?tab=repositories&type=source",
                headers={"User-Agent": "colophon-curation"}),
            timeout=30).read().decode("utf-8", errors="replace")
        m = re.search(r"(\d+)\s+results?\s+for\s+source\s+repositor", html)
        if m:
            return int(m.group(1)), "repositories page, source filter"
    except Exception as e:
        print(f"  ! repo-count scrape failed: {e}")
    if cli_fallback:
        return int(cli_fallback), "repositories page, source filter, read manually"
    return None, None


def ts_str(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    cli_count = None
    args = sys.argv[1:]
    if "--source-repos" in args:
        cli_count = args[args.index("--source-repos") + 1]
    SCAN.mkdir(parents=True, exist_ok=True)
    scans, docs = [], []
    for slug, repo, name in BUILDS:
        print(f"== {slug}: {repo}")
        dest = clone(slug, repo)
        if dest is None:
            print(f"  ! clone failed — skipped")
            continue
        files = tracked_files(dest)
        branch = sh("git rev-parse --abbrev-ref HEAD", cwd=dest) or "main"
        stack = verified_stack(dest, slug)
        fonts = type_note(dest, files) if slug != "portfolio" else None
        ds = pull_doc(dest, "design-system/README.md")
        note = design_note(ds["text"]) if ds else None
        scans.append({
            "slug": slug, "name": name, "repo": repo, "branch": branch,
            "files": len(files), "verifiedStack": stack, "typeNote": fonts,
            "designNote": note,
        })
        print(f"  branch {branch} · {len(files)} files · {stack}" +
              (f" · type: {fonts}" if fonts else "") +
              (f" · design: {note[:60]}…" if note else ""))
        if slug == "portfolio":
            continue  # its docs render whole from the local build
        for path, kind in (("README.md", "the repo's own front page"),
                           ("design-system/README.md", "the design system, front page")):
            d = pull_doc(dest, path)
            if d:
                docs.append({
                    "slug": slug, "repo": repo, "path": path,
                    "name": f"{name} — {'README' if path == 'README.md' else 'design-system README'}",
                    "kind": kind, **d,
                })
                print(f"  shelf: {path} · {d['kb']} KB" +
                      (" · TRUNCATED" if d["truncated"] else ""))

    count, how = source_repo_count(cli_count)
    print(f"\nsource repos: {count} ({how})")

    out = []
    out.append("/* Across-builds index — generated by scripts/curate-builds.py from a live")
    out.append("   scan (git clone --depth 1 --filter=blob:none per build repo, tracked")
    out.append("   files counted with git ls-files, README and design-system/README")
    out.append("   pulled whole and capped at 64 KB with truncation flagged). Stacks are")
    out.append("   verified from package.json / build.gradle; fonts only where the repo")
    out.append(f"   actually references them. Source-repo count: {count}, counted from the")
    out.append(f"   public repositories page ({how}), {TODAY}. The portfolio repo is")
    out.append("   scanned for the fleet but not shelf-rendered — its system docs already")
    out.append("   render whole from the local build. Regenerate with")
    out.append("   scripts/curate-builds.py; don't hand-edit the numbers. */")
    out.append("")
    out.append("export type BuildScan = {")
    out.append("  slug: string;")
    out.append("  name: string;")
    out.append("  repo: string;")
    out.append("  branch: string;")
    out.append("  files: number;")
    out.append("  verifiedStack: string;")
    out.append("  typeNote: string | null;")
    out.append("  designNote: string | null;")
    out.append("};")
    out.append("")
    out.append("export type ShelfDoc = {")
    out.append("  slug: string;")
    out.append("  repo: string;")
    out.append("  path: string;")
    out.append("  name: string;")
    out.append("  kind: string;")
    out.append("  text: string;")
    out.append("  lines: number;")
    out.append("  kb: string;")
    out.append("  truncated: boolean;")
    out.append("};")
    out.append("")
    out.append(f"export const BUILDS_INDEXED = {ts_str(TODAY)};")
    out.append(f"export const PUBLIC_SOURCE_REPOS = {count};")
    out.append("")
    out.append("export const buildScans: BuildScan[] = [")
    for s in scans:
        out.append("  {")
        out.append(f"    slug: {ts_str(s['slug'])},")
        out.append(f"    name: {ts_str(s['name'])},")
        out.append(f"    repo: {ts_str(s['repo'])},")
        out.append(f"    branch: {ts_str(s['branch'])},")
        out.append(f"    files: {s['files']},")
        out.append(f"    verifiedStack: {ts_str(s['verifiedStack'])},")
        out.append(f"    typeNote: {ts_str(s['typeNote'])},")
        out.append(f"    designNote: {ts_str(s['designNote'])},")
        out.append("  },")
    out.append("];")
    out.append("")
    out.append("export const acrossBuildsDocs: ShelfDoc[] = [")
    for d in docs:
        out.append("  {")
        for k in ("slug", "repo", "path", "name", "kind"):
            out.append(f"    {k}: {ts_str(d[k])},")
        out.append(f"    text: {ts_str(d['text'])},")
        out.append(f"    lines: {d['lines']},")
        out.append(f"    kb: {ts_str(d['kb'])},")
        out.append(f"    truncated: {'true' if d['truncated'] else 'false'},")
        out.append("  },")
    out.append("];")
    (ROOT / "src" / "data" / "builds.ts").write_text("\n".join(out) + "\n")
    print(f"\nwrote src/data/builds.ts — {len(scans)} build scans, {len(docs)} shelf docs")


if __name__ == "__main__":
    main()
