/* ============================================================================
   iCatalyst — signature animated visuals.
   BrandHeroViz: 3 abstract, on-brand hero options (accelerate / network / orbit).
   ProductViz:   a bespoke animated graphic per product.
   All built on the brand palette only; honor prefers-reduced-motion via site.css.
   ============================================================================ */

const IC_O = 'var(--accent-orange)', IC_M = 'var(--accent-magenta)',
      IC_P = 'var(--accent-periwinkle)', IC_C = 'var(--accent-mint)';

/* ---------------------------------------------------------------------------
   BrandHeroViz — the hero centerpiece. Abstract acceleration / intelligence.
   --------------------------------------------------------------------------- */
function BrandHeroViz({ variant = 'accelerate', style }) {
  const wrap = { width: '100%', height: 'auto', maxWidth: 460, overflow: 'visible', ...style };

  /* shared defs */
  const defs = (
    <defs>
      <radialGradient id="ic-core" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="0.35" stopColor={IC_M} stopOpacity="0.9" />
        <stop offset="1" stopColor={IC_P} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ic-trail" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={IC_O} stopOpacity="0" />
        <stop offset="0.6" stopColor={IC_M} stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="ic-edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={IC_M} />
        <stop offset="0.5" stopColor={IC_P} />
        <stop offset="1" stopColor={IC_C} />
      </linearGradient>
    </defs>
  );

  const Comet = ({ path, delay, dur }) => (
    <g className="ic-streak" style={{ offsetPath: `path('${path}')`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
      <path d="M -40 0 Q -16 -3.4 0 0 Q -16 3.4 -40 0 Z" fill="url(#ic-trail)" />
      <circle cx="0" cy="0" r="3.6" fill="#fff" />
      <circle cx="0" cy="0" r="6.5" fill="#fff" opacity="0.25" />
    </g>
  );

  const Star = ({ x, y, r = 9, delay = 0, color = IC_O }) => (
    <g className="ic-twinkle" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${delay}s` }}>
      <path d={`M ${x} ${y - r} L ${x + r * 0.22} ${y - r * 0.22} L ${x + r} ${y} L ${x + r * 0.22} ${y + r * 0.22} L ${x} ${y + r} L ${x - r * 0.22} ${y + r * 0.22} L ${x - r} ${y} L ${x - r * 0.22} ${y - r * 0.22} Z`} fill={color} />
    </g>
  );

  if (variant === 'network') {
    const N = [[70,80],[150,50],[250,80],[330,60],[110,160],[210,150],[300,170],[160,250],[260,250],[230,205]];
    const E = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[4,5],[5,6],[4,7],[5,9],[7,8],[8,6],[9,8],[3,6]];
    return (
      <svg viewBox="0 0 400 320" fill="none" style={wrap} aria-hidden="true">
        {defs}
        <circle cx="200" cy="160" r="120" fill="url(#ic-core)" opacity="0.18" className="ic-breathe" style={{ transformOrigin: '200px 160px' }} />
        <g>
          {E.map(([a, b], i) => {
            const len = Math.hypot(N[a][0] - N[b][0], N[a][1] - N[b][1]).toFixed(0);
            return <line key={i} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke="url(#ic-edge)" strokeWidth="1.4" opacity="0.5" className="ic-trace" style={{ '--len': len, animationDelay: `${(i % 6) * 0.5}s`, animationDuration: '5s' }} />;
          })}
        </g>
        {N.map((p, i) => (
          <g key={i} className="ic-pulse" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, animationDelay: `${(i % 5) * 0.4}s` }}>
            <circle cx={p[0]} cy={p[1]} r={i === 9 ? 8 : i % 3 === 0 ? 6 : 4} fill={[IC_M, IC_O, IC_P, IC_C][i % 4]} />
          </g>
        ))}
        <Star x={330} y={60} r={8} delay={0.4} color={IC_O} />
        <Star x={70} y={80} r={6} delay={1.2} color={IC_C} />
      </svg>
    );
  }

  if (variant === 'orbit') {
    return (
      <svg viewBox="0 0 400 360" fill="none" style={wrap} aria-hidden="true">
        {defs}
        <circle cx="200" cy="185" r="150" fill="url(#ic-core)" opacity="0.2" className="ic-breathe" style={{ transformOrigin: '200px 185px' }} />
        {[130, 96, 60].map((r, i) => (
          <circle key={i} cx="200" cy="185" r={r} stroke={[IC_P, IC_M, IC_O][i]} strokeWidth="1.4" opacity={0.35 + i * 0.18} strokeDasharray={i === 0 ? '2 7' : 'none'} />
        ))}
        <g className="ic-orbit" style={{ transformOrigin: '200px 185px' }}>
          <circle cx="200" cy="55" r="6" fill={IC_O} />
          <circle cx="330" cy="185" r="4.5" fill={IC_C} />
        </g>
        <g className="ic-spin-r" style={{ transformOrigin: '200px 185px' }}>
          <circle cx="104" cy="185" r="5" fill={IC_M} />
          <circle cx="200" cy="281" r="4" fill={IC_P} />
        </g>
        <g className="ic-orbit" style={{ transformOrigin: '200px 185px', animationDuration: '20s' }}>
          <circle cx="260" cy="185" r="3.5" fill={IC_C} />
        </g>
        <circle cx="200" cy="185" r="11" fill="url(#ic-edge)" className="ic-breathe" style={{ transformOrigin: '200px 185px' }} />
        <Star x="200" y="55" r={9} delay={0.2} color={IC_O} />
      </svg>
    );
  }

  /* default: 'accelerate' — comet field, echoing the logo's spark + swoosh */
  return (
    <svg viewBox="0 0 460 380" fill="none" style={wrap} aria-hidden="true">
      {defs}
      {/* launch-field arcs, lower-left origin */}
      <g opacity="0.4">
        {[60, 110, 165].map((r, i) => (
          <path key={i} d={`M ${30} ${350 - 0} A ${r} ${r} 0 0 1 ${30 + r} ${350 - r}`} stroke={[IC_P, IC_M, IC_O][i]} strokeWidth="1.3" opacity={0.6 - i * 0.12} />
        ))}
      </g>
      {/* destination core glow, upper-right */}
      <circle cx="380" cy="80" r="120" fill="url(#ic-core)" opacity="0.5" className="ic-breathe" style={{ transformOrigin: '380px 80px' }} />
      <circle cx="380" cy="80" r="9" fill="url(#ic-edge)" className="ic-breathe" style={{ transformOrigin: '380px 80px' }} />
      {/* accelerating comets along arcing trajectories toward the core */}
      <Comet path="M 36 348 C 150 320, 250 180, 374 84" delay={0} dur={2.9} />
      <Comet path="M 60 360 C 190 330, 300 150, 376 82" delay={0.9} dur={3.3} />
      <Comet path="M 24 300 C 150 280, 270 140, 372 80" delay={1.8} dur={2.6} />
      <Comet path="M 80 360 C 210 320, 320 170, 378 86" delay={2.5} dur={3.6} />
      {/* spark at the destination + a couple ambient nodes */}
      <Star x={380} y={80} r={13} delay={0} color={IC_O} />
      <circle cx="150" cy="120" r="3.5" fill={IC_C} className="ic-drift" />
      <circle cx="250" cy="250" r="4" fill={IC_P} className="ic-drift" style={{ animationDelay: '1.4s' }} />
      <circle cx="110" cy="250" r="3" fill={IC_M} className="ic-drift" style={{ animationDelay: '2.6s' }} />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   ProductViz — one bespoke animated graphic per product.
   --------------------------------------------------------------------------- */
function ProductViz({ id, style }) {
  const wrap = { width: '100%', height: '100%', display: 'block', overflow: 'visible', ...style };
  const vdefs = (
    <defs>
      <radialGradient id="pv-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.4" stopColor={IC_M} stopOpacity="0.7" />
        <stop offset="1" stopColor={IC_P} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="pv-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={IC_M} /><stop offset="0.5" stopColor={IC_P} /><stop offset="1" stopColor={IC_C} />
      </linearGradient>
      <linearGradient id="pv-sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={IC_M} stopOpacity="0.45" />
        <stop offset="1" stopColor={IC_M} stopOpacity="0" />
      </linearGradient>
    </defs>
  );

  /* GEOSPATIAL — contour field + radar sweep + plotted air-traffic points */
  if (id === 'geospatial') {
    const pts = [[120, 90, IC_O], [250, 70, IC_C], [300, 150, IC_P], [90, 170, IC_M], [210, 200, IC_O], [180, 120, IC_C]];
    return (
      <svg viewBox="0 0 380 280" fill="none" style={wrap} aria-hidden="true">
        {vdefs}
        {/* contour topography */}
        {[0, 1, 2, 3, 4].map(i => (
          <ellipse key={i} cx="190" cy="140" rx={36 + i * 30} ry={24 + i * 20} stroke={[IC_O, IC_M, IC_P, IC_P, IC_P][i]} strokeWidth="1.4" opacity={0.7 - i * 0.12} className="ic-float" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
        {/* radar sweep */}
        <g className="ic-sweep" style={{ transformOrigin: '190px 140px' }}>
          <path d="M 190 140 L 190 20 A 120 120 0 0 1 300 95 Z" fill="url(#pv-sweep)" />
          <line x1="190" y1="140" x2="190" y2="20" stroke={IC_M} strokeWidth="1.6" opacity="0.7" />
        </g>
        {/* plotted points */}
        {pts.map((p, i) => (
          <g key={i} className="ic-pulse" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, animationDelay: `${i * 0.45}s` }}>
            <circle cx={p[0]} cy={p[1]} r="3.5" fill={p[2]} />
            <circle cx={p[0]} cy={p[1]} r="8" stroke={p[2]} strokeWidth="1" opacity="0.4" />
          </g>
        ))}
        {/* aircraft tracking along a path (3D/4D air-traffic motif) */}
        <g className="ic-streak" style={{ offsetPath: "path('M 40 230 C 130 190, 250 230, 340 60')", animationDuration: '5s' }}>
          <path d="M 0 -5 L 9 0 L 0 5 L 2 0 Z" fill="#fff" />
        </g>
        <circle cx="190" cy="140" r="4.5" fill="url(#pv-grad)" />
      </svg>
    );
  }

  /* SEMANTIC — document deconstructed into a knowledge graph */
  if (id === 'semantic') {
    const N = [[250, 60], [320, 110], [300, 185], [225, 215], [185, 140], [255, 135]];
    const E = [[4, 5], [5, 0], [5, 1], [5, 2], [4, 3], [2, 3], [0, 1]];
    return (
      <svg viewBox="0 0 380 280" fill="none" style={wrap} aria-hidden="true">
        {vdefs}
        {/* document on the left */}
        <g>
          <rect x="36" y="70" width="78" height="100" rx="4" fill="none" stroke={IC_P} strokeWidth="1.6" opacity="0.8" />
          {[88, 102, 116, 130, 144].map((y, i) => (
            <line key={i} x1="48" y1={y} x2={i % 2 ? 96 : 102} y2={y} stroke={[IC_O, IC_M, IC_P, IC_C, IC_P][i]} strokeWidth="2.4" opacity="0.75" className="ic-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>
        {/* extraction beams document → graph */}
        {[100, 120, 140].map((y, i) => (
          <line key={i} x1="114" y1={y} x2="185" y2="140" stroke="url(#pv-grad)" strokeWidth="1.4" className="ic-dash" style={{ animationDelay: `${i * 0.5}s`, opacity: 0.8 }} />
        ))}
        {/* knowledge graph */}
        {E.map(([a, b], i) => {
          const len = Math.hypot(N[a][0] - N[b][0], N[a][1] - N[b][1]).toFixed(0);
          return <line key={i} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke={IC_P} strokeWidth="1.3" opacity="0.55" className="ic-trace" style={{ '--len': len, animationDelay: `${i * 0.45}s`, animationDuration: '5s' }} />;
        })}
        {N.map((p, i) => (
          <g key={i} className="ic-pulse" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, animationDelay: `${i * 0.4}s` }}>
            <circle cx={p[0]} cy={p[1]} r={i === 4 ? 7 : 4.5} fill={[IC_M, IC_O, IC_P, IC_C, IC_M, IC_O][i]} />
          </g>
        ))}
      </svg>
    );
  }

  /* ASSISTANT — RAG: chat bubbles + retrieval to documents + model core */
  if (id === 'assistant') {
    return (
      <svg viewBox="0 0 380 280" fill="none" style={wrap} aria-hidden="true">
        {vdefs}
        {/* chat bubbles rising, left */}
        <g className="ic-rise" style={{ transformOrigin: '70px 80px', animationDelay: '0s' }}>
          <rect x="34" y="64" width="92" height="30" rx="8" fill="none" stroke={IC_P} strokeWidth="1.5" opacity="0.8" />
          <line x1="46" y1="79" x2="100" y2="79" stroke={IC_C} strokeWidth="3" opacity="0.7" />
        </g>
        <g className="ic-rise" style={{ transformOrigin: '70px 140px', animationDelay: '1.6s' }}>
          <rect x="48" y="120" width="92" height="30" rx="8" fill={IC_M} opacity="0.18" stroke={IC_M} strokeWidth="1.5" />
          <line x1="60" y1="135" x2="120" y2="135" stroke={IC_M} strokeWidth="3" opacity="0.8" />
        </g>
        <g className="ic-rise" style={{ transformOrigin: '70px 200px', animationDelay: '3.2s' }}>
          <rect x="34" y="184" width="80" height="28" rx="8" fill="none" stroke={IC_P} strokeWidth="1.5" opacity="0.8" />
          <line x1="46" y1="198" x2="92" y2="198" stroke={IC_O} strokeWidth="3" opacity="0.7" />
        </g>
        {/* model core */}
        <circle cx="220" cy="140" r="60" fill="url(#pv-glow)" opacity="0.5" className="ic-breathe" style={{ transformOrigin: '220px 140px' }} />
        <circle cx="220" cy="140" r="16" fill="url(#pv-grad)" className="ic-breathe" style={{ transformOrigin: '220px 140px' }} />
        <circle cx="220" cy="140" r="26" stroke={IC_M} strokeWidth="1.3" opacity="0.5" className="ic-spin" style={{ transformOrigin: '220px 140px' }} strokeDasharray="3 6" />
        {/* retrieval links to document chips, right */}
        {[[320, 80], [332, 140], [320, 200]].map((d, i) => (
          <g key={i}>
            <line x1="246" y1="140" x2={d[0] - 4} y2={d[1]} stroke="url(#pv-grad)" strokeWidth="1.4" className="ic-dash" style={{ animationDelay: `${i * 0.4}s`, opacity: 0.75 }} />
            <rect x={d[0]} y={d[1] - 16} width="30" height="32" rx="4" fill="none" stroke={IC_P} strokeWidth="1.4" opacity="0.8" />
            <line x1={d[0] + 6} y1={d[1] - 6} x2={d[0] + 24} y2={d[1] - 6} stroke={[IC_O, IC_C, IC_P][i]} strokeWidth="2" opacity="0.7" />
            <line x1={d[0] + 6} y1={d[1] + 2} x2={d[0] + 24} y2={d[1] + 2} stroke={IC_P} strokeWidth="2" opacity="0.4" />
          </g>
        ))}
        {/* user query line into core */}
        <line x1="140" y1="135" x2="200" y2="140" stroke={IC_M} strokeWidth="1.6" className="ic-dash" style={{ opacity: 0.8 }} />
      </svg>
    );
  }

  return null;
}

Object.assign(window, { BrandHeroViz, ProductViz });
