/* Homepage — composes the full iCatalyst brand surface. */

/* Hero — dark band. Text left, live globe right. The tagline (the old rotating
   value statements) is now the headline and types itself out, cycling. */
function HomeHero({ t }) {
  const visual = t.heroVisual || 'globe';
  return (
    <section style={{ background: 'var(--canvas-dark)', color: 'var(--on-dark)', position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 160px)' }} data-screen-label="Hero">
      <Container style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 'var(--space-4xl)', alignItems: 'center', minHeight: 'calc(100vh - 160px - 2 * var(--space-5xl))' }}>
          {/* LEFT — text */}
          <div>
            <Eyebrow dark>ACCELERATING YOUR SUCCESS</Eyebrow>
            <div style={{ marginTop: 'var(--space-2xl)', minHeight: 'clamp(118px, 15vw, 180px)', display: 'flex', alignItems: 'flex-start' }}>
              <TypeOut as="h1"
                style={{ color: 'var(--on-dark)', margin: 0, fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(29px, 3.5vw, 50px)', lineHeight: 1.08, letterSpacing: '-0.02em', maxWidth: 620 }}
                strings={IC.valueStatements}
                caretColor="var(--accent-periwinkle)" onView={false} typeSpeed={32} deleteSpeed={15} hold={2600} />
            </div>
            <p className="t-body-lg" style={{ color: '#b9bcce', marginTop: 'var(--space-2xl)', maxWidth: 440 }}>
              AI, automation, and analytics for federal and commercial missions.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-3xl)', flexWrap: 'wrap' }}>
              <Pill variant="mint" href="solutions.html">Explore solutions</Pill>
              <Pill variant="ghost" href="contact.html" icon="phone">Contact us</Pill>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2xl)', marginTop: 'var(--space-4xl)', flexWrap: 'wrap' }}>
              {IC.company.principles.map((p) => <span key={p} className="t-mono-label" style={{ color: '#8388a8' }}>{p}</span>)}
            </div>
          </div>
          {/* RIGHT — globe */}
          <div className="hero-globe" style={{ position: 'relative', height: 'min(62vh, 580px)', marginRight: 'calc(-1 * var(--space-3xl))' }}>
            <Viz scene={visual} intensity="bold" />
          </div>
        </div>
      </Container>
    </section>);

}

/* Single partner logo — real image when logos are ready, clean wordmark otherwise. */
function PartnerLogo({ p }) {
  const [ok, setOk] = React.useState(!!IC.partnersHaveLogos);
  return (
    <div className="ic-partner" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 72, padding: '0 var(--space-3xl)' }}>
      {ok ?
      <img src={p.file} alt={p.name} onError={() => setOk(false)} style={{ height: 32 * (p.scale || 1), width: 'auto', maxWidth: 200, objectFit: 'contain', display: 'block' }} /> :

      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, letterSpacing: '-0.6px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{p.name}</span>
      }
    </div>);

}

/* Technology partners — bold label above, seamless horizontal marquee below. */
function PartnerBar() {
  const items = IC.partnerLogos;
  return (
    <section style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}>
      <Container style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-lg)' }}>
        <p style={{ textAlign: 'center', margin: 0, fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)' }}>Technology Partners</p>
      </Container>
      <div style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="ic-marquee" style={{ position: 'relative', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
          <div className="ic-marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
            {items.map((p) => <PartnerLogo key={p.id} p={p} />)}
            {items.map((p) => <PartnerLogo key={p.id + '-2'} p={p} />)}
          </div>
        </div>
      </div>
    </section>);

}

/* Our Philosophy — opens as a popup from a text trigger (no longer a section). */
function PhilosophyButton() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { refreshIcons(); }, [open]);
  return (
    <>
      <button onClick={() => setOpen(true)} className="t-mono-button" style={{
        border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--ink)',
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: 0,
      }}
      onMouseEnter={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'translate(2px,-2px)'; }}
      onMouseLeave={e => { const a = e.currentTarget.querySelector('i'); if (a) a.style.transform = 'none'; }}>
        Our philosophy<i data-lucide="arrow-up-right" style={{ width: 16, height: 16, transition: 'transform .18s ease' }}></i>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} eyebrow="OUR PHILOSOPHY"
        title="We don’t just deliver technology — we accelerate outcomes">
        {IC.philosophy.intro.map((p, i) =>
          <p key={i} className="t-body-md" style={{ color: '#b9bcce', marginTop: i ? 'var(--space-lg)' : 0 }}>{p}</p>
        )}
        <div style={{ display: 'grid', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {IC.philosophy.values.map((v) =>
            <div key={v.e} style={{ borderTop: '1px solid var(--hairline-on-dark)', paddingTop: 'var(--space-lg)' }}>
              <span className="t-mono-label" style={{ color: 'var(--accent-periwinkle)' }}>{v.e}</span>
              <p className="t-body-md" style={{ color: '#b9bcce', marginTop: 'var(--space-xs)' }}>{v.b}</p>
            </div>
          )}
        </div>
        <p className="t-body-md" style={{ color: '#8388a8', marginTop: 'var(--space-3xl)' }}>{IC.philosophy.closing}</p>
      </Modal>
    </>);

}

