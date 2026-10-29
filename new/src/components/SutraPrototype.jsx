'use client';
// Sutra — checkout redesign + design system prototype, ported 1:1 from
// upload/sutra-checkout.zip (v0.1.0). Styles live in globals.css under the
// `.sutra` scope so nothing leaks into the rest of the site. The original's
// <html data-accent> theme switch is scoped here to the wrapper element
// (data-su-accent), so it can't touch the host site's tokens.

import { useState } from 'react';
import { Check } from 'lucide-react';

/* ---------- ds/index.jsx ---------- */

const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function Button({ variant = 'primary', ...props }) {
  return <button className={`btn btn-${variant}`} {...props} />;
}

function Field({ label, hint, error, ...input }) {
  const uid = `su-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const msg = error || hint;
  return (
    <div className="field">
      <label htmlFor={uid}>{label}</label>
      <input id={uid} aria-invalid={!!error} aria-describedby={msg ? `${uid}-m` : undefined} {...input} />
      {msg && (
        <p id={`${uid}-m`} className={error ? 'msg err' : 'msg'} role={error ? 'alert' : undefined}>
          {msg}
        </p>
      )}
    </div>
  );
}

function Choice({ name, value, checked, onChange, title, meta, aside, disabled }) {
  return (
    <label className="choice">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <span className="body">
        <b>{title}</b>
        {meta && <small>{meta}</small>}
      </span>
      {aside && <span className="aside">{aside}</span>}
    </label>
  );
}

function Chip({ pressed, ...props }) {
  return <button className="opt" aria-pressed={pressed} {...props} />;
}

function Section({ n, title, open, done, summary, onEdit, children }) {
  return (
    <section className={`sect ${open ? 'open' : ''} ${done ? 'done' : ''}`}>
      <header>
        <span className="num">{done ? <Check size={14} /> : n}</span>
        <h2>{title}</h2>
        {done && (
          <button className="link" onClick={onEdit} aria-label={`Edit ${title}`}>
            Edit
          </button>
        )}
      </header>
      {done && !open && <p>{summary}</p>}
      {open && <div>{children}</div>}
    </section>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className={`row ${strong ? 'strong' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ---------- Checkout.jsx ---------- */

const ITEMS = [
  { name: 'Linen Overshirt', meta: 'Sand · M', price: 3490 },
  { name: 'Pleated Chino', meta: 'Navy · 32', price: 3290 },
];
// Mock PIN lookup. Replace with a real postal API.
const PINS = {
  '411001': ['Pune', 'Maharashtra'],
  '411018': ['Pimpri-Chinchwad', 'Maharashtra'],
  '400001': ['Mumbai', 'Maharashtra'],
  '110001': ['New Delhi', 'Delhi'],
  '560001': ['Bengaluru', 'Karnataka'],
};
const DELIVERY = {
  standard: { label: 'Standard', meta: 'Arrives in 4–6 days', fee: 0 },
  express: { label: 'Express', meta: 'Arrives in 2 days', fee: 149 },
};
const COD_FEE = 40;
const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Enter your full name' : ''),
  phone: (v) => (/^[6-9]\d{9}$/.test(v) ? '' : 'Enter a 10-digit mobile number starting with 6 to 9'),
  email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? '' : 'Check the email format, or leave it blank'),
  pin: (v) => (/^\d{6}$/.test(v) ? '' : 'A PIN code has 6 digits'),
  city: (v) => (v.trim() ? '' : 'Add your city'),
  state: (v) => (v.trim() ? '' : 'Add your state'),
  address: (v) => (v.trim().length < 6 ? 'Add flat or building, and street' : ''),
  upi: (v) => (/^[\w.-]{2,}@[a-z]{2,}$/i.test(v) ? '' : 'A UPI ID looks like name@bank'),
};
const KEYS = ['name', 'phone', 'email', 'pin', 'city', 'state', 'address'];

