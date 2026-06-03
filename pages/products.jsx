/* Products — sticky sub-nav + three full product detail sections (alternating bands). */

/* Grid of titled blocks ({t,b}) — used for features, core tech, benefits. */
function BlockGrid({ items, dark, cols = 2, numbered }) {
  return (
    <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 'var(--space-lg)' }}>
      {items.map((it, i) => (
        <Reveal key={it.t} delay={(i % cols) * 80}>
        <div className={`ic-lift ${dark ? 'ic-lift-dark' : 'ic-lift-light'}`} style={{
          height: '100%', boxSizing: 'border-box',
          border: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)',
          borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)',
        }}>
          {numbered && <span className="t-mono-label" style={{ color: dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)' }}>{String(i + 1).padStart(2, '0')}</span>}
          <h4 className="t-body-lg-strong" style={{ color: dark ? 'var(--on-dark)' : 'var(--ink)', marginTop: numbered ? 'var(--space-sm)' : 0 }}>{it.t}</h4>
          <p className="t-body-md" style={{ color: dark ? '#b9bcce' : 'var(--body)', marginTop: 'var(--space-sm)' }}>{it.b}</p>
        </div>
        </Reveal>
      ))}
    </div>
  );
}

/* Numbered process steps (strings). */
function StepList({ steps, dark }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-lg)', counterReset: 'step' }}>
      {steps.map((s, i) => (
        <Reveal key={i} delay={i * 90} as="li" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
          <span className="t-mono-label" style={{ color: dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)', paddingTop: 3, flex: 'none', width: 28 }}>{String(i + 1).padStart(2, '0')}</span>
          <p className="t-body-lg" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{s}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* Bulleted benefit list (strings). */
function BenefitList({ items, dark }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-md)' }}>
      {items.map((b, i) => (
        <Reveal key={i} delay={(i % 2) * 80} as="li" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', borderBottom: dark ? '1px solid var(--hairline-on-dark)' : '1px solid var(--hairline)', paddingBottom: 'var(--space-md)' }}>
          <i data-lucide="check" style={{ width: 16, height: 16, color: dark ? 'var(--accent-mint)' : 'var(--accent-magenta)', flex: 'none', marginTop: 3 }}></i>
          <span className="t-body-md" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

function SubHead({ children, dark }) {
  return <Reveal><Eyebrow dark={dark} style={{ marginBottom: 'var(--space-lg)' }}>{children}</Eyebrow></Reveal>;
}

function ProductSection({ p, dark, vizStyle }) {
  const ink = dark ? 'var(--on-dark)' : 'var(--ink)';
  const muted = dark ? '#b9bcce' : 'var(--body)';
  return (
    <section id={p.id} style={{ background: dark ? 'var(--canvas-dark)' : 'var(--canvas)', scrollMarginTop: 64, borderTop: dark ? 'none' : '1px solid var(--hairline)' }} data-screen-label={p.name}>
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        {/* Header + visual */}
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
          <Reveal>
            <span className="t-mono-label" style={{ color: dark ? 'var(--accent-periwinkle)' : 'var(--accent-magenta)' }}>PRODUCT {p.no}</span>
            <h2 className="t-display-xl" style={{ color: ink, marginTop: 'var(--space-md)', maxWidth: 560 }}>{p.name}</h2>
            <p className="t-body-lg" style={{ color: muted, marginTop: 'var(--space-lg)', maxWidth: 520 }}>{p.tagline}</p>
          </Reveal>
          <Reveal delay={140}>
            <div className="ic-lift" style={{
              position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
              background: 'var(--canvas-dark)',
              border: '1px solid var(--hairline-on-dark)',
              padding: 'var(--space-2xl)', minHeight: 300, display: 'flex', flexDirection: 'column',
            }}>
              <div className="ic-gradient-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: 0 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="t-mono-label" style={{ color: 'var(--accent-periwinkle)' }}>iCATALYST PRODUCT</span>
                <span className="t-mono-label" style={{ color: '#8388a8' }}>{p.no}</span>
              </div>
              <div style={{ flex: 1, height: 240, marginTop: 'var(--space-md)' }}>
                {vizStyle === 'diagram'
                  ? <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}><ProductViz id={p.id} /></div>
                  : <Viz scene={IC.productScene[p.id]} intensity="bold" />}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Challenge + Solution */}
        <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5xl)', marginTop: 'var(--space-5xl)' }}>
          <Reveal>
            <SubHead dark={dark}>ORGANIZATIONAL CHALLENGE</SubHead>
            <p className="t-body-md" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{p.challenge}</p>
          </Reveal>
          <Reveal delay={120}>
            <SubHead dark={dark}>OUR SOLUTION</SubHead>
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {p.solution.map((para, i) => <p key={i} className="t-body-md" style={{ color: dark ? '#dfe1ee' : 'var(--ink)' }}>{para}</p>)}
            </div>
          </Reveal>
        </div>

        {/* Features / Core technologies */}
        {p.features && (
          <div style={{ marginTop: 'var(--space-5xl)' }}>
            <SubHead dark={dark}>FEATURES</SubHead>
            <BlockGrid items={p.features} dark={dark} cols={2} />
          </div>
        )}
        {p.coreTech && (
          <div style={{ marginTop: 'var(--space-5xl)' }}>
            <SubHead dark={dark}>CORE TECHNOLOGIES</SubHead>
            <BlockGrid items={p.coreTech} dark={dark} cols={2} numbered />
          </div>
        )}

        {/* How it works */}
        {p.howItWorks && (
          <div style={{ marginTop: 'var(--space-5xl)' }}>
            <SubHead dark={dark}>HOW IT WORKS</SubHead>
            <StepList steps={p.howItWorks} dark={dark} />
          </div>
        )}

        {/* Benefits */}
        <div style={{ marginTop: 'var(--space-5xl)' }}>
          <SubHead dark={dark}>BENEFITS</SubHead>
          {p.benefits && <BlockGrid items={p.benefits} dark={dark} cols={3} />}
          {p.benefitsList && <BenefitList items={p.benefitsList} dark={dark} />}
        </div>

        <div style={{ marginTop: 'var(--space-5xl)' }}>
          <Pill variant={dark ? 'mint' : 'primary'} href="contact.html">Request a briefing</Pill>
        </div>
      </Container>
    </section>
  );
}

function SubNav() {
  return (
    <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}>
      <Container style={{ padding: 'var(--space-md) var(--space-3xl)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="t-mono-eyebrow" style={{ color: 'var(--body)', marginRight: 'var(--space-md)' }}>PRODUCTS</span>
        {IC.products.map(p => (
          <a key={p.id} href={`#${p.id}`} className="t-body-md" style={{ color: 'var(--ink)', textDecoration: 'none', padding: 'var(--space-xs) var(--space-md)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--hairline)' }}>{p.name.replace('iCatalyst ', '')}</a>
        ))}
      </Container>
    </div>
  );
}

const PROD_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "productStyle": "particles"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(PROD_TWEAK_DEFAULTS);
  React.useEffect(() => { refreshIcons(); });
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
      <SubNav />
      {IC.products.map((p, i) => (
        <ProductSection key={p.id} p={p} dark={i % 2 === 1} vizStyle={t.productStyle} />
      ))}
      <Footer />
      <ContactOrb />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Product visuals" />
        <TweakRadio label="Style" value={t.productStyle}
          options={['particles', 'diagram']}
          onChange={(v) => setTweak('productStyle', v)} />
      </TweaksPanel>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
