/* Homepage — composes the full iCatalyst brand surface. */

/* Hero — dark band. Layout + visual are tweakable (see Tweaks panel). */
function HomeHero({ t }) {
  const layout = t.heroLayout || 'split';
  const visual = t.heroVisual || 'accelerate';
  const headline = t.heroHeadline || IC.homeHeadline;
  const centered = layout === 'centered';

  const lead =
  <p className="t-body-lg" style={{ color: '#b9bcce', marginTop: 'var(--space-2xl)', maxWidth: 440, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0 }}>
      AI, automation, and analytics for federal and commercial missions.
    </p>;

  const ctas =
  <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-3xl)', flexWrap: 'wrap', justifyContent: centered ? 'center' : 'flex-start' }}>
      <Pill variant="mint" href="solutions.html">Explore solutions</Pill>
      <Pill variant="ghost" href="contact.html" icon="phone">Contact us</Pill>
    </div>;

  const principles =
  <div style={{ display: 'flex', gap: 'var(--space-2xl)', marginTop: 'var(--space-4xl)', flexWrap: 'wrap', justifyContent: centered ? 'center' : 'flex-start' }}>
      {IC.company.principles.map((p) =>
    <span key={p} className="t-mono-label" style={{ color: '#8388a8' }}>{p}</span>
    )}
    </div>;

  const text =
  <div style={{ textAlign: centered ? 'center' : 'left' }}>
      <Eyebrow dark>ACCELERATING YOUR SUCCESS</Eyebrow>
      <h1 className="t-display-xxl" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-lg)', maxWidth: centered ? 'none' : 600, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0 }}>{headline}</h1>
      {lead}
      {ctas}
      {principles}
    </div>;


  if (centered) {
    return (
      <section style={{ background: 'var(--canvas-dark)', color: 'var(--on-dark)' }} data-screen-label="Hero">
        <Container style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-section)', textAlign: 'center' }}>
          <div style={{ paddingBottom: 'var(--space-4xl)', display: 'flex', justifyContent: 'center' }}>
            <ValueRotator items={IC.valueStatements} />
          </div>
          {text}
          <div style={{ width: '100%', maxWidth: 620, height: 360, margin: 'var(--space-5xl) auto 0' }}>
            <Viz scene={visual} intensity="bold" />
          </div>
        </Container>
      </section>);

  }

  if (layout === 'fullbleed') {
    return (
      <section style={{ background: 'var(--canvas-dark)', color: 'var(--on-dark)', position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 64px)' }} data-screen-label="Hero">
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Viz scene={visual} intensity="bold" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--canvas-dark) 18%, rgba(1,1,32,0.55) 50%, rgba(1,1,32,0) 80%)' }}></div>
        </div>
        <Container style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-section)', position: 'relative' }}>
          <div style={{ paddingBottom: 'var(--space-5xl)' }}>
            <ValueRotator items={IC.valueStatements} />
          </div>
          <div style={{ maxWidth: 600 }}>{text}</div>
        </Container>
      </section>);

  }

  /* split (default) */
  return (
    <section style={{ background: 'var(--canvas-dark)', color: 'var(--on-dark)' }} data-screen-label="Hero">
      <Container style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-section)' }}>
        <div style={{ paddingBottom: 'var(--space-5xl)' }}>
          <ValueRotator items={IC.valueStatements} />
        </div>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-5xl)', alignItems: 'center' }}>
          {text}
          <div style={{ width: '100%', height: 460 }}>
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

