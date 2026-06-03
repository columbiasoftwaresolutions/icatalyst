/* Careers — culture, open positions, benefits. With graphics + motion. */
function App() {
  React.useEffect(() => { refreshIcons(); });
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

      {/* Culture + retention stat */}
      <Band>
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
          <Reveal>
            <GradientPanel height={260} motif="arcs">
              <div style={{ position: 'absolute', inset: 0, padding: 'var(--space-4xl) var(--space-3xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="t-display-xxl" style={{ color: 'rgba(1,1,32,.9)' }}><AutoCount text="90%+" /></span>
                <span className="t-mono-label" style={{ color: 'rgba(1,1,32,.7)', display: 'block', marginTop: 'var(--space-md)' }}>EMPLOYEE RETENTION · PAST 5 YEARS</span>
              </div>
            </GradientPanel>
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

      {/* Benefits */}
      <Band>
        <Reveal>
          <Eyebrow>BENEFITS</Eyebrow>
          <h2 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-3xl)', maxWidth: 620 }}>What we offer</h2>
        </Reveal>
        <Reveal delay={100}>
          <PlaceholderBlock note="BENEFITS LIST — TO BE PROVIDED">
            Health, retirement, leave, learning stipends, and other benefits will be listed here once supplied.
          </PlaceholderBlock>
        </Reveal>
      </Band>

      <Footer />
      <ContactOrb />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
