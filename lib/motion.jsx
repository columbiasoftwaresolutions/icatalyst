/* ============================================================================
   iCatalyst — motion + graphics components. Built on the brand palette only.
   ============================================================================ */

/* ---- Scroll reveal (fade + rise on enter) --------------------------------- */
function Reveal({ children, delay = 0, as = 'div', style, className = '' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('ic-in'); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('ic-in'); io.unobserve(el); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = as;
  return <Comp ref={ref} className={`ic-reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</Comp>;
}

/* ---- Count-up number (animates when scrolled into view) ------------------- */
function CountUp({ to, suffix = '', prefix = '', decimals = 0, duration = 1500 }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf, started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { setVal(to); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !started) { started = true; run(); io.unobserve(el); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

/* Parses "90%+", "2007", "99.9%", "11×" into an animated counter. */
function AutoCount({ text, duration }) {
  const m = String(text).match(/^([\d.,]+)(.*)$/);
  if (!m) return <span>{text}</span>;
  const num = parseFloat(m[1].replace(/,/g, ''));
  const decimals = (m[1].split('.')[1] || '').length;
  return <CountUp to={num} suffix={m[2]} decimals={decimals} duration={duration} />;
}

/* ---- Type-out (typewriter) -------------------------------------------------
   Types text character-by-character. Two modes:
   - single `text`: types once and stops (caret fades). Good for headings/leads.
   - `strings` array: types → holds → deletes → next, looping. Good for a hero
     that cycles taglines.
   Honors prefers-reduced-motion (shows final text, no caret). Optionally waits
   until scrolled into view before starting. */
function TypeOut({
  text, strings, as: As = 'span', className = '', style,
  typeSpeed = 42, deleteSpeed = 22, hold = 1900, startDelay = 180,
  loop, caret = true, caretColor, onView = true, cursorStyle,
}) {
  const items = (strings && strings.length) ? strings : [text || ''];
  const cycles = items.length > 1;
  const shouldLoop = loop === undefined ? cycles : loop;
  const [out, setOut] = React.useState('');
  const [done, setDone] = React.useState(false);
  const ref = React.useRef(null);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    if (reduce) { setOut(items[0]); setDone(true); return; }
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise(res => timers.push(setTimeout(res, ms)));
    const typeStr = async (str) => { for (let i = 1; i <= str.length; i++) { if (cancelled) return; setOut(str.slice(0, i)); await wait(typeSpeed); } };
    const delStr = async (str) => { for (let i = str.length; i >= 0; i--) { if (cancelled) return; setOut(str.slice(0, i)); await wait(deleteSpeed); } };
    const run = async () => {
      await wait(startDelay);
      let i = 0;
      while (!cancelled) {
        await typeStr(items[i]);
        if (!cycles && !shouldLoop) { setDone(true); return; }
        await wait(hold);
        if (!shouldLoop && i === items.length - 1) { setDone(true); return; }
        await delStr(items[i]);
        i = (i + 1) % items.length;
      }
    };
    let io;
    if (onView && 'IntersectionObserver' in window && ref.current) {
      io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); run(); } }), { threshold: 0.25 });
      io.observe(ref.current);
    } else { run(); }
    return () => { cancelled = true; timers.forEach(clearTimeout); if (io) io.disconnect(); };
  }, []);

  return (
    <As ref={ref} className={className} style={style}>
      {out || '​'}
      {caret && !done && <span className="type-caret" aria-hidden="true" style={{ color: caretColor, ...cursorStyle }}>&nbsp;</span>}
    </As>
  );
}

/* ---- Geometric motif graphics (brand palette, animated) ------------------- */
function Motif({ variant = 'nodes', style, className = '' }) {
  const O = 'var(--accent-orange)', M = 'var(--accent-magenta)', P = 'var(--accent-periwinkle)', C = 'var(--accent-mint)';
  const common = { width: '100%', height: '100%', viewBox: '0 0 220 180', preserveAspectRatio: 'xMidYMid meet', fill: 'none', style, className };

  if (variant === 'nodes') {
    const pts = [[40,40],[110,30],[180,55],[55,120],[130,110],[185,140],[95,160]];
    const edges = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,6]];
    return (
      <svg {...common}>
        <g stroke={P} strokeWidth="1.6" opacity="0.7">
          {edges.map(([a,b],i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />)}
        </g>
        {pts.map((p,i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 6 : 4} fill={[M,O,P,C][i % 4]} className="ic-pulse" style={{ animationDelay: `${i * 0.32}s`, transformOrigin: `${p[0]}px ${p[1]}px` }} />
        ))}
      </svg>
    );
  }
  if (variant === 'arcs') {
    return (
      <svg {...common}>
        <g>
          <circle cx="110" cy="90" r="70" stroke={P} strokeWidth="1.4" opacity="0.45" />
          <circle cx="110" cy="90" r="48" stroke={M} strokeWidth="1.6" opacity="0.6" />
          <circle cx="110" cy="90" r="26" stroke={O} strokeWidth="1.8" opacity="0.8" />
        </g>
        <g className="ic-orbit" style={{ transformOrigin: '110px 90px' }}>
          <circle cx="110" cy="20" r="5" fill={O} />
          <circle cx="180" cy="90" r="4" fill={C} />
        </g>
        <g className="ic-spin-r" style={{ transformOrigin: '110px 90px' }}>
          <circle cx="62" cy="90" r="4" fill={M} />
        </g>
        <circle cx="110" cy="90" r="7" fill={M} className="ic-pulse" style={{ transformOrigin: '110px 90px' }} />
      </svg>
    );
  }
  if (variant === 'bars') {
    const hs = [60, 110, 80, 150, 120, 95];
    return (
      <svg {...common}>
        {hs.map((h,i) => (
          <rect key={i} x={18 + i*34} y={170 - h} width="20" height={h} rx="3" fill={[O,M,P,C,M,P][i]} className="ic-grow" style={{ animationDelay: `${i*0.18}s` }} />
        ))}
        <line x1="10" y1="170" x2="212" y2="170" stroke={P} strokeWidth="1.4" opacity="0.4" />
      </svg>
    );
  }
  if (variant === 'grid') {
    const cells = [];
    for (let r=0;r<5;r++) for (let c=0;c<7;c++) cells.push([28 + c*27, 26 + r*32, r, c]);
    const hot = new Set([3, 9, 16, 22, 27, 31]);
    return (
      <svg {...common}>
        {cells.map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="14" height="14" rx="3"
            fill={hot.has(i) ? [M,O,P,C][i % 4] : 'none'}
            stroke={hot.has(i) ? 'none' : P} strokeWidth="1.2"
            opacity={hot.has(i) ? 1 : 0.32}
            className={hot.has(i) ? 'ic-pulse' : ''} style={hot.has(i) ? { animationDelay: `${(i%5)*0.4}s` } : null} />
        ))}
      </svg>
    );
  }
  if (variant === 'flow') {
    return (
      <svg {...common}>
        {[30, 70, 110, 150].map((y,i) => (
          <line key={i} x1="0" y1={y} x2="220" y2={y - 24} stroke={[O,M,P,C][i]} strokeWidth="2.4" className="ic-dash" style={{ animationDelay: `${i*0.4}s`, opacity: 0.8 }} />
        ))}
        <circle cx="40" cy="48" r="5" fill={O} className="ic-float" />
        <circle cx="150" cy="92" r="6" fill={M} className="ic-float" style={{ animationDelay: '1.2s' }} />
        <circle cx="190" cy="120" r="4" fill={C} className="ic-float" style={{ animationDelay: '0.6s' }} />
      </svg>
    );
  }
  if (variant === 'topo') {
    return (
      <svg {...common}>
        {[0,1,2,3].map(i => (
          <ellipse key={i} cx="110" cy="92" rx={30 + i*26} ry={20 + i*17} stroke={[O,M,P,P][i]} strokeWidth="1.6" opacity={0.8 - i*0.16} className="ic-float" style={{ animationDelay: `${i*0.5}s` }} />
        ))}
        <circle cx="110" cy="92" r="6" fill={M} />
        <circle cx="150" cy="60" r="4" fill={C} className="ic-pulse" />
      </svg>
    );
  }
  if (variant === 'shield') {
    return (
      <svg {...common}>
        <path d="M110 24 L168 46 V96 C168 134 140 154 110 164 C80 154 52 134 52 96 V46 Z" stroke={P} strokeWidth="2" opacity="0.5" className="ic-draw" style={{ '--len': 460 }} />
        <path d="M110 50 L146 64 V98 C146 122 130 136 110 142 C90 136 74 122 74 98 V64 Z" stroke={M} strokeWidth="2" opacity="0.85" />
        <path d="M92 96 l13 14 l24 -28" stroke={O} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ic-pulse" />
      </svg>
    );
  }
  // default fallback: nodes
  return <Motif variant="nodes" style={style} className={className} />;
}

/* ---- Animated gradient panel (large-scale brand surface) ------------------ */
function GradientPanel({ children, height = 220, motif, radius = 'var(--radius-sm)', style }) {
  return (
    <div className="ic-gradient-anim" style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, minHeight: height, ...style }}>
      {motif && (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'soft-light' }}>
          <Motif variant={motif} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 80% 10%, rgba(255,255,255,.22), transparent 55%)' }}></div>
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Reveal, CountUp, AutoCount, TypeOut, Motif, GradientPanel });
