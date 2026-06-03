/* Solutions overview — intro + 5 solution cards (with motif graphics) + reveals. */
function App() {
  React.useEffect(() => { refreshIcons(); });
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="solutions" />
      <PageHeader
        eyebrow="SOLUTIONS"
        title="Five core solution areas for federal and commercial missions"
        lead="iCatalyst delivers five core solution areas spanning AI, cloud, data, enterprise IT, and program management for federal and commercial missions."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Solutions' }]}
        graphic="network"
      />

      <Band>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)' }}>
          {IC.solutions.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} style={{ display: 'flex' }}>
              <a href={`solution.html?id=${s.id}`} className="sm-host" style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
                <Card className="ic-lift ic-lift-light" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-2xl)', overflow: 'hidden' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 46, lineHeight: 1, letterSpacing: '0.01em', color: 'var(--accent-magenta)', opacity: 0.42 }}>{s.no}</span>
                  <div className="sol-rule" style={{ marginTop: 'var(--space-lg)' }}>
                    <span className="seg-red"></span>
                    <span className="seg-blue"></span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)', marginTop: 'var(--space-2xl)' }}>
                      <h3 className="t-display-md" style={{ color: 'var(--ink)' }}>{s.name}</h3>
                      <i data-lucide="arrow-up-right" style={{ width: 18, height: 18, color: 'var(--body)', flex: 'none', marginTop: 4 }}></i>
                    </div>
                    <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 'var(--space-md)', flex: 1 }}>{s.summary}</p>
                    <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--hairline)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.capabilities.slice(0, 3).map(c => (
                        <span key={c} className="t-mono-caption" style={{ color: 'var(--body)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-xs)', padding: '3px 7px' }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </a>
            </Reveal>
          ))}
          <Reveal delay={IC.solutions.length * 90} style={{ display: 'flex' }}>
            <div style={{ borderRadius: 'var(--radius-sm)', background: 'var(--canvas-dark)', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, width: '100%', position: 'relative', overflow: 'hidden' }}>
              <Eyebrow dark>NEED HELP SCOPING?</Eyebrow>
              <div style={{ position: 'relative' }}>
                <p className="t-body-lg" style={{ color: 'var(--on-dark)', marginBottom: 'var(--space-lg)' }}>Tell us about your mission and we’ll map the right solution areas to it.</p>
                <Pill variant="mint" href="contact.html">Contact us</Pill>
              </div>
            </div>
          </Reveal>
        </div>
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
