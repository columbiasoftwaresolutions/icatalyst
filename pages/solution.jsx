/* Solution detail — data-driven by ?id=. Shows summary, capabilities, use cases. */
function getSolution() {
  const id = new URLSearchParams(location.search).get('id');
  return IC.solutions.find(s => s.id === id) || IC.solutions[0];
}

function App() {
  const s = getSolution();
  React.useEffect(() => { refreshIcons(); document.title = `${s.name} — iCatalyst, Inc.`; });
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="solutions" />
      <PageHeader
        eyebrow={`SOLUTION ${s.no}`}
        title={s.name}
        lead={s.summary}
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Solutions', href: 'solutions.html' }, { label: s.name }]}
        graphic={IC.solutionScene[s.id]}
      >
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-3xl)', flexWrap: 'wrap' }}>
          <Pill variant="mint" href="contact.html">Discuss this solution</Pill>
          <Pill variant="ghost" href="solutions.html" icon="arrow-left">All solutions</Pill>
        </div>
      </PageHeader>

      {/* Capabilities */}
      <Band>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <Eyebrow>CAPABILITIES</Eyebrow>
          <Tag>DRAFT — CONFIRM CAPABILITY COPY</Tag>
        </div>
        <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', maxWidth: 620 }}>What this solution delivers</h2>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {s.capabilities.map((c, i) => (
            <Reveal key={c} delay={i * 80}>
            <Card className="ic-lift ic-lift-light" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', height: '100%' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-magenta)', marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="t-body-lg-strong" style={{ color: 'var(--ink)' }}>{c}</h4>
                <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 6 }}>
                  <Tag>DESCRIPTION TO BE PROVIDED</Tag>
                </p>
              </div>
            </Card>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Use cases */}
      <Band dark>
        <Eyebrow dark>USE CASES</Eyebrow>
        <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', maxWidth: 620, marginBottom: 'var(--space-3xl)' }}>Where it makes an impact</h2>
        <PlaceholderBlock dark note="USE CASES — TO BE PROVIDED">
          Representative engagements, agency / industry contexts, and measurable outcomes for this solution area will appear here once supplied.
        </PlaceholderBlock>
      </Band>

      {/* Back to all solutions */}
      <Band>
        <a href="solutions.html" className="t-mono-button" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}
          onMouseEnter={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'translateX(-3px)'; }}
          onMouseLeave={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'none'; }}>
          <i data-lucide="arrow-left" style={{ width: 18, height: 18, transition: 'transform .18s ease' }}></i>Back to all solutions
        </a>
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