function Checkout({ onRestart }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: '', phone: '', email: '', pin: '', city: '', state: '', address: '' });
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [delivery, setDelivery] = useState('standard');
  const [pay, setPay] = useState('upi');
  const [upi, setUpi] = useState('');
  const [upiTouched, setUpiTouched] = useState(false);
  const [placed, setPlaced] = useState(null);

  const set = (k, v) =>
    setF((p) => {
      const next = { ...p, [k]: v };
      if (k === 'pin' && PINS[v]) {
        next.city = PINS[v][0];
        next.state = PINS[v][1];
      }
      return next;
    });
  const err = (k) => (touched[k] ? RULES[k](f[k]) : '');
  const field = (k, label, extra = {}) => (
    <Field
      label={label}
      value={f[k]}
      error={err(k)}
      onChange={(e) => set(k, e.target.value)}
      onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
      {...extra}
    />
  );

  const invalid = KEYS.filter((k) => RULES[k](f[k]));
  const toDelivery = () => {
    setTouched(Object.fromEntries(KEYS.map((k) => [k, true])));
    setTried(true);
    if (!invalid.length) setStep(1);
  };

  const sub = ITEMS.reduce((s, i) => s + i.price, 0);
  const ship = DELIVERY[delivery].fee;
  const cod = pay === 'cod' ? COD_FEE : 0;
  const total = sub + ship + cod;

  const place = () => {
    if (pay === 'upi' && RULES.upi(upi)) {
      setUpiTouched(true);
      return;
    }
    setPlaced({ id: `TR-${1000 + Math.floor(Math.random() * 9000)}`, total });
  };

  if (placed) {
    return (
      <section className="done-page">
        <p className="eyebrow">Order placed</p>
        <h1 className="title">
          Thank you, {f.name.split(' ')[0]}.
        </h1>
        <p className="mute">
          Order {placed.id} · {inr(placed.total)} · {DELIVERY[delivery].meta.toLowerCase()}.
        </p>
        <p className="mute">We’ll send updates to {f.email || f.phone}. Demo only, nothing was charged.</p>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </section>
    );
  }

  return (
    <>
      <p className="eyebrow">Checkout · Step {step + 1} of 3</p>
      <details className="summary">
        <summary>
          <span>Order summary</span>
          <b>{inr(total)}</b>
        </summary>
        {ITEMS.map((i) => (
          <Row key={i.name} label={`${i.name} · ${i.meta}`} value={inr(i.price)} />
        ))}
        <Row label="Delivery" value={ship ? inr(ship) : 'Free'} />
        {cod > 0 && <Row label="Cash on delivery fee" value={inr(cod)} />}
        <Row strong label="Total" value={inr(total)} />
      </details>

      <Section
        n={1}
        title="Contact & address"
        open={step === 0}
        done={step > 0}
        summary={`${f.name}, ${f.address}, ${f.city} ${f.pin}`}
        onEdit={() => setStep(0)}
      >
        {field('name', 'Full name', { autoComplete: 'name' })}
        {field('phone', 'Mobile number', {
          inputMode: 'numeric',
          maxLength: 10,
          autoComplete: 'tel-national',
          hint: 'For delivery updates',
        })}
        {field('email', 'Email (optional)', { type: 'email', autoComplete: 'email', hint: 'For your receipt' })}
        {field('pin', 'PIN code', {
          inputMode: 'numeric',
          maxLength: 6,
          autoComplete: 'postal-code',
          hint: 'City and state fill in for you',
        })}
        {field('city', 'City', { autoComplete: 'address-level2' })}
        {field('state', 'State', { autoComplete: 'address-level1' })}
        {field('address', 'Flat, building, street', { autoComplete: 'street-address' })}
        {tried && invalid.length > 0 && (
          <p className="msg err" role="alert" style={{ marginTop: 16 }}>
            Fix {invalid.length} {invalid.length === 1 ? 'field' : 'fields'} above to continue.
          </p>
        )}
        <div className="gap">
          <Button onClick={toDelivery}>Continue to delivery</Button>
        </div>
      </Section>

      <Section
        n={2}
        title="Delivery"
        open={step === 1}
        done={step > 1}
        summary={`${DELIVERY[delivery].label} · ${DELIVERY[delivery].meta}`}
        onEdit={() => setStep(1)}
      >
        {Object.entries(DELIVERY).map(([k, d]) => (
          <Choice
            key={k}
            name="delivery"
            value={k}
            checked={delivery === k}
            onChange={setDelivery}
            title={d.label}
            meta={d.meta}
            aside={d.fee ? inr(d.fee) : 'Free'}
          />
        ))}
        <div className="gap">
          <Button onClick={() => setStep(2)}>Continue to payment</Button>
        </div>
      </Section>

      <Section n={3} title="Payment" open={step === 2} done={false} summary="" onEdit={() => {}}>
        <Choice
          name="pay"
          value="upi"
          checked={pay === 'upi'}
          onChange={setPay}
          title="UPI"
          meta="Google Pay, PhonePe, any UPI app"
          aside="Fastest"
        />
        <Choice
          name="pay"
          value="cod"
          checked={pay === 'cod'}
          onChange={setPay}
          title="Cash on delivery"
          meta="Pay when it arrives"
          aside={`+${inr(COD_FEE)}`}
        />
        <Choice name="pay" value="card" checked={false} onChange={() => {}} title="Card" meta="Coming in v0.2" disabled />
        {pay === 'upi' && (
          <Field
            label="UPI ID"
            value={upi}
            placeholder="name@bank"
            autoCapitalize="none"
            error={upiTouched ? RULES.upi(upi) : ''}
            onChange={(e) => setUpi(e.target.value)}
            onBlur={() => setUpiTouched(true)}
          />
        )}
        <div className="gap">
          <Button onClick={place}>Place order · {inr(total)}</Button>
        </div>
        <p className="msg" style={{ marginTop: 12 }}>
          Demo only. No real payment is taken.
        </p>
      </Section>
    </>
  );
}

