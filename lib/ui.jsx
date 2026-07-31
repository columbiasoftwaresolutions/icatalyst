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
        ? <TypeOut as="h2" className="t-display-xl" style={headStyle} text={title} loop={false} onView={false} caretColor={dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)'} />
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

/* Certification seal — circular emblem (double ring) + code/name. Stands in for
   an official cert logo. */
function CertSeal({ code, name, icon = 'shield-check', dark }) {
  const ink = dark ? 'var(--on-dark)' : 'var(--ink)';
  const sub = dark ? '#8388a8' : 'var(--body)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-md)' }}>
      <span style={{
        position: 'relative', width: 56, height: 56, flexShrink: 0, borderRadius: 'var(--radius-full)',
        display: 'grid', placeItems: 'center',
        background: dark ? 'var(--surface-dark-soft)' : 'var(--accent-mint)',
        boxShadow: 'inset 0 0 0 1.5px var(--accent-magenta)',
      }}>
        <span style={{ position: 'absolute', inset: 5, borderRadius: 'var(--radius-full)', border: '1px dashed var(--accent-periwinkle)' }}></span>
        <i data-lucide={icon} style={{ width: 22, height: 22, color: 'var(--accent-magenta)' }}></i>
      </span>
      <span style={{ display: 'grid', gap: 2 }}>
        <span className="t-mono-label" style={{ color: ink }}>{code}</span>
        <span className="t-mono-caption" style={{ color: sub }}>{name}</span>
      </span>
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

/* Expandable dropdown row. Label (mono) + plus; body reveals on click.
   Works on light or dark. Height animates 0↔content, then settles to `auto`
   when open so nested accordions can grow without clipping. `sub` renders a
   tighter, nested variant. */
