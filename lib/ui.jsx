/* ============================================================================
   iCatalyst — shared UI primitives. All built on the Icatalyst design tokens.
   Exposed on window for use across page scripts.
   ============================================================================ */

const UI_MAX = 1280;

/* Centered max-width container. */
function Container({ children, style }) {
  return (
    <div style={{ maxWidth: UI_MAX, margin: '0 auto', padding: '0 var(--space-3xl)', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}

/* Full-bleed band. dark = navy surface, otherwise white. */
function Band({ dark, children, style, label, pad = 'var(--space-section)' }) {
  return (
    <section
      data-screen-label={label}
      style={{ background: dark ? 'var(--canvas-dark)' : 'var(--canvas)', ...style }}
    >
      <Container style={{ paddingTop: pad, paddingBottom: pad }}>{children}</Container>
    </section>
  );
}

/* Uppercase mono eyebrow. */
function Eyebrow({ children, dark, style }) {
  return (
    <span className="t-mono-eyebrow" style={{ color: dark ? '#8388a8' : 'var(--body)', display: 'block', ...style }}>
      {children}
    </span>
  );
}

/* Section header: eyebrow + headline + optional lead. The headline types out
   the first time it scrolls into view (set type={false} to opt out). */
function SectionHead({ eyebrow, title, lead, dark, align = 'left', max = 620, type = true }) {
  const headStyle = { color: dark ? 'var(--on-dark)' : 'var(--ink)', marginTop: 'var(--space-lg)', maxWidth: align === 'center' ? 'none' : max };
  return (
    <div style={{ textAlign: align, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, maxWidth: align === 'center' ? max : 'none' }}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      {type
        ? <TypeOut as="h2" className="t-display-xl" style={headStyle} text={title} loop={false} caretColor={dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)'} />
        : <h2 className="t-display-xl" style={headStyle}>{title}</h2>}
      {lead && <p className="t-body-lg" style={{ color: dark ? '#b9bcce' : 'var(--body)', marginTop: 'var(--space-lg)', maxWidth: align === 'center' ? 'none' : max }}>{lead}</p>}
    </div>
  );
}

/* Pill button / link. variants: primary | mint | ghost | outline | white */
function Pill({ children, variant = 'primary', href, icon, onClick, type, style }) {
  const base = {
    border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: 'var(--space-md) var(--space-2xl)', borderRadius: 'var(--radius-sm)', height: 48,
    textDecoration: 'none', boxSizing: 'border-box', transition: 'opacity .18s ease, background .18s ease',
  };
  const variants = {
    primary: { background: 'var(--primary)', color: 'var(--on-primary)' },
    mint: { background: 'var(--accent-mint)', color: 'var(--ink)' },
    ghost: { background: 'var(--surface-dark-soft)', color: 'var(--on-dark)' },
    white: { background: 'var(--canvas)', color: 'var(--ink)', border: '1px solid var(--hairline)' },
    outline: { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-translucent)', borderRadius: 'var(--radius-xs)' },
  };
  const cls = 't-mono-button';
  const merged = { ...base, ...variants[variant], ...style };
  const inner = (<>{icon && <i data-lucide={icon} style={{ width: 16, height: 16 }}></i>}{children}</>);
  if (href) {
    return <a className={cls} href={href} style={merged} onMouseEnter={e => e.currentTarget.style.opacity = '.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>{inner}</a>;
  }
  return <button className={cls} type={type || 'button'} onClick={onClick} style={merged} onMouseEnter={e => e.currentTarget.style.opacity = '.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>{inner}</button>;
}

/* Arrow text link (mono). */
function ArrowLink({ children, href, dark }) {
  return (
    <a href={href} className="t-mono-button" style={{
      color: dark ? 'var(--on-dark)' : 'var(--ink)', textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }} onMouseEnter={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'translate(2px,-2px)'; }}
       onMouseLeave={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'none'; }}>
      {children}<i data-lucide="arrow-up-right" style={{ width: 16, height: 16, transition: 'transform .18s ease' }}></i>
    </a>
  );
}

/* Subtle, intentional placeholder tag — for [BRACKET] blanks the client fills later. */
function Tag({ children, dark }) {
  return (
    <span className="t-mono-caption" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'middle',
      color: dark ? '#8388a8' : 'var(--body)',
      border: dark ? '1px dashed var(--hairline-on-dark-translucent)' : '1px dashed var(--hairline-translucent)',
      borderRadius: 'var(--radius-xs)', padding: '4px 8px', background: 'transparent',
    }}>
      <i data-lucide="square-pen" style={{ width: 11, height: 11 }}></i>{children}
    </span>
  );
}

/* Larger placeholder region for whole sections still to be supplied. */
function PlaceholderBlock({ children, dark, note }) {
  return (
    <div style={{
      border: dark ? '1px dashed var(--hairline-on-dark)' : '1px dashed var(--hairline)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-3xl)',
      background: dark ? 'transparent' : 'var(--canvas)',
      display: 'grid', gap: 'var(--space-md)', placeItems: 'start',
    }}>
      <Tag dark={dark}>{note || 'CONTENT TO BE PROVIDED'}</Tag>
      {children && <div className="t-body-md" style={{ color: dark ? '#b9bcce' : 'var(--body)' }}>{children}</div>}
    </div>
  );
}

/* Pastel stat tiles (mint / periwinkle, alternating). */
function StatTiles({ items, cols = 3 }) {
  const tints = ['var(--accent-mint)', 'var(--accent-periwinkle)'];
  return (
    <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 'var(--space-lg)' }}>
      {items.map((t, i) => (
        <div key={t.l} style={{ background: tints[i % 2], borderRadius: 'var(--radius-sm)', padding: 'var(--space-3xl)' }}>
          <span className="t-display-xl" style={{ color: 'var(--ink)' }}>{t.n}</span>
          <span className="t-mono-label" style={{ color: 'var(--ink)', opacity: .7, display: 'block', marginTop: 'var(--space-md)' }}>{t.l}</span>
        </div>
      ))}
    </div>
  );
}