/* ---------- System.jsx ---------- */

const COLORS = [
  ['--su-paper', 'Surface'],
  ['--su-ink', 'Text'],
  ['--su-mute', 'Secondary text'],
  ['--su-line', 'Dividers'],
  ['--su-accent', 'Brand action'],
  ['--su-danger', 'Error'],
];
const SPACE = [4, 8, 12, 16, 24, 32];

function Block({ title, children }) {
  return (
    <section className="blk">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function System() {
  return (
    <>
      <p className="eyebrow">Sutra · v0.1</p>
      <h1 className="title">
        One system, <em>two products.</em>
      </h1>
      <p className="mute">
        Neutrals, type and components are shared. Only <code>--accent</code> changes per product. Use the switch above
        to see it.
      </p>

      <Block title="Colour">
        <div className="swatches">
          {COLORS.map(([v, role]) => (
            <div key={v}>
              <i style={{ background: `var(${v})` }} />
              <b>{v}</b>
              <small>{role}</small>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Type">
        <p style={{ font: '300 44px/1 var(--su-serif)', letterSpacing: '-.03em' }}>Display</p>
        <p style={{ font: '400 24px/1.2 var(--su-serif)', margin: '8px 0' }}>Heading</p>
        <p>Body 15 / 1.45, Hanken Grotesk</p>
        <p className="mute" style={{ fontSize: 13 }}>
          Meta 13
        </p>
        <p className="eyebrow">Label 12, caps</p>
      </Block>

      <Block title="Space & shape">
        <div className="space">
          {SPACE.map((s) => (
            <span key={s} style={{ width: s, height: s }} title={`${s}px`} />
          ))}
        </div>
        <p className="mute" style={{ fontSize: 13, marginTop: 8 }}>
          4 · 8 · 12 · 16 · 24 · 32. Radius 6 options, 8 buttons. 44px minimum tap target.
        </p>
      </Block>

      <Block title="Button">
        <Button>Primary</Button>
        <div className="gap">
          <Button variant="secondary">Secondary</Button>
        </div>
        <div className="gap">
          <Button disabled>Disabled</Button>
        </div>
        <pre>{'<Button variant="primary">Place order</Button>'}</pre>
      </Block>

      <Block title="Field">
        <Field label="Default" hint="Helper text sits below" defaultValue="" />
        <Field label="Error" error="Say what to fix, not what went wrong" defaultValue="41" />
        <pre>{'<Field label="PIN code" hint="…" error={err} />'}</pre>
      </Block>

      <Block title="Choice & Chip">
        <Choice name="demo" value="a" checked onChange={() => {}} title="Selected" meta="Supporting line" aside="Free" />
        <Choice name="demo" value="b" checked={false} onChange={() => {}} title="Unselected" meta="Supporting line" aside="₹149" />
        <Choice name="demo" value="c" checked={false} onChange={() => {}} title="Disabled" disabled />
        <div className="chips">
          <Chip pressed>Selected</Chip>
          <Chip pressed={false}>Default</Chip>
        </div>
      </Block>

      <Block title="Row">
        <Row label="Subtotal" value="₹6,780" />
        <Row label="Delivery" value="Free" />
        <Row strong label="Total" value="₹6,780" />
      </Block>
    </>
  );
}

/* ---------- App.jsx (scoped) ---------- */

export default function SutraPrototype() {
  const [view, setView] = useState('checkout');
  const [accent, setAccent] = useState('navy');
  const [runKey, setRunKey] = useState(0);

  return (
    /* data-su-accent replaces the original's document.documentElement.dataset.accent —
       the theme swap stays inside this component's subtree. */
    <div className="sutra" data-su-accent={accent}>
      <div className="app">
        <header className="top">
          <span className="mark">Taar</span>
          <nav className="tabs" aria-label="View">
            <button aria-pressed={view === 'checkout'} onClick={() => setView('checkout')}>
              Checkout
            </button>
            <button aria-pressed={view === 'system'} onClick={() => setView('system')}>
              System
            </button>
          </nav>
        </header>
        <div className="themes" role="group" aria-label="Product theme">
          <Chip pressed={accent === 'navy'} onClick={() => setAccent('navy')}>
            Taar · Navy
          </Chip>
          <Chip pressed={accent === 'terracotta'} onClick={() => setAccent('terracotta')}>
            Ghar · Terracotta
          </Chip>
        </div>
        {/* key: "Start over" remounts the flow instead of reloading the page. */}
        <main className="page" key={`${view}-${runKey}`}>
          {view === 'checkout' ? <Checkout onRestart={() => setRunKey((k) => k + 1)} /> : <System />}
        </main>
        <footer className="foot">
          <a href="https://omkardile.is-a.dev/" target="_blank" rel="noreferrer">
            Designed &amp; developed by Omkar Kardile
          </a>
        </footer>
      </div>
    </div>
  );
}