/* Who We Are — intro + detail dropdowns on the left; metric tiles reveal in from
   the right, then stay anchored (sticky) as you scroll the section. */
function WhoWeAre() {
  const rows = [
  { label: 'WHAT WE DO', body: IC.whoWeAre[0] },
  { label: 'CERTIFICATIONS & FRAMEWORK', body: IC.whoWeAre[1] },
  { label: 'CONTRACT VEHICLES & PARTNERS', body: IC.whoWeAre[2] },
  { label: 'OUR PEOPLE', body: IC.whoWeAre[3] }];

  return (
    <section id="who" style={{ background: 'var(--canvas)', scrollMarginTop: 80 }} data-screen-label="Who We Are">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <Eyebrow>WHO WE ARE</Eyebrow>
        <TypeOut as="h2" className="t-display-xl" style={{ color: 'var(--ink)', marginTop: 'var(--space-lg)', maxWidth: 760 }}
          text="A trusted technology partner for mission-critical work" loop={false} caretColor="var(--accent-magenta)" />
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 'var(--space-5xl)', marginTop: 'var(--space-3xl)', alignItems: 'start' }}>
          <div>
            <div style={{ borderTop: '1px solid var(--hairline)' }}>
              {rows.map((r) =>
              <Accordion key={r.label} label={r.label}>{r.body}</Accordion>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2xl)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)', alignItems: 'center' }}>
              <ArrowLink href="solutions.html">Our solutions</ArrowLink>
              <ArrowLink href="contracts.html">Contracts &amp; certifications</ArrowLink>
              <PhilosophyButton />
            </div>
          </div>
          <div style={{ position: 'sticky', top: 88, alignSelf: 'start', display: 'grid', gap: 'var(--space-lg)' }}>
            {IC.metrics.map((m, i) =>
            <Reveal key={m.l} delay={i * 120} className="from-right">
                <div className="ic-lift" style={{ background: i % 2 ? 'var(--accent-periwinkle)' : 'var(--accent-mint)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)' }}>
                  <span className="t-display-xl" style={{ color: 'var(--ink)' }}><AutoCount text={m.n} /></span>
                  <span className="t-mono-label" style={{ color: 'var(--ink)', opacity: .7, display: 'block', marginTop: 'var(--space-sm)' }}>{m.l}</span>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>);

}

/* One clean solution card — shared shape (mono index, accent rule, title, arrow). */
function SolutionCard({ s }) {
  return (
    <a href={`solution.html?id=${s.id}`} className="sm-host" style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
      <Card className="ic-lift ic-lift-light" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-3xl) var(--space-2xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="t-mono-label" style={{ color: 'var(--accent-magenta)' }}>{s.no}</span>
          <i data-lucide="arrow-up-right" className="sol-arrow" style={{ width: 18, height: 18, color: 'var(--body)', transition: 'transform .2s ease, color .2s ease' }}></i>
        </div>
        <div className="sol-rule" style={{ marginTop: 'var(--space-lg)' }}>
          <span className="seg-red"></span>
          <span className="seg-blue"></span>
        </div>
        <h3 className="t-display-md" style={{ color: 'var(--ink)', marginTop: 'var(--space-2xl)' }}>{s.name}</h3>
        <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 'var(--space-md)', flex: 1 }}>{s.summary}</p>
      </Card>
    </a>);

}

/* Solutions — 5 clean cards + a dark "view all" tile. */
function HomeSolutions() {
  return (
    <section style={{ background: 'var(--canvas)' }} data-screen-label="Solutions">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <SectionHead eyebrow="SOLUTIONS" title="Five core solution areas" />
          <Pill variant="outline" href="solutions.html">View all</Pill>
        </div>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {IC.solutions.map((s, i) =>
          <Reveal key={s.id} delay={i * 80} style={{ display: 'flex' }}>
              <SolutionCard s={s} />
            </Reveal>
          )}
          <Reveal delay={IC.solutions.length * 80} style={{ display: 'flex' }}>
            <a href="solutions.html" className="sm-host" style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
              <div className="ic-lift" style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-sm)', background: 'var(--canvas-dark)', padding: 'var(--space-3xl) var(--space-2xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, position: 'relative', overflow: 'hidden' }}>
                <Eyebrow dark>ALL SOLUTIONS</Eyebrow>
                <span className="t-display-md" style={{ color: 'var(--on-dark)', display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative' }}>Explore the full portfolio<i data-lucide="arrow-right" style={{ width: 22, height: 22 }}></i></span>
              </div>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>);

}

