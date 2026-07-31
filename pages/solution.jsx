/* Solution detail — data-driven by the URL hash (e.g. solution.html#cloud). */
function currentSolutionId() {
  return location.hash.replace('#', '') || new URLSearchParams(location.search).get('id');
}

function App() {
  const [id, setId] = React.useState(currentSolutionId());
  React.useEffect(() => {
    const onHash = () => setId(currentSolutionId());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const s = IC.solutions.find(sol => sol.id === id) || IC.solutions[0];
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
        graphicScale={1.8}
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
              <div className="ic-lift ic-lift-dark" style={{ height: '100%', boxSizing: 'border-box', border: '1px solid var(--hairline-on-dark)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)' }}>
                <span className="t-mono-label" style={{ color: 'var(--accent-periwinkle)' }}>{String(i + 1).padStart(2, '0')}</span>
                <h4 className="t-body-lg-strong" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-sm)' }}>{c.t}</h4>
                <p className="t-body-md" style={{ color: '#b9bcce', marginTop: 'var(--space-sm)' }}>{c.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Advantage — why iCatalyst specifically */}
      <Band>
        <Reveal>
          <Eyebrow>OUR ADVANTAGE</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', maxWidth: 620, marginBottom: 'var(--space-3xl)' }}>Why teams choose iCatalyst</h2>
        </Reveal>
        <div className="five-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${s.advantage.length}, 1fr)`, gap: 'var(--space-lg)' }}>
          {s.advantage.map((c, i) => (
            <Reveal key={c.t} delay={(i % 5) * 80}>
              <div className="ic-lift ic-lift-light" style={{ height: '100%', boxSizing: 'border-box', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)' }}>
                <span className="t-mono-label" style={{ color: 'var(--accent-magenta)' }}>{String(i + 1).padStart(2, '0')}</span>
                <h4 className="t-body-lg-strong" style={{ color: 'var(--ink)', marginTop: 'var(--space-sm)' }}>{c.t}</h4>
                <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 'var(--space-sm)' }}>{c.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>

      {/* Value proposition */}
      <Band dark>
        <Reveal>
          <Eyebrow dark>THE OUTCOME</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', maxWidth: 820 }}>{s.valueProp}</h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-3xl)', flexWrap: 'wrap' }}>
            <Pill variant="mint" href="contact.html">Discuss this solution</Pill>
            <Pill variant="ghost" href="solutions.html" icon="arrow-left">All solutions</Pill>
          </div>
        </Reveal>
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