function Accordion({ label, children, dark, defaultOpen = false, meta, sub = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const wrapRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  React.useEffect(() => {
    const wrap = wrapRef.current, body = bodyRef.current;
    if (!wrap || !body) return;
    if (open) {
      wrap.style.height = body.scrollHeight + 'px';
      const done = (e) => { if (e.propertyName === 'height') { wrap.style.height = 'auto'; wrap.removeEventListener('transitionend', done); } };
      wrap.addEventListener('transitionend', done);
      return () => wrap.removeEventListener('transitionend', done);
    } else {
      wrap.style.height = body.scrollHeight + 'px';
      requestAnimationFrame(() => { wrap.style.height = '0px'; });
    }
  }, [open]);
  const hair = dark ? 'var(--hairline-on-dark)' : 'var(--hairline)';
  const pad = sub ? 'var(--space-lg) 0' : 'var(--space-2xl) 0';
  return (
    <div style={{ borderBottom: `1px solid ${hair}` }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', background: 'transparent', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-lg)',
          padding: pad, textAlign: 'left', color: dark ? 'var(--on-dark)' : 'var(--ink)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.78'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <span className={sub ? 't-mono-caption' : 't-mono-label'} style={{ color: open ? 'var(--accent-magenta)' : (dark ? 'var(--on-dark)' : 'var(--ink)'), transition: 'color .2s ease' }}>{label}</span>
          {meta && <span className="t-mono-caption" style={{ color: dark ? '#8388a8' : 'var(--body)' }}>{meta}</span>}
        </span>
        <i data-lucide="plus" style={{ width: sub ? 15 : 18, height: sub ? 15 : 18, flexShrink: 0, transition: 'transform .25s ease', transform: open ? 'rotate(45deg)' : 'none', color: dark ? '#8388a8' : 'var(--body)' }}></i>
      </button>
      <div ref={wrapRef} style={{ height: defaultOpen ? 'auto' : 0, overflow: 'hidden', transition: 'height .3s cubic-bezier(.2,.6,.2,1)' }}>
        <div ref={bodyRef} style={{ paddingBottom: sub ? 'var(--space-lg)' : 'var(--space-2xl)' }}>
          {typeof children === 'string'
            ? <p className="t-body-md" style={{ color: dark ? '#b9bcce' : 'var(--body)', maxWidth: 720 }}>{children}</p>
            : children}
        </div>
      </div>
    </div>
  );
}

/* Full-bleed image card (Indra style): a photo fills the card; the lower area
   is the same image blurred + darkened behind the text; chamfered corners; an
   arrow appears on hover. Falls back to the animated canvas scene if the photo
   is missing. Used for both solutions (links) and products (opens). */
function ImageCard({ id, no, title, body, scene, href, onClick, tall }) {
  const [broken, setBroken] = React.useState(false);
  const img = (window.IC && IC.cardImages && IC.cardImages[id]) || null;
  const media = (!img || broken)
    ? <div className="ic-imgcard-bg"><Viz scene={scene || 'network'} intensity="subtle" /></div>
    : <img className="ic-imgcard-bg" src={img} alt="" onError={() => setBroken(true)} />;
  const inner = (
    <>
      {media}
      {no && <span className="ic-imgcard-no t-mono-label">{no}</span>}
      <i data-lucide="arrow-up-right" className="ic-imgcard-arrow"></i>
      <div className="ic-imgcard-panel">
        <h3 className="t-display-md ic-imgcard-title">{title}</h3>
        {body && <p className="t-body-md ic-imgcard-body">{body}</p>}
      </div>
    </>
  );
  const cls = `ic-imgcard ic-card-link${tall ? ' tall' : ''}`;
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls} style={{ border: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>{inner}</button>;
}

/* Solution card — image card that links to the detail page. */
function SolutionCard({ s }) {
  return <ImageCard id={s.id} no={s.no} title={s.name} body={s.summary} scene={(window.IC && IC.solutionScene[s.id]) || 'network'} href={`solution.html#${s.id}`} />;
}

/* Technology-partner marquee — grayscale logo carousel, label above. Shared. */
function PartnerLogoItem({ p }) {
  const [ok, setOk] = React.useState(!!(window.IC && IC.partnersHaveLogos));
  return (
    <div className="ic-partner" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 72, padding: '0 var(--space-3xl)' }}>
      {ok
        ? <img src={p.file} alt={p.name} onError={() => setOk(false)} style={{ height: 32 * (p.scale || 1), width: 'auto', maxWidth: 200, objectFit: 'contain', display: 'block' }} />
        : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, letterSpacing: '-0.6px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{p.name}</span>}
    </div>
  );
}
function PartnerMarquee({ label = 'Technology Partners', labelBelow = false }) {
  const items = IC.partnerLogos;
  const heading = label ? (
    <Container style={{ paddingTop: labelBelow ? 'var(--space-2xl)' : 0, paddingBottom: labelBelow ? 0 : 'var(--space-2xl)' }}>
      <p style={{ textAlign: 'center', margin: 0, fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)' }}>{label}</p>
    </Container>
  ) : null;
  const strip = (
    <div className="ic-marquee" style={{ position: 'relative', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div className="ic-marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
        {items.map((p) => <PartnerLogoItem key={p.id} p={p} />)}
        {items.map((p) => <PartnerLogoItem key={p.id + '-2'} p={p} />)}
      </div>
    </div>
  );
  return <>{!labelBelow && heading}{strip}{labelBelow && heading}</>;
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
function PageHeader({ eyebrow, title, lead, breadcrumb, children, graphic, graphicHeight = 300, graphicCols = '1.2fr 0.8fr', graphicScale = 1 }) {
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
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: graphicCols, gap: 'var(--space-5xl)', alignItems: 'center' }}>
            <Reveal style={{ position: 'relative', zIndex: 1 }}>{text}</Reveal>
            <Reveal delay={120} style={{ height: graphicHeight, position: 'relative', zIndex: 0 }}>
              {graphicScale === 1 ? (
                <Viz scene={graphic} intensity="bold" />
              ) : (
                <div className="hero-graphic-bleed" style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: `${graphicScale * 100}%`, height: `${graphicScale * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}>
                  <Viz scene={graphic} intensity="bold" />
                </div>
              )}
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
  StatTiles, Card, SpecBadge, CertSeal, ImageCard, SolutionCard, PartnerMarquee, ValueRotator, Accordion, Modal, refreshIcons, PageHeader,
});
