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

/* Metric column — Indra-style three-tier: category label above, big count-up
   number, caption below. The wrapping .who-metric supplies the divider + layout. */
function MetricTile({ m }) {
  return (
    <React.Fragment>
      <span className="t-body-md who-metric__top">{m.top}</span>
      <span className="t-display-xl who-metric__num" style={{ fontFeatureSettings: '"tnum"' }}>
        <CountUp to={parseFloat(m.num)} prefix={m.pre} suffix={m.suf} />
      </span>
      <span className="t-body-md who-metric__cap">{m.l}</span>
    </React.Fragment>
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
  const detailRef = React.useRef(null);
  const headRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const rows = [
    { label: 'WHAT WE DO', body: IC.whoWeAre[0] },
    { label: 'CERTIFICATIONS & FRAMEWORK', body: IC.whoWeAre[1] },
    { label: 'CONTRACT VEHICLES & PARTNERS', body: IC.whoWeAre[2] },
    { label: 'OUR PEOPLE', body: IC.whoWeAre[3] },
  ];

  React.useEffect(() => {
    const track = trackRef.current, stage = stageRef.current, boxes = boxesRef.current;
    if (!track || !stage || !boxes) return;
    const wide = () => window.innerWidth >= 1001;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const ease = (t) => t * t * (3 - 2 * t); // smoothstep
    const lerp = (a, b, t) => a + (b - a) * t;
    const HOLD = 0.06;   // reveal holds (hero + numbers wiped in) before docking
    const MID  = 0.5;    // numbers finish docking into the top-right stack
    const DONE = 0.9;    // detail finishes right before the pin releases (no dead tail)
    const GAP  = 22;     // vertical gap between docked metrics
    const HERO_GAP = 150; // vertical offset from hero top to the numbers row on reveal
    let revealed = false;
    const doReveal = () => { revealed = true; boxes.classList.add('who-boxes--revealed'); if (heroRef.current) heroRef.current.classList.add('who-hero--in'); };

    const clearInline = () => {
      for (const el of boxes.children) { el.style.left = el.style.top = el.style.width = ''; el.style.removeProperty('--vdiv'); el.style.removeProperty('--hdiv'); }
    };

    const update = () => {
      const cols = colsRef.current, detail = detailRef.current, head = headRef.current, hero = heroRef.current;
      if (!wide() || reduce) {
        boxes.classList.add('who-boxes--static');
        clearInline();
        stage.style.setProperty('--p', '1');
        if (detail) detail.style.opacity = '';
        if (head) head.style.opacity = '';
        if (hero) { hero.style.opacity = ''; hero.style.top = ''; }
        return;
      }
      boxes.classList.remove('who-boxes--static');
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - stage.offsetHeight;
      const p = total > 0 ? clamp((72 - rect.top) / total) : 1;
      if (!cols) return;
      // Each column glides on a continuous path (no reflow / flip): JS lerps its
      // left & top from the horizontal, centred row into a vertical stack docked
      // top-right. Divider hairlines cross-fade (vertical → horizontal). Above
      // the row a hero line is centred; it fades out the moment the numbers move,
      // then the regular header + accordion detail fade in.
      const N = boxes.children.length;
      const W = cols.offsetWidth;
      const colW = W / N;
      let rowH = 0;
      for (const el of boxes.children) el.style.width = colW + 'px';
      for (const el of boxes.children) rowH = Math.max(rowH, el.offsetHeight);
      const q1     = ease(clamp((p - HOLD) / (MID - HOLD)));         // numbers row → stack
      const heroO  = 1 - ease(clamp((p - HOLD) / (0.20 - HOLD)));    // hero fades as they move
      const hd     = ease(clamp((p - 0.52) / (0.72 - 0.52)));        // regular header fades in
      const q2     = ease(clamp((p - MID) / (DONE - MID)));          // accordion detail
      // Reveal group (hero above, numbers below) sits vertically centred.
      const groupH = HERO_GAP + rowH;
      const heroY = Math.max(20, (cols.offsetHeight - groupH) / 2);
      const numbersY = heroY + HERO_GAP;
      // Fire the wipe only once the numbers have actually scrolled into view
      // (like the count-up) — not while the section is barely peeking in.
      if (!revealed && cols.getBoundingClientRect().top + numbersY < window.innerHeight * 0.85) doReveal();
      const step = rowH + GAP;
      for (let i = 0; i < N; i++) {
        const el = boxes.children[i];
        el.style.left = lerp(i * colW, (N - 1) * colW, q1).toFixed(1) + 'px';
        el.style.top  = lerp(numbersY, i * step, q1).toFixed(1) + 'px';
        el.style.setProperty('--vdiv', (1 - q1).toFixed(3));
        el.style.setProperty('--hdiv', (i === 0 ? 0 : q1).toFixed(3));
      }
      if (hero) { hero.style.top = heroY.toFixed(1) + 'px'; hero.style.opacity = heroO.toFixed(3); }
      if (head) head.style.opacity = hd.toFixed(3);
      if (detail) detail.style.opacity = q2.toFixed(3);
      stage.style.setProperty('--p', q2.toFixed(3));
    };
    // Reduced-motion: skip the wipe entirely (CSS just shows everything).
    if (reduce) doReveal();
    update();

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return (
    <section id="who" style={{ background: 'var(--canvas)', scrollMarginTop: 80 }} data-screen-label="Who We Are">
      <div ref={trackRef} className="who-track">
        <div ref={stageRef} className="who-stage" style={{ '--p': 1 }}>
          <Container>
            <div ref={colsRef} className="who-cols">
              {/* Hero line — wipes in above the numbers, then fades as they move */}
              <div ref={heroRef} className="who-hero">
                <Eyebrow>BY THE NUMBERS</Eyebrow>
                <div className="who-hero__line" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)' }}>Proven where it matters most</div>
              </div>
              {/* LEFT — section header + accordion, fade in once the metrics dock */}
              <div className="who-left">
                <div ref={headRef} className="who-head">
                  <Eyebrow>WHO WE ARE</Eyebrow>
                  <h2 className="t-display-xl" style={{ color: 'var(--ink)', marginTop: 'var(--space-lg)', maxWidth: 560 }}>
                    A trusted technology partner for mission-critical work
                  </h2>
                </div>
                <div ref={detailRef} className="who-detail">
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
              </div>
              {/* RIGHT (overlay) — metric columns wipe in left→right, count up, then
                  glide from the centred horizontal row into the top-right stack. */}
              <div ref={boxesRef} className="who-boxes">
                {IC.metrics.map((m) =>
                <div key={m.l} className="who-metric"><MetricTile m={m} /></div>
                )}
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
    <section style={{ background: 'var(--canvas-dark)' }} data-screen-label="Solutions">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <SectionHead dark eyebrow="SOLUTIONS" title="Five core solution areas" />
          <Pill variant="ghost" href="solutions.html">View all</Pill>
        </div>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {IC.solutions.map((s, i) =>
          <Reveal key={s.id} delay={(i % 3) * 60} style={{ display: 'flex' }}>
              <SolutionCard s={s} />
            </Reveal>
          )}
          <Reveal delay={(IC.solutions.length % 3) * 60} style={{ display: 'flex' }}>
            <a href="solutions.html" className="sm-host ic-card-link ic-ctacard">
              <Eyebrow dark>ALL SOLUTIONS</Eyebrow>
              <span className="t-display-md" style={{ color: 'var(--on-dark)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>Explore the full portfolio<i data-lucide="arrow-right" className="sol-arrow" style={{ width: 22, height: 22, transition: 'transform .2s ease' }}></i></span>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>);

}

/* Products — dark band, 3 image cards (same style as solutions). */
function HomeProducts() {
  return (
    <section style={{ background: 'var(--canvas)' }} data-screen-label="Products">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <SectionHead eyebrow="PRODUCTS" title="Purpose-built AI products" />
          <Pill variant="outline" href="products.html">View all</Pill>
        </div>
        <div className="three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-lg)', marginTop: 'var(--space-3xl)' }}>
          {IC.products.map((p, i) =>
          <Reveal key={p.id} delay={i * 90} style={{ display: 'flex' }}>
              <ImageCard id={p.id} no={p.no} title={p.name.replace('iCatalyst ', '')} body={p.tagline} scene={IC.productScene[p.id]} href={`products.html#${p.id}`} />
            </Reveal>
          )}
        </div>
      </Container>
    </section>);

}

/* Closing band — dark, minimal: eyebrow + the two CTAs, near the bottom. */
function HomeClose() {
  return (
    <section style={{ background: 'var(--canvas-dark)' }}>
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)', textAlign: 'center' }}>
        <Eyebrow dark style={{ textAlign: 'center' }}>ACCELERATING YOUR SUCCESS</Eyebrow>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <Pill variant="mint" href="contact.html">Contact us</Pill>
          <Pill variant="ghost" href="solutions.html">Explore solutions</Pill>
        </div>
      </Container>
    </section>);

}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVisual": "globe"
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
      <HomeProducts />
      <HomeClose />
      <Footer />
      <ContactOrb />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio label="Visual" value={t.heroVisual}
        options={['flow', 'network', 'globe', 'accelerate']}
        onChange={(v) => setTweak('heroVisual', v)} />
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