/* Products — dark band, 3 cards. Header animation is tweakable (see Tweaks panel). */
function HomeProducts({ t = {} }) {
  const anim = t.productAnim || 'particles';
  const scene = t.productScene || 'auto';
  const intensity = t.productIntensity || 'bold';
  return (
    <section style={{ background: 'var(--canvas-dark)' }} data-screen-label="Products">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <SectionHead dark eyebrow="PRODUCTS" title="Purpose-built AI products" />
          <Pill variant="ghost" href="products.html">View all</Pill>
        </div>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {IC.products.map((p, i) =>
          <Reveal key={p.id} delay={i * 90} style={{ display: 'flex' }}>
              <a href={`products.html#${p.id}`} style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
                <Card dark className="ic-lift ic-lift-dark" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 110, position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--hairline-on-dark)', background: 'var(--canvas-dark)' }}>
                    {anim === 'particles' &&
                      <div style={{ position: 'absolute', inset: 0 }} key={`${scene}-${intensity}`}><Viz scene={scene === 'auto' ? IC.productScene[p.id] : scene} intensity={intensity} /></div>}
                    {anim === 'diagram' &&
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '4px 0' }}><ProductViz id={p.id} /></div>}
                    {anim === 'static' &&
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(135% 150% at 80% 45%, rgba(42,82,201,0.32), rgba(1,1,32,0) 62%)' }}></div>}
                    <span className="t-mono-label" style={{ position: 'absolute', top: 'var(--space-lg)', left: 'var(--space-2xl)', color: 'var(--accent-periwinkle)' }}>{p.no}</span>
                  </div>
                  <div style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="t-display-md" style={{ color: 'var(--on-dark)' }}>{p.name}</h3>
                    <p className="t-body-md" style={{ color: '#b9bcce', marginTop: 'var(--space-md)', flex: 1 }}>{p.tagline}</p>
                    <span className="t-mono-button" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-lg)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Learn more<i data-lucide="arrow-up-right" style={{ width: 16, height: 16 }}></i></span>
                  </div>
                </Card>
              </a>
            </Reveal>
          )}
        </div>
      </Container>
    </section>);

}

/* Closing CTA — dark band. */
function HomeCTA() {
  return (
    <section style={{ background: 'var(--canvas-dark)' }}>
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)', textAlign: 'center' }}>
        <Eyebrow dark style={{ textAlign: 'center' }}>ACCELERATING YOUR SUCCESS</Eyebrow>
        <h2 className="t-display-xl" style={{ color: 'var(--on-dark)', maxWidth: 680, margin: 'var(--space-lg) auto 0' }}>Let’s accelerate your mission</h2>
        <p className="t-body-lg" style={{ color: '#b9bcce', marginTop: 'var(--space-lg)' }}>Innovation. Intelligence. Integrity.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-2xl)', flexWrap: 'wrap' }}>
          <Pill variant="mint" href="contact.html">Contact us</Pill>
          <Pill variant="ghost" href="solutions.html">Explore solutions</Pill>
        </div>
      </Container>
    </section>);

}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVisual": "globe",
  "productAnim": "particles",
  "productScene": "auto",
  "productIntensity": "bold"
} /*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {refreshIcons();});
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <NavBar current="who" />
      <HomeHero t={t} />
      <PartnerBar />
      <WhoWeAre />
      <HomeSolutions />
      <HomeProducts t={t} />
      <HomeCTA />
      <Footer />
      <ContactOrb />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio label="Visual" value={t.heroVisual}
        options={['flow', 'network', 'globe', 'accelerate']}
        onChange={(v) => setTweak('heroVisual', v)} />
        <TweakSection label="Product cards" />
        <TweakRadio label="Animation" value={t.productAnim || 'particles'}
        options={['particles', 'static', 'diagram']}
        onChange={(v) => setTweak('productAnim', v)} />
        {(t.productAnim || 'particles') === 'particles' && <>
          <TweakSelect label="Scene" value={t.productScene || 'auto'}
          options={[{ value: 'auto', label: 'Per product' }, 'flow', 'network', 'globe', 'accelerate']}
          onChange={(v) => setTweak('productScene', v)} />
          <TweakRadio label="Intensity" value={t.productIntensity || 'bold'}
          options={['subtle', 'medium', 'bold']}
          onChange={(v) => setTweak('productIntensity', v)} />
        </>}
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