/* Technology partners — seamless horizontal marquee (grayscale → color on hover). */
function PartnerBar() {
  const items = IC.partnerLogos;
  return (
    <section style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}>
      <Container style={{ padding: 'var(--space-5xl) var(--space-3xl)' }}>
        <p className="t-mono-eyebrow" style={{ color: 'var(--body)', textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>TECHNOLOGY PARTNERS</p>
      </Container>
      <div className="ic-marquee" style={{ position: 'relative', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
        <div className="ic-marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
          {items.map((p) => <PartnerLogo key={p.id} p={p} />)}
          {items.map((p) => <PartnerLogo key={p.id + '-2'} p={p} />)}
        </div>
      </div>
    </section>);

}

/* Who We Are — minimal intro, detail tucked into dropdowns + metric tiles. */
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
        <h2 className="t-display-xl" style={{ color: 'var(--ink)', marginTop: 'var(--space-lg)', maxWidth: 760 }}>
          A trusted technology partner for mission-critical work
        </h2>
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 'var(--space-5xl)', marginTop: 'var(--space-3xl)', alignItems: 'start' }}>
          <div>
            <div style={{ borderTop: '1px solid var(--hairline)' }}>
              {rows.map((r) =>
              <Accordion key={r.label} label={r.label}>{r.body}</Accordion>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2xl)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
              <ArrowLink href="solutions.html">Our solutions</ArrowLink>
              <ArrowLink href="contracts.html">Contracts &amp; certifications</ArrowLink>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            {IC.metrics.map((m, i) =>
            <Reveal key={m.l} delay={i * 110}>
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

/* Our Philosophy — dark band, headline + three principle dropdowns. */
function Philosophy() {
  return (
    <section style={{ background: 'var(--canvas-dark)' }} data-screen-label="Our Philosophy">
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'var(--space-5xl)', alignItems: 'start' }}>
          <div>
            <Eyebrow dark>OUR PHILOSOPHY</Eyebrow>
            <h2 className="t-display-xl" style={{ color: 'var(--on-dark)', marginTop: 'var(--space-lg)', maxWidth: 420 }}>
              We don’t just deliver technology — we accelerate outcomes
            </h2>
          </div>
          <div style={{ borderTop: '1px solid var(--hairline-on-dark)' }}>
            {IC.philosophy.values.map((v, i) =>
            <Accordion key={v.e} label={v.e} dark>{v.b}</Accordion>
            )}
          </div>
        </div>
      </Container>
    </section>);

}

/* Solutions — 5 cards + a "view all" CTA card. */
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
              <a href={`solution.html?id=${s.id}`} className="sm-host" style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
                <Card className="ic-lift ic-lift-light" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-2xl)', overflow: 'hidden' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 46, lineHeight: 1, letterSpacing: '0.01em', color: 'var(--accent-magenta)', opacity: 0.42 }}>{s.no}</span>
                  <div className="sol-rule" style={{ marginTop: 'var(--space-lg)' }}>
                    <span className="seg-red"></span>
                    <span className="seg-blue"></span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="t-display-md" style={{ color: 'var(--ink)', marginTop: 'var(--space-2xl)' }}>{s.name}</h3>
                    <p className="t-body-md" style={{ color: 'var(--body)', marginTop: 'var(--space-md)', flex: 1 }}>{s.summary}</p>
                    <span className="t-mono-button" style={{ color: 'var(--ink)', marginTop: 'var(--space-lg)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Explore<i data-lucide="arrow-up-right" style={{ width: 16, height: 16 }}></i></span>
                  </div>
                </Card>
              </a>
            </Reveal>
          )}
          <Reveal delay={IC.solutions.length * 80} style={{ display: 'flex' }}>
            <a href="solutions.html" className="sm-host" style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
              <div className="ic-lift" style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-sm)', background: 'var(--canvas-dark)', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180, position: 'relative', overflow: 'hidden' }}>
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

/* Credentials — certifications + contract vehicles. */
function Credentials() {
  return (
    <section style={{ background: 'var(--canvas)', borderTop: '1px solid var(--hairline)' }}>
      <Container style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
        <div className="two-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5xl)' }}>
          <div>
            <Eyebrow>CONTRACT VEHICLES</Eyebrow>
            <h3 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>Streamlined federal access</h3>
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              {IC.contractVehicles.map((c) => <SpecBadge key={c.code} code={c.code} name={c.name} />)}
            </div>
          </div>
          <div>
            <Eyebrow>CERTIFICATIONS</Eyebrow>
            <h3 className="t-display-lg" style={{ color: 'var(--ink)', marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>Quality &amp; security, verified</h3>
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {IC.certifications.map((c) => <SpecBadge key={c.code} code={c.code} name={c.name} />)}
            </div>
            <p className="t-caption" style={{ color: 'var(--body)', marginTop: 'var(--space-lg)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <i data-lucide="file-text" style={{ width: 14, height: 14 }}></i> {IC.links.brochure}
            </p>
          </div>
        </div>
      </Container>
    </section>);

}

/* Testimonials — placeholder (none available yet). */
function HomeTestimonials() {
  return (
    <section style={{ background: 'var(--canvas)' }} data-screen-label="Testimonials">
      <Container style={{ paddingBottom: 'var(--space-section)' }}>
        <SectionHead eyebrow="CUSTOMERS" title="What our clients say" />
        <div style={{ marginTop: 'var(--space-3xl)' }}>
          <PlaceholderBlock note="CLIENT TESTIMONIALS — TO BE PROVIDED">
            Testimonial quotes, client names, roles, and agency / organization will appear here once supplied.
          </PlaceholderBlock>
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
  "heroLayout": "fullbleed",
  "heroVisual": "globe",
  "heroHeadline": "Automation and AI-Driven Solutions",
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
      <Philosophy />
      <HomeSolutions />
      <HomeProducts t={t} />
      <Credentials />
      <HomeCTA />
      <Footer />
      <ContactOrb />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio label="Layout" value={t.heroLayout}
        options={['split', 'centered', 'fullbleed']}
        onChange={(v) => setTweak('heroLayout', v)} />
        <TweakRadio label="Visual" value={t.heroVisual}
        options={['flow', 'network', 'globe', 'accelerate']}
        onChange={(v) => setTweak('heroVisual', v)} />
        <TweakText label="Headline" value={t.heroHeadline}
        onChange={(v) => setTweak('heroHeadline', v)} />
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