/* Light hairline content card. */
function Card({ children, dark, style, as = 'article' }) {
  const Tag2 = as;
  return (
    <Tag2 style={{
      background: dark ? 'var(--canvas-dark)' : 'var(--canvas)',
      border: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)', boxSizing: 'border-box', ...style,
    }}>
      {children}
    </Tag2>
  );
}

/* Mono spec badge (e.g. certifications, contract vehicles). */
function SpecBadge({ code, name, dark }) {
  return (
    <div className={`ic-lift ${dark ? 'ic-lift-dark' : 'ic-lift-light'}`} style={{
      border: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-lg) var(--space-xl)',
      display: 'grid', gap: 6, background: dark ? 'transparent' : 'var(--canvas)',
    }}>
      <span className="t-mono-label" style={{ color: dark ? 'var(--on-dark)' : 'var(--ink)' }}>{code}</span>
      {name && <span className="t-mono-caption" style={{ color: dark ? '#8388a8' : 'var(--body)' }}>{name}</span>}
    </div>
  );
}

/* Rotating value statements — cycles every few seconds with a soft fade. */
function ValueRotator({ items, interval = 4200 }) {
  const [i, setI] = React.useState(0);
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => { setI(p => (p + 1) % items.length); setShow(true); }, 300);
    }, interval);
    return () => clearInterval(t);
  }, [items.length, interval]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minHeight: 20 }}>
      <span style={{ display: 'flex', gap: 5 }}>
        {items.map((_, k) => (
          <span key={k} style={{ width: 5, height: 5, borderRadius: 9999, background: k === i ? 'var(--accent-magenta)' : 'var(--hairline-on-dark)', transition: 'background .3s ease' }}></span>
        ))}
      </span>
      <span className="t-body-md" style={{ color: '#b9bcce', opacity: show ? 1 : 0, transition: 'opacity .3s ease' }}>{items[i]}</span>
    </div>
  );
}

/* Expandable dropdown row. Label (mono) + chevron; body reveals on click.
   Works on light or dark (dark). Calm height/opacity ease, hairline divider. */
