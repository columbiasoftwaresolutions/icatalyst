/* Centered stat box — big count-up + label, both axes centered. */
function StatBox({ n, label, tint }) {
  return (
    <div style={{ background: tint, borderRadius: 'var(--radius-sm)', padding: 'var(--space-4xl) var(--space-2xl)', minHeight: 168, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <span className="t-display-xl" style={{ color: 'var(--ink)', lineHeight: 1, fontFeatureSettings: '"tnum"' }}><AutoCount text={n} /></span>
      <span className="t-mono-label" style={{ color: 'var(--ink)', opacity: .72, marginTop: 'var(--space-md)', maxWidth: 220 }}>{label}</span>
    </div>
  );
}

/* Careers — culture, open positions, benefits. With graphics + motion. */
function App() {
  React.useEffect(() => { refreshIcons(); });
  const benefits = [
    { label: 'HEALTH & WELLNESS', body: 'Medical, dental, and vision coverage for you and your family, plus wellness support.' },
    { label: 'RETIREMENT & FINANCIAL', body: 'Retirement savings with company contribution and financial-planning resources.' },
    { label: 'TIME OFF & FLEXIBILITY', body: 'Generous paid time off, holidays, and flexible / hybrid work arrangements.' },
    { label: 'LEARNING & DEVELOPMENT', body: 'Certifications, training stipends, and continuous-learning programs to grow your career.' },
  ];
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="careers" />
      <PageHeader
        eyebrow="CAREERS"
        title="Build a career where your work accelerates the mission"
        lead="With an over 90% employee retention rate over the past five years, our success is driven by a culture of innovation, continuous learning, and a deep commitment to client outcomes."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Careers' }]}
        graphic="flow"
      />

      {/* Culture + retention stats */}
      <Band>
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
          <Reveal>
            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              <StatBox n="90%+" label="EMPLOYEE RETENTION · PAST 5 YEARS" tint="var(--accent-mint)" />
              <StatBox n="19+" label="YEARS DELIVERING SINCE 2007" tint="var(--accent-periwinkle)" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>OUR CULTURE</Eyebrow>
            <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', maxWidth: 560 }}>A culture of innovation, learning, and commitment</h2>
            <p className="t-body-lg" style={{ color: 'var(--body)', marginTop: 'var(--space-lg)', maxWidth: 560 }}>
              Our people stay because the work matters and the growth is real. We invest in continuous learning and reward a relentless focus on client outcomes.
            </p>
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Tag>ADDITIONAL CULTURE COPY — OPTIONAL, TO BE PROVIDED</Tag>
            </div>
          </Reveal>
        </div>
      </Band>

      {/* Open positions */}
      <Band dark>
        <Reveal>
          <Eyebrow dark>OPEN POSITIONS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>Current openings</h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--hairline-on-dark)', overflow: 'hidden', minHeight: 200, display: 'grid', placeItems: 'center', padding: 'var(--space-3xl)' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}><Motif variant="nodes" /></div>
            <div style={{ position: 'relative', textAlign: 'center', display: 'grid', gap: 'var(--space-md)', placeItems: 'center' }}>
              <Tag dark>OPEN ROLES — TO BE PROVIDED</Tag>
              <p className="t-body-md" style={{ color: '#b9bcce', maxWidth: 460 }}>Each role will list title, department, location, a short description, and an apply link.</p>
            </div>
          </div>
        </Reveal>
      </Band>

      {/* Benefits — press +/- to reveal */}
      <Band>
        <Reveal>
          <Eyebrow>BENEFITS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)', maxWidth: 620 }}>What we offer</h2>
          <p className="t-body-md" style={{ color: 'var(--body)', marginBottom: 'var(--space-3xl)' }}>
            <Tag>FINAL BENEFITS COPY — TO BE PROVIDED</Tag>
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ borderTop: '1px solid var(--hairline)', maxWidth: 820 }}>
            {benefits.map(b => <Accordion key={b.label} label={b.label}>{b.body}</Accordion>)}
          </div>
        </Reveal>
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
