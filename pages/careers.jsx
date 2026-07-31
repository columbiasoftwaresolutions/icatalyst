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
  const benefits = IC.benefits;
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="careers" />
      <PageHeader
        eyebrow="CAREERS"
        title="Build a career where your work accelerates the mission"
        lead="With an over 90% employee retention rate over the past five years, our success is driven by a culture of innovation, continuous learning, and a deep commitment to client outcomes."
        breadcrumb={[{ label: 'Home', href: 'index.html' }, { label: 'Careers' }]}
        graphic="careers-morph"
        graphicScale={1.5}
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
              We strive to offer a productive environment for professional growth, with an employee-focused approach as responsible leaders in business transformation and IT. Our people stay because the work matters and the growth is real.
            </p>
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
          <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline-on-dark)', overflow: 'hidden', minHeight: 220, display: 'grid', placeItems: 'center', padding: 'var(--space-5xl) var(--space-3xl)' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.45 }}><Motif variant="nodes" /></div>
            <div style={{ position: 'relative', textAlign: 'center', display: 'grid', gap: 'var(--space-lg)', placeItems: 'center', maxWidth: 520 }}>
              <p className="t-display-md" style={{ color: 'var(--on-dark)' }}>Interested in joining iCatalyst?</p>
              <p className="t-body-md" style={{ color: '#b9bcce' }}>For details on current openings, benefits, and plans, reach out through our contact form — we’d love to hear from you.</p>
              <Pill variant="mint" href="contact.html">Contact us about roles</Pill>
            </div>
          </div>
        </Reveal>
      </Band>

      {/* Benefits — press +/- to reveal */}
      <Band>
        <Reveal>
          <Eyebrow>BENEFITS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)', maxWidth: 620 }}>What we offer</h2>
          <p className="t-body-lg" style={{ color: 'var(--body)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>
            A benefits package built around health, growth, flexibility, and community.
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
