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
      const n = Math.min(680, Math.round(8 + area / 760 * I));
      this.pts = [];
      const gold = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = gold * i;
        this.pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, accent: Math.random() < 0.05 });
      }
      this.arcs = Array.from({ length: Math.round(3 * I) + 2 }, () => this._newArc());
      this.rot = 0;
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
      this.rot += dt * 0.32 * I;
      for (const ar of this.arcs) { ar.p += dt * ar.spd; if (ar.p > 1.6) Object.assign(ar, this._newArc()); }
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
      const cosT = Math.cos(0.42), sinT = Math.sin(0.42);
      const proj = (p) => {
        const cr = Math.cos(this.rot), sr = Math.sin(this.rot);
        let X = p.x * cr - p.z * sr, Z = p.x * sr + p.z * cr, Y = p.y;
        const y2 = Y * cosT - Z * sinT, z2 = Y * sinT + Z * cosT;
        return { sx: cx + X * R, sy: cy + y2 * R, z: z2 };
      };
      this._glow(cx, cy, R * 1.5, P.royal, 0.12);
      for (const p of this.pts) {
        const s = proj(p), depth = (s.z + 1) / 2;
        const col = p.accent ? P.accent : (depth > 0.6 ? P.white : P.royal);
        c.fillStyle = vrgba(col, 0.15 + depth * 0.8);
        const r = 0.6 + depth * 2;
        c.beginPath(); c.arc(s.sx, s.sy, r, 0, 6.2832); c.fill();
      }
      for (const ar of this.arcs) {
        const A = this.pts[ar.a], B = this.pts[ar.b];
        const tt = Math.max(0, Math.min(1, ar.p));
        c.lineWidth = 1.4; c.strokeStyle = vrgba(P.accent, 0.55 * (1 - Math.abs(tt - 0.5) * 1.2));
        c.beginPath();
        const steps = 18;
        for (let k = 0; k <= steps * tt; k++) {
          const f = k / steps;
          let x = A.x + (B.x - A.x) * f, y = A.y + (B.y - A.y) * f, z = A.z + (B.z - A.z) * f;
          const m = Math.hypot(x, y, z) || 1; const lift = 1 + 0.22 * Math.sin(f * Math.PI);
          x = x / m * lift; y = y / m * lift; z = z / m * lift;
          const s = proj({ x, y, z });
          if (k === 0) c.moveTo(s.sx, s.sy); else c.lineTo(s.sx, s.sy);
        }
        c.stroke();
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
