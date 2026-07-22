/* Products — sticky sub-nav + three full product detail sections (alternating bands). */

/* Optional reveal wrapper — disabled inside modals (where IO is unreliable). */
function Maybe({ reveal, children, as: As = 'div', delay, style }) {
  if (reveal) return <Reveal as={As} delay={delay} style={style}>{children}</Reveal>;
  return <As style={style}>{children}</As>;
}

/* Grid of titled blocks ({t,b}) — used for features, core tech, benefits. */
function BlockGrid({ items, dark, cols = 2, numbered, reveal = true }) {
  return (
    <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 'var(--space-lg)' }}>
      {items.map((it, i) => (
        <Maybe key={it.t} reveal={reveal} delay={(i % cols) * 80}>
        <div className={`ic-lift ${dark ? 'ic-lift-dark' : 'ic-lift-light'}`} style={{
          height: '100%', boxSizing: 'border-box',
          border: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)',
          borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)',
        }}>
          {numbered && <span className="t-mono-label" style={{ color: dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)' }}>{String(i + 1).padStart(2, '0')}</span>}
          <h4 className="t-body-lg-strong" style={{ color: dark ? 'var(--on-dark)' : 'var(--ink)', marginTop: numbered ? 'var(--space-sm)' : 0 }}>{it.t}</h4>
          <p className="t-body-md" style={{ color: dark ? '#b9bcce' : 'var(--body)', marginTop: 'var(--space-sm)' }}>{it.b}</p>
        </div>
        </Maybe>
      ))}
    </div>
  );
}

/* Numbered process steps (strings). */
function StepList({ steps, dark, reveal = true }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-lg)', counterReset: 'step' }}>
      {steps.map((s, i) => (
        <Maybe key={i} reveal={reveal} delay={i * 90} as="li" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
          <span className="t-mono-label" style={{ color: dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)', paddingTop: 3, flex: 'none', width: 28 }}>{String(i + 1).padStart(2, '0')}</span>
          <p className="t-body-lg" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{s}</p>
        </Maybe>
      ))}
    </ol>
  );
}

/* Bulleted benefit list (strings). */
function BenefitList({ items, dark, reveal = true }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-md)' }}>
      {items.map((b, i) => (
        <Maybe key={i} reveal={reveal} delay={(i % 2) * 80} as="li" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', borderBottom: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)', paddingBottom: 'var(--space-md)' }}>
          <i data-lucide="check" style={{ width: 16, height: 16, color: dark ? 'var(--accent-mint)' : 'var(--accent-magenta)', flex: 'none', marginTop: 3 }}></i>
          <span className="t-body-md" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{b}</span>
        </Maybe>
      ))}
    </ul>
  );
}

function SubHead({ children, dark }) {
  return <Reveal><Eyebrow dark={dark} style={{ marginBottom: 'var(--space-lg)' }}>{children}</Eyebrow></Reveal>;
}

/* Full product detail — rendered inside the modal (dark, no scroll-reveal). */
function ProductDetail({ p }) {
  return (
    <div>
      <p className="t-body-lg" style={{ color: '#c9cde0', marginTop: 0, maxWidth: 640 }}>{p.tagline}</p>
      <div style={{ height: 220, margin: 'var(--space-2xl) 0', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--hairline-on-dark)', background: 'var(--canvas-dark)' }}>
        <Viz scene={IC.productScene[p.id]} intensity="bold" />
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-5xl)' }}>
        <div>
          <Eyebrow dark style={{ marginBottom: 'var(--space-md)' }}>ORGANIZATIONAL CHALLENGE</Eyebrow>
          <p className="t-body-md" style={{ color: '#dfe1ee' }}>{p.challenge}</p>
        </div>
        <div>
          <Eyebrow dark style={{ marginBottom: 'var(--space-md)' }}>OUR SOLUTION</Eyebrow>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {p.solution.map((para, i) => <p key={i} className="t-body-md" style={{ color: '#dfe1ee' }}>{para}</p>)}
          </div>
        </div>
        {p.features && <div><Eyebrow dark style={{ marginBottom: 'var(--space-lg)' }}>FEATURES</Eyebrow><BlockGrid items={p.features} dark cols={2} reveal={false} /></div>}
        {p.coreTech && <div><Eyebrow dark style={{ marginBottom: 'var(--space-lg)' }}>CORE TECHNOLOGIES</Eyebrow><BlockGrid items={p.coreTech} dark cols={2} numbered reveal={false} /></div>}
        {p.howItWorks && <div><Eyebrow dark style={{ marginBottom: 'var(--space-lg)' }}>HOW IT WORKS</Eyebrow><StepList steps={p.howItWorks} dark reveal={false} /></div>}
        <div>
          <Eyebrow dark style={{ marginBottom: 'var(--space-lg)' }}>BENEFITS</Eyebrow>
          {p.benefits && <BlockGrid items={p.benefits} dark cols={2} reveal={false} />}
          {p.benefitsList && <BenefitList items={p.benefitsList} dark reveal={false} />}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-5xl)' }}>
        <Pill variant="mint" href="contact.html">Request a briefing</Pill>
      </div>
    </div>
  );
}

function App() {
  const [openId, setOpenId] = React.useState(null);
  React.useEffect(() => { refreshIcons(); });
  React.useEffect(() => {
    const h = (location.hash || '').replace('#', '');
    if (h && IC.products.find(p => p.id === h)) setOpenId(h);
  }, []);
  const open = IC.products.find(p => p.id === openId);
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="products" />
      <PageHeader
        eyebrow="PRODUCTS"
        title="Purpose-built AI products for complex environments"
        lead="Custom, secure, cloud-based platforms that turn complex and unstructured data into mission outcomes — from geospatial analytics to semantic intelligence and domain-specific AI assistants."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Products' }]}
        graphic="network"
      />

      <Band>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)' }}>
          {IC.products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} style={{ display: 'flex' }}>
              <ImageCard id={p.id} no={p.no} title={p.name.replace('iCatalyst ', '')} body={p.tagline} scene={IC.productScene[p.id]} onClick={() => setOpenId(p.id)} tall />
            </Reveal>
          ))}
        </div>
        <p className="t-caption" style={{ color: 'var(--body)', marginTop: 'var(--space-2xl)', textAlign: 'center' }}>Select a product to view the full capability detail.</p>
      </Band>

      <Modal open={!!open} onClose={() => setOpenId(null)} eyebrow={open ? `PRODUCT ${open.no}` : ''} title={open ? open.name : ''} maxWidth={960}>
        {open && <ProductDetail p={open} />}
      </Modal>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
