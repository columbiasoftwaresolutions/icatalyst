/* ============================================================================
   iCatalyst — Solution card header symbols.
   ONE clean abstract symbol per panel: a single centered composition with lots
   of negative space, drawn in ONE shared geometric language so the five read as
   a deliberate symbol set by one designer.
     · line weight: 1.6 everywhere
     · periwinkle (SB) = structure / lines / latent nodes
     · royal blue (SR) = the solid core / origin (where one exists)
     · crimson (SA)   = the single focal accent, with a faint pulsing halo
   Symbolic, not literal. Centered on (160,60) within the y 24–96 safe band so
   xMidYMid-slice never crops the meaning.
   ============================================================================ */

const SB = 'var(--accent-periwinkle)';  /* light blue — structure / lines */
const SR = 'var(--accent-magenta)';     /* royal blue — solid core / origin */
const SA = 'var(--accent-orange)';      /* crimson — the single accent */

const LW = 1.6;                          /* one line weight across the set */

const SM_SVG = {
  viewBox: '0 0 320 120',
  preserveAspectRatio: 'xMidYMid slice',
  fill: 'none',
  style: { strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', width: '100%', height: '100%' },
};

/* The shared focal accent — a crimson node inside a faint, slowly-pulsing halo.
   This single motif appears once per panel and ties the set together. */
function Accent({ x, y, r = 4.6, halo = 9.6, d = '3.4s' }) {
  return (
    <g>
      <circle cx={x} cy={y} r={halo} fill={SA} fillOpacity="0.14" className="sm-pulse" style={{ '--d': d }} />
      <circle cx={x} cy={y} r={r} fill={SA} />
    </g>
  );
}

/* ---- 01 · AI-Driven Digital Transformation -------------------------------- */
/* A single core radiating connections outward — intelligence branching from a
   center. The core is royal blue; one outer node is the crimson accent. */
function MotifAI() {
  const C = [160, 60];
  const outer = [[204, 69], [172, 93], [128, 84], [116, 51], [148, 27], [193, 36]];
  const redIdx = 5;
  return (
    <svg {...SM_SVG} aria-hidden="true">
      {outer.map((p, i) => (
        <line key={i} x1={C[0]} y1={C[1]} x2={p[0]} y2={p[1]} stroke={SB} strokeOpacity="0.5" strokeWidth={LW} />
      ))}
      {outer.map((p, i) => i === redIdx ? null : <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill={SB} />)}
      <circle cx={C[0]} cy={C[1]} r="11" fill={SR} fillOpacity="0.12" />
      <circle cx={C[0]} cy={C[1]} r="5.5" fill={SR} />
      <Accent x={outer[redIdx][0]} y={outer[redIdx][1]} />
    </svg>
  );
}

/* ---- 02 · Cloud & Infrastructure Modernization ---------------------------- */
/* Stacked layers lifting / ascending — a grounded base rising into lighter,
   narrower forms. The lifted top layer is the crimson destination. */
function MotifCloud() {
  const layers = [
    { x: 110, y: 84, w: 100, c: SB, fo: 0.16, so: 0.85 },
    { x: 116, y: 64, w: 88, c: SB, fo: 0.10, so: 0.65 },
    { x: 122, y: 46, w: 76, c: SB, fo: 0.05, so: 0.45 },
    { x: 130, y: 24, w: 60, c: SA, fo: 0.14, so: 1 },
  ];
  return (
    <svg {...SM_SVG} aria-hidden="true">
      {layers.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height="12" rx="3"
          fill={l.c} fillOpacity={l.fo} stroke={l.c} strokeOpacity={l.so} strokeWidth={LW} />
      ))}
    </svg>
  );
}

/* ---- 03 · Data Engineering & Advanced Analytics --------------------------- */
/* Many fine lines converging into one clean ascending line — raw data resolving
   into a signal. The royal-blue node is the resolution point; the signal tip is
   the crimson accent. */
