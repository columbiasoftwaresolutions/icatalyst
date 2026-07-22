/* ============================================================================
   iCatalyst — shared chrome: NavBar, Footer, WordmarkBanner, ContactOrb.
   ============================================================================ */

/* Sticky nav. Dark over a dark header, flips to white once scrolled past it. */
function NavBar({ current }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const dark = !scrolled;
  const ink = dark ? 'var(--on-dark)' : 'var(--ink)';
  const wrap = {
    position: 'sticky', top: 0, zIndex: 50,
    background: dark ? 'var(--canvas-dark)' : 'var(--canvas)',
    borderBottom: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)',
    transition: 'background .25s ease, border-color .25s ease',
  };
  const inner = {
    maxWidth: 1280, margin: '0 auto', height: 64, padding: '0 var(--space-3xl)',
    display: 'flex', alignItems: 'center', gap: 'var(--space-3xl)', boxSizing: 'border-box',
  };
  return (
    <header style={wrap}>
      <div style={inner}>
        <a href="index.html" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={dark ? 'assets/logo-white.png' : 'assets/logo.png'} alt="iCatalyst, Inc." style={{ height: 38, width: 'auto', display: 'block', transition: 'opacity .25s ease' }} />
        </a>
        <nav className="nav-links" style={{ display: 'flex', gap: 'var(--space-2xl)', marginLeft: 8 }}>
          {IC.nav.map(l => {
            const active = l.key === current;
            return (
              <a key={l.label} href={l.href} className="t-body-md" style={{
                color: ink, textDecoration: 'none', opacity: active ? 1 : 0.78,
                borderBottom: active ? '2px solid var(--accent-magenta)' : '2px solid transparent',
                paddingBottom: 2, transition: 'opacity .15s ease',
              }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = active ? '1' : '0.78'}>{l.label}</a>
            );
          })}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <a href="contact.html" className="nav-secondary t-body-md" style={{ color: ink, textDecoration: 'none', opacity: current === 'contact' ? 1 : 0.85 }}>Contact</a>
          <a href={IC.links.employeeLogin} target="_blank" rel="noopener" className="t-mono-button" style={{
            border: 0, cursor: 'pointer', background: 'var(--primary)', color: 'var(--on-primary)', textDecoration: 'none',
            padding: 'var(--space-sm) var(--space-xl)', borderRadius: 'var(--radius-sm)', height: 40,
            display: 'inline-flex', alignItems: 'center',
          }}>Employee Login</a>
          <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" style={{
            display: 'none', border: 0, background: 'transparent', color: ink, cursor: 'pointer', padding: 6,
          }}><i data-lucide={open ? 'x' : 'menu'}></i></button>
        </div>
      </div>
      {open && (
        <div style={{ background: dark ? 'var(--canvas-dark)' : 'var(--canvas)', borderTop: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)', padding: 'var(--space-lg) var(--space-3xl)', display: 'grid', gap: 'var(--space-lg)' }}>
          {IC.nav.concat([{ label: 'Contact', href: 'contact.html' }]).map(l => (
            <a key={l.label} href={l.href} className="t-body-lg" style={{ color: ink, textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
}

function WordmarkBanner() {
  return (
    <div style={{ overflow: 'hidden', lineHeight: 0, paddingBottom: 8 }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--hairline)',
        fontSize: 'clamp(120px, 21vw, 300px)', lineHeight: .82, letterSpacing: '-0.05em',
        textAlign: 'center', whiteSpace: 'nowrap',
      }}>iCatalyst</div>
    </div>
  );
}

/* 4-column footer + offices + certifications + wordmark banner. */
function Footer() {
  const cols = {
    Company: [['Who We Are', 'index.html#who'], ['Contracts', 'contracts.html'], ['Careers', 'careers.html'], ['Contact', 'contact.html']],
    Solutions: [['Overview', 'solutions.html'], ['AI-Driven Transformation', 'solution.html?id=ai'], ['Cloud Modernization', 'solution.html?id=cloud'], ['Data & Analytics', 'solution.html?id=data']],
    Products: [['Geospatial Engine', 'products.html#geospatial'], ['Semantic Intelligence', 'products.html#semantic'], ['Vendor-Agnostic AI Assistant', 'products.html#assistant']],
  };
  return (
    <footer style={{ background: 'var(--canvas)', borderTop: '1px solid var(--hairline)' }}>
      <Container style={{ padding: 'var(--space-section) var(--space-3xl) var(--space-3xl)' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 'var(--space-3xl)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="assets/logo.png" alt="iCatalyst, Inc." style={{ height: 46, width: 'auto', display: 'block' }} />
            </div>
            <p className="t-caption" style={{ color: 'var(--body)', marginTop: 'var(--space-lg)', maxWidth: 260 }}>
              {IC.company.tagline}. A technology company specializing in AI, NLP, ML, and RPA for federal and commercial clients since 2007.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <Eyebrow>CONNECT WITH US</Eyebrow>
              <a href={IC.links.linkedin} target="_blank" rel="noopener" className="t-mono-button" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>LinkedIn<i data-lucide="arrow-up-right" style={{ width: 14, height: 14 }}></i></a>
            </div>
          </div>
          {Object.entries(cols).map(([h, links]) => (
            <div key={h}>
              <Eyebrow>{h.toUpperCase()}</Eyebrow>
              <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-lg) 0 0', display: 'grid', gap: 'var(--space-md)' }}>
                {links.map(([l, href]) => <li key={l}><a href={href} className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', opacity: .8 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '.8'}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Offices */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3xl)', marginTop: 'var(--space-5xl)', paddingTop: 'var(--space-3xl)', borderTop: '1px solid var(--hairline)' }}>
          {IC.offices.map(o => (
            <div key={o.city}>
              <Eyebrow>{o.tag}</Eyebrow>
              <p className="t-body-md" style={{ color: 'var(--ink)', marginTop: 'var(--space-sm)' }}>{o.addr}</p>
            </div>
          ))}
        </div>

        {/* Certifications — seal marks */}
        <div style={{ marginTop: 'var(--space-5xl)', paddingTop: 'var(--space-3xl)', borderTop: '1px solid var(--hairline)' }}>
          <Eyebrow>CERTIFICATIONS &amp; APPRAISALS</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xl)', marginTop: 'var(--space-lg)' }}>
            {IC.certifications.map((c, i) => <CertSeal key={c.code} code={c.code} name={c.name} icon={['shield-check', 'lock', 'award'][i % 3]} />)}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2xl)', marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-3xl)', borderTop: '1px solid var(--hairline)' }}>
          <span className="t-caption" style={{ color: 'var(--body)' }}>{IC.company.copyright}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            <a href="#" className="t-caption" style={{ color: 'var(--body)', textDecoration: 'none' }}>Privacy Policy</a>
          </span>
        </div>
      </Container>
      <WordmarkBanner />
    </footer>
  );
}

/* Floating contact orb — the one fully-round shape in the system. */
function ContactOrb() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { refreshIcons(); });
  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {open && (
        <div style={{ width: 290, background: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-soft-drop)', padding: 'var(--space-2xl)' }}>
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <p className="t-body-md" style={{ color: 'var(--ink)', marginTop: 'var(--space-sm)' }}>Questions about our solutions, products, or contract vehicles? We’re here to help.</p>
          <a href="contact.html" className="t-mono-button" style={{ marginTop: 'var(--space-lg)', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: 'var(--on-primary)', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>Contact us<i data-lucide="arrow-up-right" style={{ width: 16, height: 16 }}></i></a>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} aria-label="Contact" style={{
        width: 56, height: 56, borderRadius: 'var(--radius-full)', background: 'var(--primary)', color: '#fff',
        border: 0, cursor: 'pointer', boxShadow: 'var(--shadow-soft-drop)', display: 'grid', placeItems: 'center',
      }}><i data-lucide={open ? 'x' : 'message-circle'}></i></button>
    </div>
  );
}

Object.assign(window, { NavBar, Footer, WordmarkBanner, ContactOrb });
