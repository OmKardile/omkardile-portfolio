'use client';
// Taar — fashion e-commerce discovery prototype, ported 1:1 from
// upload/taar-fashion-app.zip (v0.1.0). Styles live in globals.css under
// the `.taar` scope so nothing leaks into the rest of the site.

import { useEffect, useMemo, useState } from 'react';
import { Plus, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';

/* ---------- data (src/data/products.js in the original) ---------- */

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = {
  Sand: '#D9CBB0', Olive: '#6B6B4A', Charcoal: '#33363B', Navy: '#1F2A44',
  White: '#F2EFE8', Oat: '#CFC3AE', Sky: '#AFC3D6',
};
const CATEGORIES = ['All', 'Shirts', 'Trousers', 'Knitwear', 'Outerwear', 'Essentials'];
const MAX_PRICE = 12000;

const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const PRODUCTS = [
  { id: 1, name: 'Linen Overshirt', category: 'Shirts', price: 3490, colors: ['Sand', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], tone: '#E4DACA' },
  { id: 2, name: 'Wool Blend Trouser', category: 'Trousers', price: 4290, colors: ['Charcoal', 'Navy'], sizes: ['M', 'L'], tone: '#D8D6D2' },
  { id: 3, name: 'Oxford Shirt', category: 'Shirts', price: 2790, colors: ['White', 'Sky'], sizes: ['S', 'M', 'L'], tone: '#E9E6DE' },
  { id: 4, name: 'Merino Crew', category: 'Knitwear', price: 4990, colors: ['Navy', 'Oat'], sizes: ['S', 'L', 'XL'], tone: '#D5D9E0' },
  { id: 5, name: 'Chore Jacket', category: 'Outerwear', price: 6490, colors: ['Olive', 'Charcoal'], sizes: ['M', 'L', 'XL'], tone: '#D9D8CB' },
  { id: 6, name: 'Pleated Chino', category: 'Trousers', price: 3290, colors: ['Sand', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], tone: '#E6DCC9' },
  { id: 7, name: 'Heavyweight Tee', category: 'Essentials', price: 1290, colors: ['White', 'Charcoal'], sizes: ['S', 'M', 'L', 'XL'], tone: '#ECE9E2' },
  { id: 8, name: 'Cable Cardigan', category: 'Knitwear', price: 5490, colors: ['Oat', 'Charcoal'], sizes: ['M', 'L'], tone: '#E3DBCB' },
  { id: 9, name: 'Wool Overcoat', category: 'Outerwear', price: 11990, colors: ['Charcoal', 'Navy'], sizes: ['M', 'L', 'XL'], tone: '#CFD0D3' },
  { id: 10, name: 'Camp Collar Shirt', category: 'Shirts', price: 2990, colors: ['Sand', 'Olive'], sizes: ['S', 'M', 'XL'], tone: '#E1D8C4' },
];

/* ---------- Sheet (src/components/Sheet.jsx) ---------- */

function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`scrim ${open ? 'on' : ''}`} onClick={onClose} aria-hidden="true" />
      <section
        className={`sheet ${open ? 'on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        inert={!open}
      >
        <header className="sh">
          <h2>{title}</h2>
          <button className="icon" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>
        {children}
      </section>
    </>
  );
}

/* ---------- FilterSheet (src/components/FilterSheet.jsx) ---------- */

function FilterSheet({ open, onClose, filters, setFilters, count }) {
  const toggle = (key, v) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));

  return (
    <Sheet open={open} onClose={onClose} title="Filter">
      <div className="grp">
        <h3>Size</h3>
        <div className="opts">
          {SIZES.map((s) => (
            <button key={s} className="opt" aria-pressed={filters.sizes.includes(s)} onClick={() => toggle('sizes', s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="grp">
        <h3>Colour</h3>
        <div className="opts">
          {Object.entries(COLORS).map(([name, hex]) => (
            <button key={name} className="opt" aria-pressed={filters.colors.includes(name)} onClick={() => toggle('colors', name)}>
              <span className="dot" style={{ background: hex }} />{name}
            </button>
          ))}
        </div>
      </div>
      <div className="grp">
        <h3>Price up to {inr(filters.max)}</h3>
        <input
          type="range" min="1000" max={MAX_PRICE} step="500" value={filters.max}
          aria-label="Maximum price" onChange={(e) => setFilters((f) => ({ ...f, max: +e.target.value }))}
        />
      </div>
      <button className="cta" onClick={onClose}>
        {count ? `Show ${count} ${count === 1 ? 'piece' : 'pieces'}` : 'No pieces match'}
      </button>
    </Sheet>
  );
}

/* ---------- QuickAdd (src/components/QuickAdd.jsx) ---------- */

function QuickAddBody({ p, onAdd }) {
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(p.colors[0]);
  return (
    <>
      <p className="meta">{p.category} · {inr(p.price)}</p>
      <div className="grp">
        <h3>Colour — {color}</h3>
        <div className="opts">
          {p.colors.map((c) => (
            <button key={c} className="opt" aria-pressed={color === c} onClick={() => setColor(c)}>
              <span className="dot" style={{ background: COLORS[c] }} />{c}
            </button>
          ))}
        </div>
      </div>
      <div className="grp">
        <h3>Size</h3>
        <div className="opts">
          {SIZES.map((s) => {
            const out = !p.sizes.includes(s);
            return (
              <button key={s} className="opt" disabled={out} aria-pressed={size === s}
                aria-label={out ? `${s}, sold out` : s} onClick={() => setSize(s)}>{s}</button>
            );
          })}
        </div>
      </div>
      <button className="cta" disabled={!size} onClick={() => onAdd({ size, color })}>
        {size ? `Add to bag — ${inr(p.price)}` : 'Select a size'}
      </button>
    </>
  );
}

function QuickAdd({ product, onClose, onAdd }) {
  return (
    <Sheet open={!!product} onClose={onClose} title={product ? product.name : ''}>
      {product && <QuickAddBody key={product.id} p={product} onAdd={onAdd} />}
    </Sheet>
  );
}

/* ---------- ProductCard (src/components/ProductCard.jsx) ---------- */

function ProductCard({ p, i, onQuickAdd }) {
  return (
    <article className="card" style={{ '--i': i }}>
      <div className="ph" style={{ '--tone': p.tone }}>
        {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <i>{p.category}</i>}
        <button className="qa" onClick={() => onQuickAdd(p)} aria-label={`Quick add ${p.name}`}><Plus size={20} /></button>
      </div>
      <h3>{p.name}</h3>
      <p className="row">
        <span>{inr(p.price)}</span>
        <span className="dots">{p.colors.map((c) => <span key={c} className="dot" title={c} style={{ background: COLORS[c] }} />)}</span>
      </p>
    </article>
  );
}

/* ---------- App (src/App.jsx) ---------- */

const BASE = { sizes: [], colors: [], max: MAX_PRICE };

export default function TaarPrototype() {
  const [cat, setCat] = useState('All');
  const [filters, setFilters] = useState(BASE);
  const [sort, setSort] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [quick, setQuick] = useState(null);
  const [bag, setBag] = useState(0);

  const items = useMemo(() => {
    const list = PRODUCTS.filter((p) =>
      (cat === 'All' || p.category === cat) &&
      p.price <= filters.max &&
      (!filters.sizes.length || filters.sizes.some((s) => p.sizes.includes(s))) &&
      (!filters.colors.length || filters.colors.some((c) => p.colors.includes(c))));
    if (sort === 'low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, filters, sort]);

  const chips = [
    ...filters.sizes.map((v) => ({ k: 'sizes', v, label: `Size ${v}` })),
    ...filters.colors.map((v) => ({ k: 'colors', v, label: v })),
    ...(filters.max < MAX_PRICE ? [{ k: 'max', label: `Under ${inr(filters.max)}` }] : []),
  ];
  const removeChip = (c) =>
    setFilters((f) => (c.k === 'max' ? { ...f, max: MAX_PRICE } : { ...f, [c.k]: f[c.k].filter((x) => x !== c.v) }));

  return (
    <div className="taar">
      <div className="taar-app">
        <header className="top">
          <span className="mark">Taar</span>
          <button className="bag" aria-label={`Bag, ${bag} items`}><ShoppingBag size={20} /><b>{bag}</b></button>
        </header>

        <section className="hero">
          <small>Autumn 2026</small>
          <h1>The Autumn <em>Edit</em></h1>
          <p>Ten pieces, cut for Pune’s cooler mornings.</p>
        </section>

        <div className="bar">
          <nav className="tabs" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </nav>
          <div className="tools">
            <button className="filterbtn" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={18} /> Filter{chips.length ? ` (${chips.length})` : ''}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
          {chips.length > 0 && (
            <div className="chips">
              {chips.map((c) => (
                <button key={c.k + (c.v || '')} className="chip" onClick={() => removeChip(c)} aria-label={`Remove ${c.label}`}>
                  {c.label} <X size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        <main className="grid">
          {items.map((p, i) => <ProductCard key={p.id} p={p} i={i} onQuickAdd={setQuick} />)}
          {!items.length && (
            <div className="empty">
              <h2>Nothing fits that combination.</h2>
              <p>Try a wider price range or fewer colours.</p>
              <button className="cta" onClick={() => { setFilters(BASE); setCat('All'); }}>Clear everything</button>
            </div>
          )}
        </main>

        <footer className="foot">
          <a href="https://omkardile.is-a.dev/" target="_blank" rel="noreferrer">Designed &amp; developed by Omkar Kardile</a>
        </footer>

        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} count={items.length} />
        <QuickAdd product={quick} onClose={() => setQuick(null)} onAdd={() => { setBag((b) => b + 1); setQuick(null); }} />
      </div>
    </div>
  );
}
