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

      {/* Overview — why it matters */}
      <Band>
        <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'var(--space-5xl)', alignItems: 'start' }}>
          <Reveal><Eyebrow>WHY IT MATTERS</Eyebrow></Reveal>
          <Reveal delay={100}>
            <p className="t-display-md" style={{ color: 'var(--ink)', fontWeight: 400 }}>{s.overview}</p>
          </Reveal>
        </div>
      </Band>

      {/* Expertise / capabilities */}
      <Band dark>
        <Reveal>
          <Eyebrow dark>OUR EXPERTISE</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', maxWidth: 620, marginBottom: 'var(--space-3xl)' }}>What this solution delivers</h2>
        </Reveal>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)' }}>
          {s.expertise.map((c, i) => (
            <Reveal key={c.t} delay={(i % 3) * 80}>
              <div className="ic-lift ic-lift-dark" style={{ height: '100%', border: '1px solid var(--hairline-on-dark)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)' }}>
                <span className="t-mono-label" style={{ color: 'var(--accent-periwinkle)' }}>{String(i + 1).padStart(2, '0')}</span>
                <h4 className="t-body-lg-strong" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-sm)' }}>{c.t}</h4>
                <p className="t-body-md" style={{ color: '#b9bcce', marginTop: 'var(--space-sm)' }}>{c.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Value proposition */}
      <Band>
        <Reveal>
          <Eyebrow>THE OUTCOME</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', maxWidth: 820 }}>{s.valueProp}</h2>
          <div style={{ marginTop: 'var(--space-3xl)' }}>
            <Pill variant="primary" href="contact.html">Discuss this solution</Pill>
          </div>
        </Reveal>
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
