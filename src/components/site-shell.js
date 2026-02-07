import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function SiteShell({ active, pageLabel, children }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <p className="page-label">{pageLabel}</p>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${active === item.href ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
