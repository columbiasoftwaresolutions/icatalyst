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

/* Technology partners — bold label above, seamless logo marquee below. */
function PartnerBar() {
  return (
    <section style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)', paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <PartnerMarquee label="Technology Partners" />
    </section>);

}

/* Metric tile — big count-up number + label. */
function MetricTile({ m, tint }) {
  return (
    <div className="ic-lift" style={{ background: tint, borderRadius: 'var(--radius-sm)', padding: 'var(--space-2xl)' }}>
      <span className="t-display-xl" style={{ color: 'var(--ink)', fontFeatureSettings: '"tnum"' }}>
        <CountUp to={parseFloat(m.num)} prefix={m.pre} suffix={m.suf} />
      </span>
      <span className="t-body-md" style={{ color: 'var(--ink)', opacity: .72, display: 'block', marginTop: 'var(--space-sm)' }}>{m.l}</span>
    </div>
  );
}

/* Who We Are — scroll-locked reveal: the metric tiles hold prominent while the
   section pins, then slide aside as the detail dropdowns reveal on the left.
   Detail rows include Our Philosophy as a "+" that nests the three principles
   as sub-dropdowns. Falls back to a simple two-column layout on narrow screens. */
function WhoWeAre() {
  const trackRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const colsRef = React.useRef(null);
  const boxesRef = React.useRef(null);
  const rows = [
    { label: 'WHAT WE DO', body: IC.whoWeAre[0] },
    { label: 'CERTIFICATIONS & FRAMEWORK', body: IC.whoWeAre[1] },
    { label: 'CONTRACT VEHICLES & PARTNERS', body: IC.whoWeAre[2] },
    { label: 'OUR PEOPLE', body: IC.whoWeAre[3] },
  ];
  const tints = ['var(--accent-mint)', 'var(--accent-periwinkle)', 'var(--accent-mint)'];

  React.useEffect(() => {
    const track = trackRef.current, stage = stageRef.current;
    if (!track || !stage) return;
    const wide = () => window.innerWidth >= 1001;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const ease = (t) => t * t * (3 - 2 * t); // smoothstep
    const update = () => {
      const cols = colsRef.current, boxes = boxesRef.current;
      if (!wide() || reduce) {
        stage.style.setProperty('--p', '1');
        if (boxes) boxes.style.transform = '';
        return;
      }
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - stage.offsetHeight;
      const p = ease(total > 0 ? clamp((72 - rect.top) / total) : 1);
      stage.style.setProperty('--p', p.toFixed(3));
      // Center the boxes at p=0 (offset from their final right-column slot to the
      // row centre), sliding to their slot at p=1.
      if (cols && boxes) {
        const offset = cols.offsetWidth / 2 - (boxes.offsetLeft + boxes.offsetWidth / 2);
        const tx = (offset * (1 - p)).toFixed(1);
        const sc = (1 + (1 - p) * 0.06).toFixed(3);
        boxes.style.transform = `translateX(${tx}px) scale(${sc})`;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return (
    <section id="who" style={{ background: 'var(--canvas)', scrollMarginTop: 80 }} data-screen-label="Who We Are">
      <Container style={{ paddingTop: 'var(--space-section)' }}>
        <Eyebrow>WHO WE ARE</Eyebrow>
        <TypeOut as="h2" className="t-display-xl" style={{ color: 'var(--ink)', marginTop: 'var(--space-lg)', maxWidth: 760 }}
          text="A trusted technology partner for mission-critical work" loop={false} onView={false} caretColor="var(--accent-magenta)" />
      </Container>

      <div ref={trackRef} className="who-track">
        <div ref={stageRef} className="who-stage" style={{ '--p': 1 }}>
          <Container>
            <div ref={colsRef} className="who-cols" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
              {/* LEFT — detail dropdowns, revealed by scroll progress */}
              <div className="who-detail">
                <div style={{ borderTop: '1px solid var(--hairline)' }}>
                  {rows.map((r) => <Accordion key={r.label} label={r.label}>{r.body}</Accordion>)}
                  <Accordion label="OUR PHILOSOPHY" meta="Innovation · Intelligence · Integrity">
                    <p className="t-body-md" style={{ color: 'var(--body)', maxWidth: 720 }}>{IC.philosophy.intro[0]}</p>
                    <div style={{ borderTop: '1px solid var(--hairline)', marginTop: 'var(--space-lg)' }}>
                      {IC.philosophy.values.map((v) => <Accordion key={v.e} label={v.e} sub>{v.b}</Accordion>)}
                    </div>
                    <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 'var(--space-lg)' }}>{IC.philosophy.closing}</p>
                  </Accordion>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2xl)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
                  <ArrowLink href="solutions.html">Our solutions</ArrowLink>
                  <ArrowLink href="contracts.html">Contracts &amp; certifications</ArrowLink>
                </div>
              </div>
              {/* RIGHT — metric tiles: prominent, then slide aside */}
              <div ref={boxesRef} className="who-boxes" style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                {IC.metrics.map((m, i) => <MetricTile key={m.l} m={m} tint={tints[i % tints.length]} />)}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>);

}

/* Solutions — 5 image-led cards (shared SolutionCard) + a dark "view all" tile. */
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

/* Closing CTA — white band. */
function HomeCTA() {
  return (
    <section style={{ background: 'var(--canvas)', borderTop: '1px solid var(--hairline)' }}>
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)', textAlign: 'center' }}>
        <Eyebrow style={{ textAlign: 'center' }}>ACCELERATING YOUR SUCCESS</Eyebrow>
        <TypeOut as="h2" className="t-display-xl" style={{ color: 'var(--ink)', maxWidth: 680, margin: 'var(--space-lg) auto 0' }}
          text="Let’s accelerate your mission" loop={false} onView={false} caretColor="var(--accent-magenta)" />
        <p className="t-body-lg" style={{ color: 'var(--body)', marginTop: 'var(--space-lg)' }}>Innovation. Intelligence. Integrity.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-2xl)', flexWrap: 'wrap' }}>
          <Pill variant="primary" href="contact.html">Contact us</Pill>
          <Pill variant="outline" href="solutions.html">Explore solutions</Pill>
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
