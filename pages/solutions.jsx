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
        graphic="morph"
        graphicHeight={420}
        graphicCols="1.1fr 0.9fr"
      />

      <Band>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)' }}>
          {IC.solutions.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} style={{ display: 'flex' }}>
              <SolutionCard s={s} />
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
