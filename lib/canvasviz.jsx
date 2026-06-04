/* ============================================================================
   iCatalyst — canvas visual engine.
   Premium, bold, dynamic animated scenes built on the brand palette.
   Scenes:  flow · network · globe · accelerate
   Product aliases:  geo→globe · semantic→network · assistant→accelerate
   <Viz scene="flow" intensity="bold" /> — React wrapper, sizes to its parent.
   Pauses when offscreen; renders a calm static frame for prefers-reduced-motion.
   ============================================================================ */

function vizPalette() {
  const cs = getComputedStyle(document.documentElement);
  const hx = n => (cs.getPropertyValue(n) || '').trim();
  const toRgb = h => {
    h = (h || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h || '000000', 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  return {
    navy: toRgb(hx('--canvas-dark') || '#010120'),
    accent: toRgb(hx('--accent-orange') || '#b4384a'),
    royal: toRgb(hx('--accent-magenta') || '#2a52c9'),
    light: toRgb(hx('--accent-periwinkle') || '#c2d2f5'),
    pale: toRgb(hx('--accent-mint') || '#dde8fb'),
    white: [255, 255, 255],
    glow: [88, 132, 255],
  };
}
const vrgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const SCENE_ALIAS = { geo: 'globe', semantic: 'network', assistant: 'accelerate' };

// Real-world country outlines (world-atlas 110m topojson). Loaded once, shared.
let _countriesPromise = null;
function loadWorld() {
  if (_countriesPromise) return _countriesPromise;
  if (typeof topojson === 'undefined') return Promise.resolve(null);
  _countriesPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(topo => ({
      land: topojson.feature(topo, topo.objects.land),
      countries: topojson.feature(topo, topo.objects.countries),
      borders: topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b),
    }))
    .catch(() => null);
  return _countriesPromise;
}

class VizEngine {
  constructor(canvas, scene, intensity) {
    this.canvas = canvas;
    this.scene = SCENE_ALIAS[scene] || scene;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.pal = vizPalette();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    this.I = ({ bold: 1, medium: 0.72, subtle: 0.5 })[intensity] || 1;
    this.w = 0; this.h = 0; this.t = 0; this.last = 0; this.raf = 0;
    this.running = false; this.onscreen = true; this._fc = 0;
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._frame = this._frame.bind(this);
  }

  mount() {
    const parent = this.canvas.parentElement;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(parent);
    this.onVis = () => { if (document.hidden) this.stop(); else this.start(); };
    document.addEventListener('visibilitychange', this.onVis);
    this.resize();
  }
  unmount() { this.stop(); this.ro && this.ro.disconnect(); document.removeEventListener('visibilitychange', this.onVis); }

  resize() {
    const parent = this.canvas.parentElement;
    const w = parent.clientWidth, h = parent.clientHeight;
    if (!w || !h) return;
    this.w = w; this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.init();
    const prime = (this.scene === 'flow' || this.scene === 'accelerate') ? 80 : 4;
    this.clear(1);
    for (let i = 0; i < prime; i++) { this.step(0.016); this.draw(); }
    if (!this.reduce) this.start();
  }

  start() { if (this.running || this.reduce) return; this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame(this._frame); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  _frame(now) {
    if (!this.running) return;
    if ((this._fc++ % 20) === 0) {
      const r = this.canvas.getBoundingClientRect();
      this.onscreen = r.bottom > -40 && r.top < (window.innerHeight || 9999) + 40 && r.width > 0;
    }
    let dt = (now - this.last) / 1000; this.last = now;
    if (dt > 0.05) dt = 0.05;
    if (this.onscreen) { this.t += dt; this.step(dt); this.draw(); }
    this.raf = requestAnimationFrame(this._frame);
  }

  clear(alpha) { const c = this.ctx; c.fillStyle = vrgba(this.pal.navy, alpha); c.fillRect(0, 0, this.w, this.h); }
  rnd(a, b) { return a + Math.random() * (b - a); }

  /* ----- init per scene ----- */
  init() {
    const { w, h, I } = this;
    const area = w * h;
    if (this.scene === 'flow') {
      const n = Math.min(320, Math.round(area / 3400 * I) + 36);
      this.parts = Array.from({ length: n }, () => this._flowP());
      this.parts.forEach(p => { p.px = p.x; p.py = p.y; });
    } else if (this.scene === 'network') {
      const n = Math.min(58, Math.round(area / 17000 * I) + 11);
      const sp = 13 * I;
      this.nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: this.rnd(-sp, sp), vy: this.rnd(-sp, sp),
        r: this.rnd(1.5, 3), accent: Math.random() < 0.1, ph: Math.random() * 6.28,
      }));
      this.linkD = Math.min(w, h) * 0.26 + 50;
    } else if (this.scene === 'globe') {
      // Real-world major airport hubs — [code, lat°, lon°]
      const HUBS = [
        ['JFK', 40.6, -73.8], ['LAX', 33.9, -118.4], ['ORD', 42.0, -87.9],
        ['YYZ', 43.7, -79.6], ['MEX', 19.4, -99.1], ['GRU', -23.4, -46.5],
        ['LHR', 51.5, -0.5], ['CDG', 49.0, 2.5], ['FRA', 50.0, 8.6],
        ['AMS', 52.3, 4.8], ['IST', 41.0, 28.8], ['DXB', 25.3, 55.4],
        ['JNB', -26.1, 28.2], ['BOM', 19.1, 72.9], ['DEL', 28.6, 77.1],
        ['SIN', 1.4, 103.9], ['HKG', 22.3, 113.9], ['ICN', 37.5, 126.4],
        ['NRT', 35.8, 140.4], ['SYD', -33.9, 151.2],
      ];
      this.airports = HUBS.map(([name, lat, lon]) => ({ name, lat, lon }));
      this.planes = Array.from({ length: Math.max(3, Math.round(6 * I)) }, () => this._newPlane());
      this.rot = 0;
      this.world = null;
      loadWorld().then(w => { this.world = w; });
    } else if (this.scene === 'accelerate') {
      const n = Math.min(260, Math.round(area / 4600 * I) + 30);
      this.cy = h * 0.5;
      this.mid = w * 0.5;
      this.parts = Array.from({ length: n }, () => this._spawnAcc(true));
    }
  }
  _flowP() {
    // stable color per particle (no per-frame flicker): mostly cool, rare accent
    const r = Math.random();
    const col = r < 0.05 ? this.pal.accent : (r < 0.5 ? this.pal.light : this.pal.glow);
    return { x: Math.random() * this.w, y: Math.random() * this.h, px: 0, py: 0, life: this.rnd(0, 200), col, accent: r < 0.05 };
  }
  _newArc() { const a = (Math.random() * this.pts.length) | 0, b = (Math.random() * this.pts.length) | 0; return { a, b, p: Math.random(), spd: this.rnd(0.25, 0.6) }; }
  _newPlane() {
    const A = this.airports;
    const a = (Math.random() * A.length) | 0;
    let b = (Math.random() * A.length) | 0;
    while (b === a) b = (Math.random() * A.length) | 0;
    const interp = d3.geoInterpolate([A[a].lon, A[a].lat], [A[b].lon, A[b].lat]);
    return { a, b, p: 0, spd: this.rnd(0.14, 0.28), interp };
  }
  _spawnAcc(spread) {
    // streamline: enters left at random height, exits right as one ordered stream
    const w = this.w, h = this.h;
    const r = Math.random();
    const col = r < 0.06 ? this.pal.accent : this.pal.glow;
    const x = spread ? Math.random() * w : -this.rnd(4, 70);
    const y = this.rnd(h * 0.1, h * 0.9);
    return { x, y, px: x, py: y, vx: this.rnd(55, 100) * this.I, vy: 0, jit: this.rnd(0.7, 1.5), accent: r < 0.06, col };
  }

  /* ----- step per scene ----- */
  step(dt) {
    const { w, h, I } = this;
    if (this.scene === 'flow') {
      const t = this.t, sp = 78 * I;
      for (const p of this.parts) {
        p.px = p.x; p.py = p.y;
        const a = (Math.sin(p.x * 0.0016 + t * 0.18) + Math.cos(p.y * 0.0019 - t * 0.14) + Math.sin((p.x + p.y) * 0.0011 + t * 0.1)) * 1.45;
        p.x += Math.cos(a) * sp * dt; p.y += Math.sin(a) * sp * dt;
        p.life -= dt * 60;
        if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5 || p.life < 0) {
          p.x = Math.random() * w; p.y = Math.random() * h; p.px = p.x; p.py = p.y; p.life = this.rnd(60, 240);
        }
      }
    } else if (this.scene === 'network') {
      for (const nd of this.nodes) {
        nd.x += nd.vx * dt; nd.y += nd.vy * dt; nd.ph += dt * 2;
        if (nd.x < 0 || nd.x > w) nd.vx *= -1;
        if (nd.y < 0 || nd.y > h) nd.vy *= -1;
        nd.x = Math.max(0, Math.min(w, nd.x)); nd.y = Math.max(0, Math.min(h, nd.y));
      }
    } else if (this.scene === 'globe') {
      this.rot += dt * 0.18 * I;
      for (const pl of this.planes) {
        pl.p += dt * pl.spd;
        if (pl.p >= 1.05) Object.assign(pl, this._newPlane());
      }
    } else if (this.scene === 'accelerate') {
      const cy = this.cy, mid = this.mid;
      for (const p of this.parts) {
        p.px = p.x; p.py = p.y;
        if (p.x < mid) {
          // erratic inflow — jittery vertical wander, variable forward speed
          p.vy += (Math.random() - 0.5) * 1600 * p.jit * dt;
          p.vy *= 0.86;
          p.vx += (Math.random() - 0.5) * 700 * dt;
          p.vx = Math.max(40 * I, Math.min(175 * I, p.vx));
          if (p.y < 4) { p.y = 4; p.vy = Math.abs(p.vy); }
          else if (p.y > h - 4) { p.y = h - 4; p.vy = -Math.abs(p.vy); }
        } else {
          // streamline outflow — converge to the centre line, settle to one smooth speed
          p.vy += (cy - p.y) * 11 * dt;
          p.vy *= 0.80;
          p.vx += (155 * I - p.vx) * 4 * dt;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x > w + 14) Object.assign(p, this._spawnAcc(false));
      }
    }
  }

  /* ----- draw per scene ----- */
  draw() {
    const c = this.ctx, P = this.pal, { w, h } = this;
    if (this.scene === 'flow') {
      this.clear(0.12);
      c.lineCap = 'round';
      for (const p of this.parts) {
        c.strokeStyle = vrgba(p.col, p.accent ? 0.85 : 0.5);
        c.lineWidth = p.accent ? 1.4 : 1;
        c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); c.stroke();
      }
      this._glow(w * 0.5, h * 0.45, Math.min(w, h) * 0.55, P.royal, 0.07);
    } else if (this.scene === 'network') {
      this.clear(1);
      this._glow(w * 0.5, h * 0.5, Math.min(w, h) * 0.5, P.royal, 0.08);
      const N = this.nodes, D = this.linkD;
      for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
        const dx = N[i].x - N[j].x, dy = N[i].y - N[j].y, d = Math.hypot(dx, dy);
        if (d < D) {
          const a = (1 - d / D) * 0.3;
          c.strokeStyle = vrgba((N[i].accent || N[j].accent) ? P.accent : P.royal, a);
          c.lineWidth = 1; c.beginPath(); c.moveTo(N[i].x, N[i].y); c.lineTo(N[j].x, N[j].y); c.stroke();
        }
      }
      for (const nd of N) {
        const pulse = 0.6 + 0.4 * Math.sin(nd.ph);
        const col = nd.accent ? P.accent : P.light;
        c.fillStyle = vrgba(col, 0.9);
        c.beginPath(); c.arc(nd.x, nd.y, nd.r * (0.85 + 0.3 * pulse), 0, 6.2832); c.fill();
        c.fillStyle = vrgba(col, 0.1 * pulse);
        c.beginPath(); c.arc(nd.x, nd.y, nd.r * 2.4, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'globe') {
      this.clear(1);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42;
      const rotDeg = -(this.rot * 180 / Math.PI);

      // d3 orthographic projection — matches our rotation + a fixed 24° tilt
      const projection = d3.geoOrthographic()
        .scale(R)
        .translate([cx, cy])
        .rotate([rotDeg, -24, 0])
        .clipAngle(90);
      const path = d3.geoPath(projection, c);

      // Atmosphere halo
      this._glow(cx, cy, R * 1.62, P.royal, 0.16);

      // Ocean / sphere disk
      c.beginPath(); path({ type: 'Sphere' });
      c.fillStyle = vrgba(P.royal, 0.10);
      c.fill();

      // Graticule (lat/lon grid) — drawn under landmass so it shows in oceans
      c.beginPath(); path(d3.geoGraticule10());
      c.lineWidth = 0.6;
      c.strokeStyle = vrgba(P.royal, 0.28);
      c.stroke();

      // Real country landmasses
      if (this.world) {
        // Filled land
        c.beginPath(); path(this.world.land);
        c.fillStyle = vrgba(P.royal, 0.55);
        c.fill();
        c.lineWidth = 0.8;
        c.strokeStyle = vrgba(P.light, 0.55);
        c.stroke();
        // Country borders (lighter)
        c.beginPath(); path(this.world.borders);
        c.lineWidth = 0.5;
        c.strokeStyle = vrgba(P.light, 0.35);
        c.stroke();
      }

      // Limb (sphere edge highlight)
      c.beginPath(); path({ type: 'Sphere' });
      c.lineWidth = 1;
      c.strokeStyle = vrgba(P.light, 0.45);
      c.stroke();

      // Airport markers — only those on the visible hemisphere
      for (const ap of this.airports) {
        const xy = projection([ap.lon, ap.lat]);
        if (!xy) continue;
        c.fillStyle = vrgba(P.white, 0.18);
        c.beginPath(); c.arc(xy[0], xy[1], 4.5, 0, 6.2832); c.fill();
        c.fillStyle = vrgba(P.white, 0.95);
        c.beginPath(); c.arc(xy[0], xy[1], 1.9, 0, 6.2832); c.fill();
      }

      // Plane flights — d3.geoInterpolate gives the great-circle path
      c.lineCap = 'round';
      for (const pl of this.planes) {
        const tNow = Math.min(1, pl.p);
        const steps = 48;
        const endStep = Math.max(1, Math.floor(steps * tNow));

        // Trail — clipping at the horizon is handled by projection.clipAngle
        const coords = [];
        for (let k = 0; k <= endStep; k++) coords.push(pl.interp(k / steps));
        c.beginPath();
        path({ type: 'LineString', coordinates: coords });
        c.lineWidth = 1.4;
        c.strokeStyle = vrgba(P.accent, 0.7);
        c.stroke();

        // Plane head — sample two close points to derive heading
        const headLL = pl.interp(tNow);
        const backLL = pl.interp(Math.max(0, tNow - 0.014));
        const head = projection(headLL);
        const back = projection(backLL);
        if (head && back) {
          const ang = Math.atan2(head[1] - back[1], head[0] - back[0]);
          const sz = 3.6;
          c.save();
          c.translate(head[0], head[1]);
          c.rotate(ang);
          c.fillStyle = vrgba(P.white, 0.98);
          c.beginPath();
          c.moveTo(sz, 0);
          c.lineTo(-sz * 0.75, sz * 0.62);
          c.lineTo(-sz * 0.45, 0);
          c.lineTo(-sz * 0.75, -sz * 0.62);
          c.closePath();
          c.fill();
          c.restore();
        }
      }
    } else if (this.scene === 'accelerate') {
      this.clear(0.14);
      c.lineCap = 'round';
      const mid = this.mid;
      for (const p of this.parts) {
        const v = Math.hypot(p.vx, p.vy);
        const streamed = p.x >= mid;
        const col = p.accent ? P.accent : (streamed && v > 140 ? P.white : p.col);
        c.strokeStyle = vrgba(col, Math.min(0.9, 0.22 + v / 360));
        c.lineWidth = p.accent ? 1.6 : (streamed ? 1.2 : 1);
        c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); c.stroke();
      }
      const pulse = 0.7 + 0.3 * Math.sin(this.t * 3);
      this._glow(w, this.cy, 80 * pulse, P.glow, 0.3);
    }
  }

  _glow(x, y, r, col, a) {
    const c = this.ctx;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, vrgba(col, a));
    g.addColorStop(1, vrgba(col, 0));
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
  }
}

function Viz({ scene = 'flow', intensity = 'bold', style, className = '' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const eng = new VizEngine(cv, scene, intensity);
    eng.mount();
    return () => eng.unmount();
  }, [scene, intensity]);
  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <canvas ref={ref} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
    </div>
  );
}

Object.assign(window, { Viz, VizEngine });