function Accordion({ label, children, dark, defaultOpen = false, meta }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const bodyRef = React.useRef(null);
  const [h, setH] = React.useState(defaultOpen ? 'auto' : 0);
  React.useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    setH(open ? el.scrollHeight : 0);
  }, [open, children]);
  const hair = dark ? 'var(--hairline-on-dark)' : 'var(--hairline)';
  return (
    <div style={{ borderBottom: `1px solid ${hair}` }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', background: 'transparent', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-lg)',
          padding: 'var(--space-2xl) 0', textAlign: 'left', color: dark ? 'var(--on-dark)' : 'var(--ink)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.78'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <span className="t-mono-label" style={{ color: open ? 'var(--accent-magenta)' : (dark ? 'var(--on-dark)' : 'var(--ink)'), transition: 'color .2s ease' }}>{label}</span>
          {meta && <span className="t-mono-caption" style={{ color: dark ? '#8388a8' : 'var(--body)' }}>{meta}</span>}
        </span>
        <i data-lucide="plus" style={{ width: 18, height: 18, flexShrink: 0, transition: 'transform .25s ease', transform: open ? 'rotate(45deg)' : 'none', color: dark ? '#8388a8' : 'var(--body)' }}></i>
      </button>
      <div style={{ height: h === 'auto' ? 'auto' : h, overflow: 'hidden', transition: 'height .28s ease', opacity: open ? 1 : 0 }}>
        <div ref={bodyRef} style={{ paddingBottom: 'var(--space-2xl)' }}>
          {typeof children === 'string'
            ? <p className="t-body-md" style={{ color: dark ? '#b9bcce' : 'var(--body)', maxWidth: 720 }}>{children}</p>
            : children}
        </div>
      </div>
    </div>
  );
}

/* Modal / popup — dark card over a dimmed, blurred backdrop. Closes on
   overlay click, the × button, or Escape. Locks body scroll while open. */
function Modal({ open, onClose, eyebrow, title, children, maxWidth = 760 }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="ic-modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(1,1,32,0.66)',
      backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
      display: 'grid', placeItems: 'center', padding: 'var(--space-3xl)',
    }}>
      <div className="ic-modal-card" onClick={e => e.stopPropagation()} style={{
        position: 'relative', background: 'var(--canvas-dark)', border: '1px solid var(--hairline-on-dark)',
        borderRadius: 'var(--radius-sm)', maxWidth, width: '100%', maxHeight: '86vh', overflowY: 'auto',
        padding: 'var(--space-5xl)', boxSizing: 'border-box',
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: 'var(--space-2xl)', right: 'var(--space-2xl)', border: 0, cursor: 'pointer',
          background: 'var(--surface-dark-soft)', color: 'var(--on-dark)', width: 36, height: 36,
          borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center',
        }}><i data-lucide="x" style={{ width: 18, height: 18 }}></i></button>
        {eyebrow && <Eyebrow dark>{eyebrow}</Eyebrow>}
        {title && <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', maxWidth: 560 }}>{title}</h2>}
        <div style={{ marginTop: 'var(--space-2xl)' }}>{children}</div>
      </div>
    </div>
  );
}

/* Re-render lucide icons after React paints. Call in each App effect. */
function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

/* Dark hero band for inner pages — keeps the nav scroll-flip rhythm consistent. */
function PageHeader({ eyebrow, title, lead, breadcrumb, children, graphic }) {
  const text = (
    <div>
      {breadcrumb && (
        <div className="t-mono-label" style={{ color: '#8388a8', marginBottom: 'var(--space-2xl)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ opacity: .5 }}>/</span>}
              {b.href ? <a href={b.href} style={{ color: '#8388a8', textDecoration: 'none' }}>{b.label}</a> : <span style={{ color: 'var(--on-dark)' }}>{b.label}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      {eyebrow && <Eyebrow dark>{eyebrow}</Eyebrow>}
      <TypeOut as="h1" className="t-display-xl" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-lg)', maxWidth: 760 }} text={title} loop={false} onView={false} caretColor="var(--accent-periwinkle)" />
      {lead && <p className="t-body-lg" style={{ color: '#b9bcce', marginTop: 'var(--space-2xl)', maxWidth: 640 }}>{lead}</p>}
      {children}
    </div>
  );
  return (
    <section style={{ background: 'var(--canvas-dark)', color: 'var(--on-dark)', position: 'relative', overflow: 'hidden' }} data-screen-label={title}>
      <Container style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-section)' }}>
        {graphic ? (
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
            <Reveal>{text}</Reveal>
            <Reveal delay={120} style={{ height: 300 }}>
              <Viz scene={graphic} intensity="bold" />
            </Reveal>
          </div>
        ) : (
          <Reveal>{text}</Reveal>
        )}
      </Container>
      <div className="ic-gradient-bar" style={{ borderRadius: 0, position: 'absolute', left: 0, right: 0, bottom: 0 }}></div>
    </section>
  );
}

Object.assign(window, {
  Container, Band, Eyebrow, SectionHead, Pill, ArrowLink, Tag, PlaceholderBlock,
  StatTiles, Card, SpecBadge, ValueRotator, Accordion, Modal, refreshIcons, PageHeader,
});
