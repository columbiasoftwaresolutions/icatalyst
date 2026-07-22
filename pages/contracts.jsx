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
        graphic="flow"
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
                    <span className="t-mono-caption" style={{ color: 'var(--ink)' }}>CONTRACT #</span>
                    <Tag>NUMBER TO BE PROVIDED</Tag>
                  </div>
                  <Tag>DESCRIPTION TO BE PROVIDED</Tag>
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
          <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>Who we serve</h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--hairline-on-dark)', overflow: 'hidden', minHeight: 220, display: 'grid', placeItems: 'center', padding: 'var(--space-3xl)' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.55 }}><Motif variant="grid" /></div>
            <div style={{ position: 'relative', textAlign: 'center', display: 'grid', gap: 'var(--space-md)', placeItems: 'center' }}>
              <Tag dark>CUSTOMER LIST / LOGOS — TO BE PROVIDED</Tag>
              <p className="t-body-md" style={{ color: '#b9bcce', maxWidth: 420 }}>Agency and commercial customer names and logos will appear here once supplied.</p>
            </div>
          </div>
        </Reveal>
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
