import Link from "next/link";

const resumeUrl = "https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing";

export default function SiteShell({ active, pageLabel, children }) {
  const isHome = active === "/";
  const sectionHref = (id) => (isHome ? `#${id}` : `/#${id}`);
  const navItems = [
    { href: sectionHref("work"), label: "Work", section: "work" },
    { href: sectionHref("skills"), label: "Skills", section: "skills" },
    { href: sectionHref("experience"), label: "Experience", section: "experience" },
    { href: isHome ? "#contact" : "/contact", label: "Contact", section: "/contact" },
  ];

  return (
    <div className="portfolio-root">
      <header className="portfolio-header">
        <Link href="/" className="portfolio-monogram" aria-label="Omkar Kardile, homepage">
          OK
        </Link>
        <nav className="portfolio-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`portfolio-nav-link${active === item.section || (isHome && item.section === "work") ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="portfolio-header-meta">
          <Link href="/uiux" className="portfolio-header-utility">UI/UX <span aria-hidden="true">↗</span></Link>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="portfolio-header-utility">Resume <span aria-hidden="true">↗</span></a>
          <span className="portfolio-header-divider" aria-hidden="true" />
          <span className="portfolio-header-name">Omkar Kardile</span>
          <span className="portfolio-header-dot" aria-hidden="true" />
        </div>
      </header>

      {!isHome && pageLabel ? <p className="portfolio-page-label">{pageLabel}</p> : null}
      <main className="portfolio-main">{children}</main>

      <footer className="portfolio-footer">
        <Link href="/" className="portfolio-footer-mark">OK</Link>
        <span>Omkar Kardile © {new Date().getFullYear()}</span>
        <div className="portfolio-footer-links">
          <a href="https://github.com/OmKardile" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/omkar-kardile-49501b213/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="mailto:omkarkardileatwork@gmail.com">Email ↗</a>
          <Link href="/uiux">UI/UX work ↗</Link>
        </div>
      </footer>
    </div>
  );
}