function MotifData() {
  const lx = 108;
  const ys = [30, 42, 54, 66, 78, 90];
  const conv = [168, 60];
  const tip = [220, 30];
  return (
    <svg {...SM_SVG} aria-hidden="true">
      {ys.map((y, i) => (
        <line key={i} x1={lx} y1={y} x2={conv[0]} y2={conv[1]} stroke={SB} strokeOpacity="0.3" strokeWidth={LW} />
      ))}
      <line x1={conv[0]} y1={conv[1]} x2={tip[0]} y2={tip[1]} stroke={SB} strokeWidth={LW} />
      <circle cx={conv[0]} cy={conv[1]} r="4.4" fill={SR} />
      <Accent x={tip[0]} y={tip[1]} />
    </svg>
  );
}

/* ---- 04 · Enterprise IT Modernization & Custom Development ----------------- */
/* One solid block transitioning into an ordered grid of smaller squares —
   monolith becoming modular, left → right. One module is the crimson accent. */
function MotifIT() {
  const gx = 168, gy = 44, sz = 13, gap = 6;
  const grid = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) grid.push([gx + c * (sz + gap), gy + r * (sz + gap)]);
  const redIdx = 2; /* top-right module */
  return (
    <svg {...SM_SVG} aria-hidden="true">
      <rect x="104" y="42" width="36" height="36" rx="4" fill={SR} fillOpacity="0.9" stroke={SR} strokeWidth={LW} />
      <path d="M150,60 h12 m-4,-4 l4,4 l-4,4" stroke={SB} strokeOpacity="0.7" strokeWidth={LW} />
      {grid.map((m, i) => i === redIdx ? (
        <rect key={i} x={m[0]} y={m[1]} width={sz} height={sz} rx="2.5" fill={SA} fillOpacity="0.9" stroke={SA} strokeWidth={LW} />
      ) : (
        <rect key={i} x={m[0]} y={m[1]} width={sz} height={sz} rx="2.5" fill="none" stroke={SB} strokeWidth={LW} />
      ))}
    </svg>
  );
}

/* ---- 05 · Mission-Focused Program & Change Management --------------------- */
/* A single path of connected points moving forward, the final point in crimson
   — staged progress toward a goal. */
function MotifProgram() {
  const pts = [[104, 78], [132, 68], [160, 60], [188, 50], [216, 40]];
  const redIdx = pts.length - 1;
  return (
    <svg {...SM_SVG} aria-hidden="true">
      <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={SB} strokeOpacity="0.6" strokeWidth={LW} />
      {pts.map((p, i) => i === redIdx ? null : <circle key={i} cx={p[0]} cy={p[1]} r="3.6" fill={SB} />)}
      <Accent x={pts[redIdx][0]} y={pts[redIdx][1]} r="5" halo="10" />
    </svg>
  );
}

function SolutionMotif({ id }) {
  switch (id) {
    case 'ai': return <MotifAI />;
    case 'cloud': return <MotifCloud />;
    case 'data': return <MotifData />;
    case 'it': return <MotifIT />;
    case 'program': return <MotifProgram />;
    default: return <MotifAI />;
  }
}

/* ---- All-Solutions CTA glyph ---------------------------------------------- */
/* Same language: five periwinkle source nodes converging into one crimson hub —
   "everything connects here" — with a forward arrow. */
function AllSolutionsGlyph() {
  const hub = [196, 60];
  const sources = [[60, 30], [48, 60], [60, 90], [98, 42], [98, 78]];
  return (
    <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" fill="none" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', width: '100%', height: '100%' }} aria-hidden="true">
      {sources.map((s, i) => (
        <line key={i} x1={s[0]} y1={s[1]} x2={hub[0]} y2={hub[1]} stroke={SB} strokeOpacity="0.4" strokeWidth={LW} />
      ))}
      {sources.map((s, i) => <circle key={i} cx={s[0]} cy={s[1]} r="3.4" fill={SB} />)}
      <Accent x={hub[0]} y={hub[1]} r="5.5" halo="13" d="3.2s" />
      <path d={`M${hub[0] + 22} ${hub[1]} h26 m-9,-9 l9,9 l-9,9`} stroke={SB} strokeWidth={LW} className="sm-arrow" />
    </svg>
  );
}

Object.assign(window, { SolutionMotif, AllSolutionsGlyph });
