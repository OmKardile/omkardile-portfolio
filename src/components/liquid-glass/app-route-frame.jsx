import Link from "next/link";

export default function AppRouteFrame({ brand, accent, children }) {
  return (
    <div className="liquid-glass-route">
      <header className="liquid-glass-route-bar">
        <Link href="/uiux" className="liquid-glass-back-link" aria-label="Back to the UI/UX portfolio">
          <span aria-hidden="true">←</span>
          <span>Portfolio</span>
        </Link>
        <p className="liquid-glass-route-title">
          <span className="liquid-glass-brand-dot" style={{ backgroundColor: accent }} aria-hidden="true" />
          <span>{brand}</span>
          <span className="liquid-glass-route-subtitle">Liquid Glass redesign</span>
        </p>
      </header>
      <div
        role="region"
        className="liquid-glass-app"
        data-brand={brand.toLowerCase()}
        aria-label={`${brand} interactive redesign`}
        style={{ "--app-accent": accent }}
      >
        {children}
      </div>
    </div>
  );
}
