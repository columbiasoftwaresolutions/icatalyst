/* Contracts — contract vehicles, customers, partners. With graphics + motion. */
function App() {
  React.useEffect(() => { refreshIcons(); });
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="contracts" />
      <PageHeader
        eyebrow="CONTRACTS"
        title="Streamlined federal access through trusted contract vehicles"
        lead="iCatalyst provides streamlined access to cutting-edge technologies through trusted federal contract vehicles, alongside an ecosystem of customers and technology partners."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Contracts' }]}
        graphic="contracts-morph"
        graphicScale={1.5}
      />

      {/* Contract vehicles */}
      <Band>
        <Reveal>
          <Eyebrow>CONTRACT VEHICLES</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>Four ways to work with iCatalyst</h2>
        </Reveal>
        <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          {IC.contractVehicles.map((c, i) => (
            <Reveal key={c.code} delay={(i % 2) * 90}>
              <Card className="ic-lift ic-lift-light" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 0, overflow: 'hidden' }}>
                <div className="ic-gradient-bar" style={{ borderRadius: 0 }}></div>
                <div style={{ padding: 'var(--space-2xl)', display: 'grid', gap: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                    <h3 className="t-display-md" style={{ color: 'var(--ink)' }}>{c.code}</h3>
                    <span className="t-mono-label" style={{ color: 'var(--body)' }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="t-mono-caption" style={{ color: 'var(--body)' }}>CONTRACT #</span>
                    <span className="t-mono-label" style={{ color: 'var(--accent-magenta)' }}>{c.number}</span>
                  </div>
                  {c.meta && <span className="t-mono-caption" style={{ color: 'var(--body)' }}>{c.meta}</span>}
                  <p className="t-body-md" style={{ color: 'var(--body)' }}>{c.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Customers */}
      <Band dark>
        <Reveal>
          <Eyebrow dark>CUSTOMERS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)', maxWidth: 620 }}>Who we serve</h2>
          <p className="t-body-lg" style={{ color: '#b9bcce', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>Trusted by federal agencies and mission partners across transportation, aviation, defense, and education.</p>
        </Reveal>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)' }}>
          {IC.customers.map((name, i) => (
            <Reveal key={name} delay={(i % 3) * 80}>
              <div className="ic-lift ic-lift-dark" style={{ height: '100%', border: '1px solid var(--hairline-on-dark)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: 'var(--accent-periwinkle)', flex: 'none' }}></span>
                <span className="t-body-md" style={{ color: 'var(--on-dark)' }}>{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Partnerships — logo carousel */}
      <Band>
        <Reveal>
          <Eyebrow>PARTNERSHIPS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>Technology partners we build with</h2>
        </Reveal>
        <PartnerMarquee label={null} />
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
