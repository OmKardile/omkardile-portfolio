import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  {
    href: "https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing",
    label: "Resume",
    external: true,
  },
  { href: "/contact", label: "Contact" },
  { href: "/uiux", label: "UI/UX Portfolio", featured: true },
];

export default function SiteShell({ active, pageLabel, children }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <p className="page-label">{pageLabel}</p>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`nav-link${item.featured ? " is-featured" : ""}${active === item.href ? " is-active" : ""}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${item.featured ? " is-featured" : ""}${active === item.href ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
