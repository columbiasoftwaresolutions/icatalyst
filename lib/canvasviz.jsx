/* ============================================================================
   iCatalyst — canvas visual engine.
   Premium, bold, dynamic animated scenes built on the brand palette.
   Scenes:  flow · network · globe · accelerate · morph ·
            ai-net · cloud-tiers · data-grid · it-modules · program-timeline ·
            products-morph · geo-morph · semantic-morph · assistant-morph ·
            contracts-morph · careers-morph
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
        // North America
        ['JFK', 40.6, -73.8], ['LAX', 33.9, -118.4], ['ORD', 42.0, -87.9],
        ['ATL', 33.6, -84.4], ['DFW', 32.9, -97.0], ['SFO', 37.6, -122.4],
        ['SEA', 47.4, -122.3], ['MIA', 25.8, -80.3], ['YYZ', 43.7, -79.6],
        ['MEX', 19.4, -99.1],
        // South America
        ['GRU', -23.4, -46.5], ['EZE', -34.8, -58.5], ['BOG', 4.7, -74.1],
        ['LIM', -12.0, -77.1],
        // Europe
        ['LHR', 51.5, -0.5], ['CDG', 49.0, 2.5], ['FRA', 50.0, 8.6],
        ['AMS', 52.3, 4.8], ['MAD', 40.5, -3.6], ['FCO', 41.8, 12.3],
        ['MUC', 48.4, 11.8], ['ZRH', 47.5, 8.5], ['IST', 41.0, 28.8],
        ['SVO', 55.9, 37.4],
        // Middle East / Africa
        ['DXB', 25.3, 55.4], ['DOH', 25.3, 51.6], ['CAI', 30.1, 31.4],
        ['TLV', 32.0, 34.9], ['JNB', -26.1, 28.2], ['CPT', -33.9, 18.6],
        ['NBO', -1.3, 36.9], ['LOS', 6.6, 3.3],
        // Asia
        ['BOM', 19.1, 72.9], ['DEL', 28.6, 77.1], ['BLR', 13.2, 77.7],
        ['BKK', 13.7, 100.8], ['KUL', 2.7, 101.7], ['SIN', 1.4, 103.9],
        ['CGK', -6.1, 106.7], ['MNL', 14.5, 121.0], ['HKG', 22.3, 113.9],
        ['ICN', 37.5, 126.4], ['NRT', 35.8, 140.4], ['PEK', 40.1, 116.6],
        ['PVG', 31.1, 121.8],
        // Oceania
        ['SYD', -33.9, 151.2], ['MEL', -37.7, 144.8], ['AKL', -37.0, 174.8],
      ];
      this.airports = HUBS.map(([name, lat, lon]) => ({ name, lat, lon }));
      this.planes = Array.from({ length: Math.max(28, Math.round(54 * I)) }, () => this._newPlane());
      this.rot = 0;
      this.world = null;
      loadWorld().then(w => { this.world = w; });
    } else if (this.scene === 'accelerate') {
      const n = Math.min(260, Math.round(area / 4600 * I) + 30);
      this.cy = h * 0.5;
      this.mid = w * 0.5;
      this.parts = Array.from({ length: n }, () => this._spawnAcc(true));
    } else if (this.scene === 'morph') {
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.52;
      const N = Math.min(220, Math.max(130, Math.round(190 * I)));

      // shape 1 — "AI network": an organic node cloud, roughly ball-shaped but jittered
      // so it doesn't read as a perfect geodesic lattice, wired by nearest-neighbour
      // links into a loose web — the JARVIS/neural-net look.
      const golden = Math.PI * (3 - Math.sqrt(5));
      const orb3 = [];
      for (let i = 0; i < N; i++) {
        const yv = N === 1 ? 0 : 1 - (i / (N - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - yv * yv));
        const theta = golden * i + this.rnd(-0.18, 0.18);
        const jitterR = 1 + this.rnd(-0.24, 0.24);
        const jy = Math.max(-1.1, Math.min(1.1, yv + this.rnd(-0.14, 0.14)));
        orb3.push({ x: Math.cos(theta) * rad * jitterR, y: jy, z: Math.sin(theta) * rad * jitterR });
      }
      const network = orb3.map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));
      const networkZ = orb3.map(p => p.z);
      const edges = this._knnEdges(orb3, 3);

      // shape 2 — "cloud": classic puffy-cloud silhouette (base + overlapping bumps),
      // sampled with points biased toward the outline so the silhouette actually reads
      const cloudCircles = [[0.02, -0.10, 0.46], [-0.48, 0.06, 0.32], [0.42, 0.00, 0.36], [0.72, 0.14, 0.22]];
      const inCloud = (x, y) => {
        if (x > -0.78 && x < 0.78 && y > 0.08 && y < 0.34) return true;
        return cloudCircles.some(([ccx, ccy, cr]) => {
          const dx = x - ccx, dy = y - ccy; return dx * dx + dy * dy < cr * cr;
        });
      };
      const cloud = this._silhouettePts(N, -0.85, 0.98, -0.60, 0.42, inCloud, 0.72)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // shape 3 — "data": ascending bar-chart — dots laid out on a rigid even grid per
      // bar (not randomly scattered) so it reads as a clean, structured chart.
      const barsDef = [0.22, 0.42, 0.34, 0.62, 0.86];
      const wBar = 0.24, gap = 0.10, y0 = 0.34;
      const totalW = barsDef.length * wBar + (barsDef.length - 1) * gap;
      const startX = -totalW / 2;
      const areaSum = barsDef.reduce((a, hh) => a + wBar * hh, 0);
      const spacing = Math.sqrt(areaSum / N);
      const data = [];
      barsDef.forEach((hh, bi) => {
        const bx = startX + bi * (wBar + gap);
        const cols = Math.max(2, Math.round(wBar / spacing));
        const rows = Math.max(2, Math.round(hh / spacing));
        for (let r = 0; r < rows; r++) {
          for (let cIdx = 0; cIdx < cols; cIdx++) {
            data.push({
              x: bx + (cIdx + 0.5) * (wBar / cols),
              y: y0 - (r + 0.5) * (hh / rows),
            });
          }
        }
      });
      while (data.length < N) {
        const src = data[(Math.random() * data.length) | 0];
        data.push({ x: src.x + this.rnd(-0.01, 0.01), y: src.y + this.rnd(-0.01, 0.01) });
      }
      while (data.length > N) data.splice((Math.random() * data.length) | 0, 1);
      const dataScaled = data.map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      this.shapes = { network, cloud, data: dataScaled };
      this.edges = edges;
      this.networkZ = networkZ;
      this.parts = network.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.morphTimeline = [
        { type: 'hold', shape: 'network', dur: 2.6, net: 1, axis: 0 },
        { type: 'morph', from: 'network', to: 'cloud', dur: 1.7, net: [1, 0], axis: [0, 0] },
        { type: 'hold', shape: 'cloud', dur: 2.6, net: 0, axis: 0 },
        { type: 'morph', from: 'cloud', to: 'data', dur: 1.7, net: [0, 0], axis: [0, 1] },
        { type: 'hold', shape: 'data', dur: 2.6, net: 0, axis: 1 },
        { type: 'morph', from: 'data', to: 'network', dur: 1.7, net: [0, 1], axis: [1, 0] },
      ];
      this.mPhase = 0; this.mPhaseT = 0; this.mScatter = null;
    } else if (this.scene === 'ai-net') {
      // AI-Driven Transformation — a layered neural net (input → hidden → output columns),
      // fully static, with waves of light sweeping left-to-right as it "processes".
      const cx = w / 2, cy = h / 2;
      const spanX = w * 0.43, spanY = h * 0.41;
      const layerCounts = [4, 6, 7, 6, 3];
      const layerIdx = [];
      const nodes = [];
      layerCounts.forEach((cnt, li) => {
        const start = nodes.length;
        const x = cx - spanX + (spanX * 2) * (li / (layerCounts.length - 1));
        for (let k = 0; k < cnt; k++) {
          nodes.push({ x, y: cy - spanY + (spanY * 2) * ((k + 0.5) / cnt), layer: li, ph: Math.random() * 6.28 });
        }
        layerIdx.push([start, start + cnt]);
      });
      const edges = [];
      for (let li = 0; li < layerCounts.length - 1; li++) {
        const [as, ae] = layerIdx[li], [bs, be] = layerIdx[li + 1];
        for (let i = as; i < ae; i++) {
          const kk = Math.min(be - bs, 2 + ((Math.random() * 2) | 0));
          const chosen = new Set();
          while (chosen.size < kk) chosen.add(bs + ((Math.random() * (be - bs)) | 0));
          chosen.forEach(j => edges.push([i, j]));
        }
      }
      this.aiNodes = nodes;
      this.aiEdges = edges;
      this.aiX0 = cx - spanX; this.aiX1 = cx + spanX;
      this.aiWaves = [0, 0.5];
    } else if (this.scene === 'cloud-tiers') {
      // Cloud & Infrastructure Modernization — a physical on-prem "server rack" of dots
      // (distinct horizontal blade/unit rows, a visible gap between each, plus a couple of
      // small accent "status LED" dots per row) periodically dissolves into a literal cloud
      // silhouette, then reassembles — modernization as an ongoing, repeating motion.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.52;
      const N = Math.min(210, Math.max(130, Math.round(180 * I)));

      // shape 1 — "rack": stacked horizontal blade rows with a visible gap between each,
      // plus a couple of small accent status-LED dots near the right edge of every row
      const rackRows = 6, ledPerRow = 2;
      const rowGap = 0.045, rowH = 0.62 / rackRows;
      const totalH = rackRows * rowH + (rackRows - 1) * rowGap;
      const rackW = 0.58;
      const rackX0 = -rackW / 2, rackY0 = -totalH / 2;
      const ledCount = rackRows * ledPerRow;
      const bodyN = N - ledCount;
      const perRow = Math.floor(bodyN / rackRows);
      const rack = [];
      const rowRanges = [];
      const ledIdx = new Set();
      let bodyPlaced = 0;
      for (let ri = 0; ri < rackRows; ri++) {
        const count = ri === rackRows - 1 ? bodyN - bodyPlaced : perRow;
        const cols = Math.max(5, Math.round(Math.sqrt(count * rackW / rowH)));
        const rows2 = Math.max(1, Math.ceil(count / cols));
        const yTop = rackY0 + ri * (rowH + rowGap);
        const rowStart = rack.length;
        let placed = 0;
        for (let rr = 0; rr < rows2 && placed < count; rr++) {
          for (let cIdx = 0; cIdx < cols && placed < count; cIdx++) {
            rack.push({ x: rackX0 + (cIdx + 0.5) / cols * rackW, y: yTop + (rr + 0.5) / rows2 * rowH });
            placed++;
          }
        }
        bodyPlaced += count;
        rowRanges.push([rowStart, rowStart + count]);
        const ledY = yTop + rowH / 2;
        ledIdx.add(rack.length); rack.push({ x: rackX0 + rackW - 0.05, y: ledY - rowH * 0.16 });
        ledIdx.add(rack.length); rack.push({ x: rackX0 + rackW - 0.05, y: ledY + rowH * 0.16 });
      }
      while (rack.length < N) rack.push({ x: 0, y: 0 });
      while (rack.length > N) rack.splice((Math.random() * rack.length) | 0, 1);

      // shape 2 — "cloud": classic puffy-cloud silhouette (base + overlapping bumps),
      // sampled with points biased toward the outline — identical construction to the
      // Solutions-hero cloud (reused verbatim, on purpose, so both scenes agree visually)
      const cloudCircles = [[0.02, -0.10, 0.46], [-0.48, 0.06, 0.32], [0.42, 0.00, 0.36], [0.72, 0.14, 0.22]];
      const inCloud = (x, y) => {
        if (x > -0.78 && x < 0.78 && y > 0.08 && y < 0.34) return true;
        return cloudCircles.some(([ccx, ccy, cr]) => {
          const dx = x - ccx, dy = y - ccy; return dx * dx + dy * dy < cr * cr;
        });
      };
      const cloud = this._silhouettePts(N, -0.85, 0.98, -0.60, 0.42, inCloud, 0.72);

      this.ctShapes = {
        rack: rack.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
        cloud: cloud.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
      };
      const rowEdges = [];
      for (const [as, ae] of rowRanges) if (ae - as >= 2) rowEdges.push([as, ae - 1]);
      this.ctEdges = rowEdges;
      this.ctLedIdx = ledIdx;
      this.parts = this.ctShapes.rack.map(p => ({ x: p.x, y: p.y, ph: Math.random() * 6.28 }));
      this.ctPhase = 0; this.ctPhaseT = 0; this.ctScatter = null;
      this.ctTimeline = [
        { type: 'hold', shape: 'rack', dur: 2.4 },
        { type: 'morph', from: 'rack', to: 'cloud', dur: 1.6 },
        { type: 'hold', shape: 'cloud', dur: 2.8 },
        { type: 'morph', from: 'cloud', to: 'rack', dur: 1.6 },
      ];
    } else if (this.scene === 'data-grid') {
      // Data Engineering & Analytics — a chaotic scatter of raw data points periodically
      // resolves into a noisy but clearly ascending trend line (growth-chart look), with
      // a thin baseline underneath and a sparser scatter of "area fill" dots beneath the
      // curve, then releases back to raw scatter.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.54;
      const N = Math.min(190, Math.max(110, Math.round(165 * I)));

      const scatter = Array.from({ length: N }, () => ({ x: this.rnd(-0.85, 0.85), y: this.rnd(-0.6, 0.6) }));

      // build a noisy-but-monotonic ascending curve (canvas y grows downward, so "up" is
      // more negative y) from key control samples, then interpolate it continuously
      const baseline = 0.50, topY = -0.50;
      const x0c = -0.80, x1c = 0.80;
      const steps = 40;
      const key = [];
      let prevY = baseline - 0.03;
      for (let i = 0; i <= steps; i++) {
        const xf = i / steps;
        const trend = Math.pow(xf, 0.85);
        const noise = (Math.sin(xf * 13.7 + 7) * 0.5 + Math.sin(xf * 29 + 2) * 0.5) * 0.05;
        let y = baseline - trend * (baseline - topY) * 0.92 + noise;
        y = prevY * 0.35 + y * 0.65; // keeps it loosely monotonic despite the noise
        prevY = y;
        key.push(y);
      }
      const curveY = (xf) => {
        const idx = Math.max(0, Math.min(steps, xf * steps));
        const i0 = Math.floor(idx), i1 = Math.min(steps, i0 + 1), t = idx - i0;
        return key[i0] + (key[i1] - key[i0]) * t;
      };

      // most points trace the curve itself (small perpendicular jitter for line "thickness"),
      // the rest sit sparsely between the curve and the baseline as an "area fill"
      const curveN = Math.round(N * 0.68);
      const fillN = N - curveN;
      const line = [];
      for (let i = 0; i < curveN; i++) {
        const xf = curveN === 1 ? 0 : Math.min(1, Math.max(0, i / (curveN - 1) + this.rnd(-0.01, 0.01)));
        line.push({ x: x0c + xf * (x1c - x0c), y: curveY(xf) + this.rnd(-0.014, 0.014) });
      }
      for (let i = 0; i < fillN; i++) {
        const xf = Math.random();
        const cy2 = curveY(xf);
        line.push({ x: x0c + xf * (x1c - x0c), y: cy2 + Math.random() * (baseline - cy2) * 0.92 });
      }
      this.dgCurveCount = curveN;

      this.dgShapes = {
        scatter: scatter.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
        line: line.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
      };
      this.dgAxisX0 = cx + x0c * R; this.dgAxisX1 = cx + x1c * R; this.dgAxisY = cy + baseline * R;
      this.dgTipX = cx + x1c * R; this.dgTipY = cy + curveY(1) * R;
      this.parts = this.dgShapes.scatter.map(p => ({ x: p.x, y: p.y, ph: Math.random() * 6.28 }));
      this.dgPhase = 0; this.dgPhaseT = 0;
      this.dgTimeline = [
        { type: 'hold', shape: 'scatter', dur: 2.2 },
        { type: 'morph', from: 'scatter', to: 'line', dur: 1.5 },
        { type: 'hold', shape: 'line', dur: 3.0 },
        { type: 'morph', from: 'line', to: 'scatter', dur: 1.5 },
      ];
    } else if (this.scene === 'it-modules') {
      // Enterprise IT Modernization — a rigid, perfectly uniform legacy grid periodically
      // dissolves into small independent, gently drifting module "pods" wired by a light
      // mesh — legacy rigidity vs. flexible modular architecture.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.55;
      const N = Math.min(185, Math.max(110, Math.round(155 * I)));

      const cols = Math.round(Math.sqrt(N * 1.3));
      const rows = Math.ceil(N / cols);
      const grid = [];
      for (let r = 0; r < rows; r++) for (let cI = 0; cI < cols; cI++) {
        if (grid.length >= N) break;
        grid.push({ x: -0.8 + (cI + 0.5) / cols * 1.6, y: -0.55 + (r + 0.5) / rows * 1.1 });
      }
      while (grid.length < N) grid.push({ x: 0, y: 0 });

      const podCenters = [[-0.5, -0.35], [0.05, -0.4], [0.55, -0.25], [-0.55, 0.3], [0, 0.4], [0.55, 0.32]];
      const per = Math.floor(N / podCenters.length);
      const pods = [];
      const podRanges = [];
      podCenters.forEach(([px, py], pi) => {
        const start = pods.length;
        const count = pi === podCenters.length - 1 ? N - pods.length : per;
        for (let k = 0; k < count; k++) {
          const ang = this.rnd(0, 6.2832), rad = Math.sqrt(Math.random()) * 0.16;
          pods.push({ x: px + Math.cos(ang) * rad, y: py + Math.sin(ang) * rad });
        }
        podRanges.push([start, start + count]);
      });

      this.itShapes = {
        grid: grid.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
        pods: pods.map(p => ({ x: cx + p.x * R, y: cy + p.y * R })),
      };
      const edges = [];
      podRanges.forEach(([s, e]) => {
        for (let i = s; i < e; i++) {
          const dists = [];
          for (let j = s; j < e; j++) if (i !== j) {
            const dx = pods[i].x - pods[j].x, dy = pods[i].y - pods[j].y;
            dists.push([j, dx * dx + dy * dy]);
          }
          dists.sort((a, b) => a[1] - b[1]);
          for (let k = 0; k < Math.min(2, dists.length); k++) edges.push([i, dists[k][0]]);
        }
      });
      for (let pi = 0; pi < podRanges.length - 1; pi++) {
        const [as, ae] = podRanges[pi], [bs, be] = podRanges[pi + 1];
        edges.push([as + ((Math.random() * (ae - as)) | 0), bs + ((Math.random() * (be - bs)) | 0)]);
      }
      this.itEdges = edges;
      this.parts = this.itShapes.grid.map(p => ({ x: p.x, y: p.y, ph: Math.random() * 6.28 }));
      this.itPhase = 0; this.itPhaseT = 0; this.itScatter = null;
      this.itTimeline = [
        { type: 'hold', shape: 'grid', dur: 2.6 },
        { type: 'morph', from: 'grid', to: 'pods', dur: 1.6 },
        { type: 'hold', shape: 'pods', dur: 3.0 },
        { type: 'morph', from: 'pods', to: 'grid', dur: 1.6 },
      ];
    } else if (this.scene === 'program-timeline') {
      // Program & Change Management — scattered task dots settle onto a milestone roadmap
      // as a traveling pulse sweeps left-to-right, then release back to scatter and repeat.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.55;
      const N = Math.min(165, Math.max(95, Math.round(135 * I)));
      const x0 = cx - R * 0.85, x1 = cx + R * 0.85;
      const milestoneCount = 7;
      const milestoneIdx = new Set(Array.from({ length: milestoneCount }, (_, k) => Math.round(k * (N - 1) / (milestoneCount - 1))));

      this.ptLine = []; this.ptScatter = []; this.parts = [];
      for (let i = 0; i < N; i++) {
        const lineFrac = i / (N - 1);
        const lx = x0 + lineFrac * (x1 - x0);
        this.ptLine.push({ x: lx, y: cy });
        const sy = cy + this.rnd(-1, 1) * R * 0.42 * (0.3 + Math.random());
        const sx = lx + this.rnd(-14, 14);
        this.ptScatter.push({ x: sx, y: sy });
        this.parts.push({ x: sx, y: sy, lineFrac, milestone: milestoneIdx.has(i), ph: Math.random() * 6.28 });
      }
      this.ptX0 = x0; this.ptX1 = x1;
      this.ptCycle = 7.0; this.ptT = 0; this.ptWaveFrac = -1;
    } else if (this.scene === 'products-morph') {
      // Products Overview — dots assemble into a compass/radar (geospatial), break apart and
      // reassemble into a document (semantic), then into a chat bubble (assistant), looping —
      // each hold phase gets its own flourish (radar sweep / read-scan / thinking glow).
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.58;
      const N = Math.min(215, Math.max(125, Math.round(180 * I)));

      // shape 1 — geospatial: a compass/radar ring + crosshair
      const outerR = 0.55, innerR = 0.44, armW = 0.045, armLen = 0.6;
      const inGeo = (x, y) => {
        const d = Math.hypot(x, y);
        if (d <= outerR && d >= innerR) return true;
        if (Math.abs(x) < armW && Math.abs(y) < armLen) return true;
        if (Math.abs(y) < armW && Math.abs(x) < armLen) return true;
        return false;
      };
      const geo = this._silhouettePts(N, -0.65, 0.65, -0.65, 0.65, inGeo, 0.55)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // shape 2 — semantic: a document with ruled text-line gaps
      const docLines = [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45];
      const inDoc = (x, y) => {
        if (x < -0.5 || x > 0.5 || y < -0.65 || y > 0.65) return false;
        for (const ly of docLines) if (Math.abs(y - ly) < 0.035) return false;
        return true;
      };
      const doc = this._silhouettePts(N, -0.55, 0.55, -0.7, 0.7, inDoc, 0.5)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // shape 3 — assistant: a rounded chat bubble with a tail
      const inTri = (px, py, ax, ay, bx, by, cx2, cy2) => {
        const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
        const d2 = (px - cx2) * (by - cy2) - (bx - cx2) * (py - cy2);
        const d3 = (px - ax) * (cy2 - ay) - (cx2 - ax) * (py - ay);
        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0, hasPos = d1 > 0 || d2 > 0 || d3 > 0;
        return !(hasNeg && hasPos);
      };
      const bodyHalfW = 0.42, bodyHalfH = 0.30, bodyR = 0.16, bodyCy = -0.05;
      const inChat = (x, y) => {
        const dx = Math.max(Math.abs(x) - (bodyHalfW - bodyR), 0);
        const dy = Math.max(Math.abs(y - bodyCy) - (bodyHalfH - bodyR), 0);
        if (dx * dx + dy * dy <= bodyR * bodyR) return true;
        return inTri(x, y, -0.30, 0.20, -0.08, 0.23, -0.22, 0.48);
      };
      const chat = this._silhouettePts(N, -0.5, 0.5, -0.4, 0.55, inChat, 0.55)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      this.pmShapes = { geo, doc, chat };
      this.parts = geo.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.pmTimeline = [
        { type: 'hold', shape: 'geo', dur: 2.6, geo: 1, doc: 0, chat: 0 },
        { type: 'morph', from: 'geo', to: 'doc', dur: 1.7, geo: [1, 0], doc: [0, 1], chat: [0, 0] },
        { type: 'hold', shape: 'doc', dur: 2.6, geo: 0, doc: 1, chat: 0 },
        { type: 'morph', from: 'doc', to: 'chat', dur: 1.7, geo: [0, 0], doc: [1, 0], chat: [0, 1] },
        { type: 'hold', shape: 'chat', dur: 2.6, geo: 0, doc: 0, chat: 1 },
        { type: 'morph', from: 'chat', to: 'geo', dur: 1.7, geo: [0, 1], doc: [0, 0], chat: [1, 0] },
      ];
      this.pmPhase = 0; this.pmPhaseT = 0; this.pmScatter = null;
    } else if (this.scene === 'geo-morph') {
      // Geospatial Engine — a chaotic scatter of raw location-pin dots resolves into an
      // organized compass/radar (ring + crosshair) with a rotating sweep during its hold,
      // then releases back to scatter — raw geospatial data becoming actionable intelligence.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      const N = Math.min(200, Math.max(120, Math.round(175 * I)));

      const scatter = Array.from({ length: N }, () => ({
        x: cx + this.rnd(-0.9, 0.9) * R,
        y: cy + this.rnd(-0.65, 0.65) * R,
      }));

      const outerR = 0.56, innerR = 0.45, armW = 0.045, armLen = 0.62;
      const inCompass = (x, y) => {
        const d = Math.hypot(x, y);
        if (d <= outerR && d >= innerR) return true;
        if (Math.abs(x) < armW && Math.abs(y) < armLen) return true;
        if (Math.abs(y) < armW && Math.abs(x) < armLen) return true;
        return false;
      };
      const compass = this._silhouettePts(N, -0.66, 0.66, -0.66, 0.66, inCompass, 0.55)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      this.gmShapes = { scatter, compass };
      this.parts = scatter.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.gmTimeline = [
        { type: 'hold', shape: 'scatter', dur: 2.4 },
        { type: 'morph', from: 'scatter', to: 'compass', dur: 1.6 },
        { type: 'hold', shape: 'compass', dur: 3.0 },
        { type: 'morph', from: 'compass', to: 'scatter', dur: 1.6 },
      ];
      this.gmPhase = 0; this.gmPhaseT = 0;
    } else if (this.scene === 'semantic-morph') {
      // Semantic Intelligence Platform — several scattered, independently-rotated document
      // rectangles (a messy stack of unstructured sources) break apart and reassemble into
      // ONE connected knowledge-graph (a node-and-edge web) — distinct from products-morph's
      // single ruled document: this is about MANY sources converging into ONE graph.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      const N = Math.min(210, Math.max(130, Math.round(185 * I)));

      const docRects = [
        { cx: -0.56, cy: -0.32, w: 0.46, h: 0.62, rot: -0.20 },
        { cx: 0.20, cy: -0.42, w: 0.38, h: 0.52, rot: 0.16 },
        { cx: 0.58, cy: 0.10, w: 0.42, h: 0.56, rot: -0.10 },
        { cx: -0.14, cy: 0.42, w: 0.36, h: 0.48, rot: 0.22 },
      ];
      const inDocs = (x, y) => docRects.some(r => {
        const dx = x - r.cx, dy = y - r.cy;
        const cos = Math.cos(r.rot), sin = Math.sin(r.rot);
        const lx = dx * cos + dy * sin, ly = -dx * sin + dy * cos;
        return Math.abs(lx) < r.w / 2 && Math.abs(ly) < r.h / 2;
      });
      const docs = this._silhouettePts(N, -1, 1, -0.85, 0.85, inDocs, 0.6)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      const nodeCenters = [
        [0, 0], [-0.5, -0.28], [0.48, -0.24], [-0.55, 0.30], [0.55, 0.30],
        [0, -0.55], [0, 0.55], [-0.22, 0.05], [0.24, 0.02],
      ];
      const per = Math.floor(N / nodeCenters.length);
      const graphPts = [];
      nodeCenters.forEach(([nx, ny], ni) => {
        const count = ni === nodeCenters.length - 1 ? N - graphPts.length : per;
        for (let k = 0; k < count; k++) {
          const ang = this.rnd(0, 6.2832), rad = Math.sqrt(Math.random()) * (ni === 0 ? 0.135 : 0.095);
          graphPts.push({ x: cx + (nx + Math.cos(ang) * rad) * R, y: cy + (ny + Math.sin(ang) * rad) * R });
        }
      });
      const nodeCentersScaled = nodeCenters.map(([nx, ny]) => ({ x: cx + nx * R, y: cy + ny * R }));
      const graphEdges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 5], [2, 5], [3, 6], [4, 6], [1, 3], [2, 4], [7, 8]];

      this.smShapes = { docs, graph: graphPts };
      this.smNodeCenters = nodeCentersScaled;
      this.smEdges = graphEdges;
      this.parts = docs.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.smTimeline = [
        { type: 'hold', shape: 'docs', dur: 2.4 },
        { type: 'morph', from: 'docs', to: 'graph', dur: 1.7 },
        { type: 'hold', shape: 'graph', dur: 3.0 },
        { type: 'morph', from: 'graph', to: 'docs', dur: 1.7 },
      ];
      this.smPhase = 0; this.smPhaseT = 0; this.smScatter = null;
    } else if (this.scene === 'assistant-morph') {
      // AI Assistant — several small scattered chat-bubble/message fragments (disparate
      // documents, conversations, data sources) converge into ONE larger, unified chat
      // bubble — many sources combine into one grounded answer.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      const N = Math.min(200, Math.max(120, Math.round(175 * I)));

      const bubbleFn = (x, y, bcx, bcy, hw, hh, r) => {
        const dx = Math.max(Math.abs(x - bcx) - (hw - r), 0);
        const dy = Math.max(Math.abs(y - bcy) - (hh - r), 0);
        return dx * dx + dy * dy <= r * r;
      };
      const fragDefs = [
        { cx: -0.55, cy: -0.35, hw: 0.22, hh: 0.14, r: 0.07 },
        { cx: 0.15, cy: -0.48, hw: 0.18, hh: 0.12, r: 0.06 },
        { cx: 0.55, cy: -0.08, hw: 0.20, hh: 0.13, r: 0.065 },
        { cx: -0.20, cy: 0.32, hw: 0.19, hh: 0.12, r: 0.06 },
        { cx: 0.42, cy: 0.44, hw: 0.17, hh: 0.11, r: 0.055 },
      ];
      const inFrag = (x, y) => fragDefs.some(f => bubbleFn(x, y, f.cx, f.cy, f.hw, f.hh, f.r));
      const frags = this._silhouettePts(N, -0.82, 0.82, -0.66, 0.6, inFrag, 0.6)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      const inTriA = (px, py, ax, ay, bx, by, cx2, cy2) => {
        const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
        const d2 = (px - cx2) * (by - cy2) - (bx - cx2) * (py - cy2);
        const d3 = (px - ax) * (cy2 - ay) - (cx2 - ax) * (py - ay);
        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0, hasPos = d1 > 0 || d2 > 0 || d3 > 0;
        return !(hasNeg && hasPos);
      };
      const bodyHalfW = 0.48, bodyHalfH = 0.34, bodyR = 0.18, bodyCy = -0.04;
      const inBubble = (x, y) => {
        if (bubbleFn(x, y, 0, bodyCy, bodyHalfW, bodyHalfH, bodyR)) return true;
        return inTriA(x, y, -0.32, 0.22, -0.08, 0.25, -0.24, 0.52);
      };
      const bubble = this._silhouettePts(N, -0.55, 0.55, -0.45, 0.6, inBubble, 0.55)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      this.amShapes = { frags, bubble };
      this.parts = frags.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.amTimeline = [
        { type: 'hold', shape: 'frags', dur: 2.4 },
        { type: 'morph', from: 'frags', to: 'bubble', dur: 1.6 },
        { type: 'hold', shape: 'bubble', dur: 3.0 },
        { type: 'morph', from: 'bubble', to: 'frags', dur: 1.6 },
      ];
      this.amPhase = 0; this.amPhaseT = 0;
    } else if (this.scene === 'contracts-morph') {
      // Contracts page — a 3-state loop: a gateway/keyhole (streamlined federal access)
      // morphs into a checkmark seal (trusted, certified — ties to ISO/CMMI certs elsewhere
      // on the site), morphs into a hub-and-spokes web (one central node, several satellite
      // customer/partner nodes), then loops back to the gateway.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      const N = Math.min(210, Math.max(130, Math.round(185 * I)));

      // shape 1 — gateway: a classic keyhole silhouette (circle + tapered body)
      const khCx = 0, khCy = -0.20, khR = 0.22;
      const khTopW = 0.16, khBotW = 0.36, khBodyTop = -0.03, khBodyBot = 0.56;
      const inGate = (x, y) => {
        const dx = x - khCx, dy = y - khCy;
        if (dx * dx + dy * dy <= khR * khR) return true;
        if (y >= khBodyTop && y <= khBodyBot) {
          const tt = (y - khBodyTop) / (khBodyBot - khBodyTop);
          const halfW = (khTopW + (khBotW - khTopW) * tt) / 2;
          if (Math.abs(x) <= halfW) return true;
        }
        return false;
      };
      const gate = this._silhouettePts(N, -0.22, 0.22, -0.45, 0.6, inGate, 0.55)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // shape 2 — seal: a ring with a checkmark stroke inside (certified/trusted)
      const segDist = (px, py, ax, ay, bx, by) => {
        const abx = bx - ax, aby = by - ay;
        const apx = px - ax, apy = py - ay;
        const len2 = abx * abx + aby * aby;
        const tt = Math.max(0, Math.min(1, len2 ? (apx * abx + apy * aby) / len2 : 0));
        const ccx = ax + abx * tt, ccy = ay + aby * tt;
        return Math.hypot(px - ccx, py - ccy);
      };
      const sealOuterR = 0.5, sealInnerR = 0.40, checkW = 0.05;
      const inSeal = (x, y) => {
        const d = Math.hypot(x, y);
        if (d <= sealOuterR && d >= sealInnerR) return true;
        if (segDist(x, y, -0.22, 0.02, -0.06, 0.20) < checkW) return true;
        if (segDist(x, y, -0.06, 0.20, 0.26, -0.20) < checkW) return true;
        return false;
      };
      const seal = this._silhouettePts(N, -0.55, 0.55, -0.55, 0.55, inSeal, 0.6)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // shape 3 — hub-and-spokes: one central node, six satellite nodes, strict star topology
      const spokeN = 6;
      const hubCenters = [[0, 0]];
      for (let k = 0; k < spokeN; k++) {
        const ang = (k / spokeN) * 6.2832 - Math.PI / 2;
        hubCenters.push([Math.cos(ang) * 0.56, Math.sin(ang) * 0.56]);
      }
      const weights = [2.4, 1, 1, 1, 1, 1, 1];
      const wsum = weights.reduce((a, b) => a + b, 0);
      const counts = weights.map(wg => Math.round(N * wg / wsum));
      counts[counts.length - 1] = N - counts.slice(0, -1).reduce((a, b) => a + b, 0);
      const hubPts = [];
      hubCenters.forEach(([hx, hy], hi) => {
        for (let k = 0; k < counts[hi]; k++) {
          const ang = this.rnd(0, 6.2832), rad = Math.sqrt(Math.random()) * (hi === 0 ? 0.16 : 0.09);
          hubPts.push({ x: cx + (hx + Math.cos(ang) * rad) * R, y: cy + (hy + Math.sin(ang) * rad) * R });
        }
      });
      const hubCentersScaled = hubCenters.map(([hx, hy]) => ({ x: cx + hx * R, y: cy + hy * R }));
      const hubEdges = Array.from({ length: spokeN }, (_, k) => [0, k + 1]);

      this.cmShapes = { gate, seal, hub: hubPts };
      this.cmHubCenters = hubCentersScaled;
      this.cmHubEdges = hubEdges;
      this.parts = gate.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.cmTimeline = [
        { type: 'hold', shape: 'gate', dur: 2.4, gate: 1, seal: 0, hub: 0 },
        { type: 'morph', from: 'gate', to: 'seal', dur: 1.6, gate: [1, 0], seal: [0, 1], hub: [0, 0] },
        { type: 'hold', shape: 'seal', dur: 2.4, gate: 0, seal: 1, hub: 0 },
        { type: 'morph', from: 'seal', to: 'hub', dur: 1.6, gate: [0, 0], seal: [1, 0], hub: [0, 1] },
        { type: 'hold', shape: 'hub', dur: 2.6, gate: 0, seal: 0, hub: 1 },
        { type: 'morph', from: 'hub', to: 'gate', dur: 1.6, gate: [0, 1], seal: [0, 0], hub: [1, 0] },
      ];
      this.cmPhase = 0; this.cmPhaseT = 0; this.cmScatter = null;
    } else if (this.scene === 'careers-morph') {
      // Careers page — a 3-state loop: a single bright seed/core (an individual) morphs into
      // a loose cluster of connected node-groups (joining a team), morphs into an ascending
      // blocky staircase silhouette (career growth — literal stepped stairs, distinct from the
      // smooth line-graph used for Data Engineering), then loops back to the seed.
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      const N = Math.min(200, Math.max(120, Math.round(175 * I)));

      // shape 1 — seed: a tight, bright core cluster at center
      const seed = Array.from({ length: N }, () => {
        const ang = this.rnd(0, 6.2832), rad = Math.sqrt(Math.random()) * 0.14;
        return { x: cx + Math.cos(ang) * rad * R, y: cy + Math.sin(ang) * rad * R };
      });

      // shape 2 — team: several small loosely-connected node-groups (individual joins a team)
      const teamCenters = [[-0.5, -0.26], [0.05, -0.42], [0.5, -0.20], [-0.46, 0.32], [0.10, 0.46], [0.5, 0.28]];
      const perTeam = Math.floor(N / teamCenters.length);
      const teamPts = [];
      teamCenters.forEach(([tx, ty], ti) => {
        const count = ti === teamCenters.length - 1 ? N - teamPts.length : perTeam;
        for (let k = 0; k < count; k++) {
          const ang = this.rnd(0, 6.2832), rad = Math.sqrt(Math.random()) * 0.14;
          teamPts.push({ x: cx + (tx + Math.cos(ang) * rad) * R, y: cy + (ty + Math.sin(ang) * rad) * R });
        }
      });
      const teamCentersScaled = teamCenters.map(([tx, ty]) => ({ x: cx + tx * R, y: cy + ty * R }));
      const teamEdges = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [1, 4]];

      // shape 3 — stairs: a solid ascending blocky staircase (flat treads, hard risers)
      const stepCount = 5;
      const sx0 = -0.72, sx1 = 0.72, baseline = 0.56, topY = -0.50;
      const stepW = (sx1 - sx0) / stepCount;
      const stepTopFor = (x) => {
        let idx = Math.floor((x - sx0) / stepW);
        idx = Math.max(0, Math.min(stepCount - 1, idx));
        const frac = (idx + 1) / stepCount;
        return baseline - frac * (baseline - topY);
      };
      const inStairs = (x, y) => {
        if (x < sx0 || x > sx1 || y > baseline) return false;
        return y >= stepTopFor(x);
      };
      const stairs = this._silhouettePts(N, sx0 - 0.03, sx1 + 0.03, topY - 0.03, baseline + 0.03, inStairs, 0.6)
        .map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));

      // explicit staircase path (baseline → riser → tread → riser → tread ...) used to
      // animate a small "climbing" marker during the stairs hold
      const path = [{ x: sx0, y: baseline }];
      for (let i = 0; i < stepCount; i++) {
        const leftX = sx0 + i * stepW, rightX = sx0 + (i + 1) * stepW;
        const topYi = baseline - ((i + 1) / stepCount) * (baseline - topY);
        path.push({ x: leftX, y: topYi });
        path.push({ x: rightX, y: topYi });
      }

      this.crShapes = { seed, team: teamPts, stairs };
      this.crTeamCenters = teamCentersScaled;
      this.crTeamEdges = teamEdges;
      this.crStairsPath = path.map(p => ({ x: cx + p.x * R, y: cy + p.y * R }));
      this.parts = seed.map(p => {
        const r = Math.random();
        return {
          x: p.x, y: p.y,
          col: r < 0.08 ? 'accent' : (r < 0.55 ? 'light' : 'glow'),
          ph: Math.random() * 6.28,
          size: this.rnd(1.6, 2.6),
        };
      });
      this.crTimeline = [
        { type: 'hold', shape: 'seed', dur: 2.2, seed: 1, team: 0, stairs: 0 },
        { type: 'morph', from: 'seed', to: 'team', dur: 1.6, seed: [1, 0], team: [0, 1], stairs: [0, 0] },
        { type: 'hold', shape: 'team', dur: 2.6, seed: 0, team: 1, stairs: 0 },
        { type: 'morph', from: 'team', to: 'stairs', dur: 1.6, seed: [0, 0], team: [1, 0], stairs: [0, 1] },
        { type: 'hold', shape: 'stairs', dur: 2.8, seed: 0, team: 0, stairs: 1 },
        { type: 'morph', from: 'stairs', to: 'seed', dur: 1.6, seed: [0, 1], team: [0, 0], stairs: [1, 0] },
      ];
      this.crPhase = 0; this.crPhaseT = 0; this.crScatter = null;
    }
  }
  // k-nearest-neighbour edges (by 3D distance) — wires the network node cloud into a web
  _knnEdges(pts, K) {
    const N = pts.length, edges = [], seen = new Set();
    for (let i = 0; i < N; i++) {
      const dists = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
        dists.push([j, dx * dx + dy * dy + dz * dz]);
      }
      dists.sort((a, b) => a[1] - b[1]);
      for (let k = 0; k < K && k < dists.length; k++) {
        const j = dists[k][0];
        const key = i < j ? i + '_' + j : j + '_' + i;
        if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
      }
    }
    return edges;
  }
  // Silhouette point sampler — bins a shape's bounding box into a grid, keeps only cells
  // where inFn(x,y) is true, then splits those into boundary cells (an inside cell touching
  // an outside neighbour) vs. interior cells. Sampling mostly from the boundary is what makes
  // a sparse dot cloud actually read as a recognizable outline instead of a fuzzy blob.
  _silhouettePts(N, x0, x1, y0, y1, inFn, edgeFrac) {
    const GX = 170;
    const GY = Math.max(40, Math.round(GX * (y1 - y0) / (x1 - x0)));
    const cw = (x1 - x0) / GX, ch = (y1 - y0) / GY;
    const inside = new Uint8Array(GX * GY);
    for (let gy = 0; gy < GY; gy++) for (let gx = 0; gx < GX; gx++) {
      const px = x0 + (gx + 0.5) * cw, py = y0 + (gy + 0.5) * ch;
      inside[gy * GX + gx] = inFn(px, py) ? 1 : 0;
    }
    const edgeCells = [], fillCells = [];
    for (let gy = 0; gy < GY; gy++) for (let gx = 0; gx < GX; gx++) {
      if (!inside[gy * GX + gx]) continue;
      let boundary = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = gx + dx, ny = gy + dy;
        if (nx < 0 || nx >= GX || ny < 0 || ny >= GY || !inside[ny * GX + nx]) { boundary = true; break; }
      }
      (boundary ? edgeCells : fillCells).push(gx, gy);
    }
    const pick = (cells, n) => {
      const out = [];
      const pairs = cells.length / 2;
      if (!pairs) return out;
      for (let i = 0; i < n; i++) {
        const k = (Math.random() * pairs) | 0;
        const gx = cells[k * 2], gy = cells[k * 2 + 1];
        out.push({
          x: x0 + (gx + 0.5 + this.rnd(-0.35, 0.35)) * cw,
          y: y0 + (gy + 0.5 + this.rnd(-0.35, 0.35)) * ch,
        });
      }
      return out;
    };
    const nEdge = Math.round(N * edgeFrac);
    return [...pick(edgeCells, nEdge), ...pick(fillCells, N - nEdge)];
  }
  // radial "explosion" points — pushes a given set of shape points outward from center, used
  // as the break-apart waypoint between one assembled shape and the next
  _scatterPts(pts) {
    const cx = this.w / 2, cy = this.h / 2;
    const R = Math.min(this.w, this.h) * 0.45;
    return pts.map(p => {
      const dx = p.x - cx, dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const ang = Math.atan2(dy, dx) + this.rnd(-0.6, 0.6);
      const dist = R * this.rnd(0.9, 1.7);
      return { x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist };
    });
  }
  // small continuous per-point drift — draw-time only, never touches the underlying
  // simulation position, so held "assembled" shapes stay recognizable but never look dead
  _jit(x, y, ph, amp = 1.6) {
    return {
      x: x + Math.sin(this.t * 1.3 + ph) * amp,
      y: y + Math.cos(this.t * 1.1 + ph * 1.3) * amp,
    };
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
      // Earth spins; city pins ride along (pinned to lat/lon).
      // Only planes move relative to the globe.
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
    } else if (this.scene === 'morph') {
      const tl = this.morphTimeline;
      this.mPhaseT += dt;
      let ph = tl[this.mPhase];
      if (this.mPhaseT >= ph.dur) {
        this.mPhaseT -= ph.dur;
        this.mPhase = (this.mPhase + 1) % tl.length;
        ph = tl[this.mPhase];
        if (ph.type === 'morph') this.mScatter = this._scatterPts(this.shapes[ph.from]);
      }
      const N = this.parts.length;
      if (ph.type === 'hold') {
        const target = this.shapes[ph.shape];
        for (let i = 0; i < N; i++) {
          const p = this.parts[i], tg = target[i];
          p.x += (tg.x - p.x) * Math.min(1, dt * 4);
          p.y += (tg.y - p.y) * Math.min(1, dt * 4);
        }
        this._netAmt = ph.net; this._axisAmt = ph.axis;
      } else {
        const p01 = Math.min(1, this.mPhaseT / ph.dur);
        const from = this.shapes[ph.from], to = this.shapes[ph.to], sc = this.mScatter;
        const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) {
            const e = ease(p01 * 2);
            p.x = from[i].x + (sc[i].x - from[i].x) * e;
            p.y = from[i].y + (sc[i].y - from[i].y) * e;
          } else {
            const e = ease((p01 - 0.5) * 2);
            p.x = sc[i].x + (to[i].x - sc[i].x) * e;
            p.y = sc[i].y + (to[i].y - sc[i].y) * e;
          }
        }
        this._netAmt = ph.net[0] + (ph.net[1] - ph.net[0]) * p01;
        this._axisAmt = ph.axis[0] + (ph.axis[1] - ph.axis[0]) * p01;
      }
    } else if (this.scene === 'ai-net') {
      const speed = 0.16 * I;
      this.aiWaves = this.aiWaves.map(ph => (ph + dt * speed) % 1);
    } else if (this.scene === 'cloud-tiers') {
      const tl = this.ctTimeline;
      this.ctPhaseT += dt;
      let ph = tl[this.ctPhase];
      if (this.ctPhaseT >= ph.dur) {
        this.ctPhaseT -= ph.dur;
        this.ctPhase = (this.ctPhase + 1) % tl.length;
        ph = tl[this.ctPhase];
        if (ph.type === 'morph') this.ctScatter = this._scatterPts(this.ctShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.ctShapes[ph.shape];
        for (let i = 0; i < N; i++) {
          const p = this.parts[i], t = target[i];
          p.x += (t.x - p.x) * Math.min(1, dt * 4);
          p.y += (t.y - p.y) * Math.min(1, dt * 4);
        }
        this.ctCloudAmt = ph.shape === 'cloud' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.ctPhaseT / ph.dur);
        const from = this.ctShapes[ph.from], to = this.ctShapes[ph.to], sc = this.ctScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this.ctCloudAmt = ph.from === 'cloud' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'data-grid') {
      const tl = this.dgTimeline;
      this.dgPhaseT += dt;
      let ph = tl[this.dgPhase];
      if (this.dgPhaseT >= ph.dur) {
        this.dgPhaseT -= ph.dur;
        this.dgPhase = (this.dgPhase + 1) % tl.length;
        ph = tl[this.dgPhase];
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.dgShapes[ph.shape];
        for (let i = 0; i < N; i++) { const p = this.parts[i], t = target[i]; p.x += (t.x - p.x) * Math.min(1, dt * 4); p.y += (t.y - p.y) * Math.min(1, dt * 4); }
        this.dgLineAmt = ph.shape === 'line' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.dgPhaseT / ph.dur);
        const e = ease(p01);
        const from = this.dgShapes[ph.from], to = this.dgShapes[ph.to];
        for (let i = 0; i < N; i++) { const p = this.parts[i]; p.x = from[i].x + (to[i].x - from[i].x) * e; p.y = from[i].y + (to[i].y - from[i].y) * e; }
        this.dgLineAmt = ph.from === 'line' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'it-modules') {
      const tl = this.itTimeline;
      this.itPhaseT += dt;
      let ph = tl[this.itPhase];
      if (this.itPhaseT >= ph.dur) {
        this.itPhaseT -= ph.dur;
        this.itPhase = (this.itPhase + 1) % tl.length;
        ph = tl[this.itPhase];
        if (ph.type === 'morph') this.itScatter = this._scatterPts(this.itShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.itShapes[ph.shape];
        for (let i = 0; i < N; i++) { const p = this.parts[i], t = target[i]; p.x += (t.x - p.x) * Math.min(1, dt * 4); p.y += (t.y - p.y) * Math.min(1, dt * 4); }
        this.itPodsAmt = ph.shape === 'pods' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.itPhaseT / ph.dur);
        const from = this.itShapes[ph.from], to = this.itShapes[ph.to], sc = this.itScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this.itPodsAmt = ph.from === 'pods' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'program-timeline') {
      this.ptT += dt;
      const f = (this.ptT % this.ptCycle) / this.ptCycle;
      let waveFrac;
      if (f < 0.62) waveFrac = f / 0.62;
      else if (f < 0.8) waveFrac = 1;
      else waveFrac = -1;
      this.ptWaveFrac = waveFrac;
      const N = this.parts.length;
      for (let i = 0; i < N; i++) {
        const p = this.parts[i];
        const onLine = waveFrac >= 0 && p.lineFrac <= waveFrac;
        const target = onLine ? this.ptLine[i] : this.ptScatter[i];
        p.x += (target.x - p.x) * Math.min(1, dt * 3.2);
        p.y += (target.y - p.y) * Math.min(1, dt * 3.2);
      }
    } else if (this.scene === 'products-morph') {
      const tl = this.pmTimeline;
      this.pmPhaseT += dt;
      let ph = tl[this.pmPhase];
      if (this.pmPhaseT >= ph.dur) {
        this.pmPhaseT -= ph.dur;
        this.pmPhase = (this.pmPhase + 1) % tl.length;
        ph = tl[this.pmPhase];
        if (ph.type === 'morph') this.pmScatter = this._scatterPts(this.pmShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.pmShapes[ph.shape];
        for (let i = 0; i < N; i++) {
          const p = this.parts[i], tg = target[i];
          p.x += (tg.x - p.x) * Math.min(1, dt * 4);
          p.y += (tg.y - p.y) * Math.min(1, dt * 4);
        }
        this._geoAmt = ph.geo; this._docAmt = ph.doc; this._chatAmt = ph.chat;
      } else {
        const p01 = Math.min(1, this.pmPhaseT / ph.dur);
        const from = this.pmShapes[ph.from], to = this.pmShapes[ph.to], sc = this.pmScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this._geoAmt = ph.geo[0] + (ph.geo[1] - ph.geo[0]) * p01;
        this._docAmt = ph.doc[0] + (ph.doc[1] - ph.doc[0]) * p01;
        this._chatAmt = ph.chat[0] + (ph.chat[1] - ph.chat[0]) * p01;
      }
    } else if (this.scene === 'geo-morph') {
      const tl = this.gmTimeline;
      this.gmPhaseT += dt;
      let ph = tl[this.gmPhase];
      if (this.gmPhaseT >= ph.dur) {
        this.gmPhaseT -= ph.dur;
        this.gmPhase = (this.gmPhase + 1) % tl.length;
        ph = tl[this.gmPhase];
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.gmShapes[ph.shape];
        for (let i = 0; i < N; i++) { const p = this.parts[i], t = target[i]; p.x += (t.x - p.x) * Math.min(1, dt * 4); p.y += (t.y - p.y) * Math.min(1, dt * 4); }
        this.gmCompassAmt = ph.shape === 'compass' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.gmPhaseT / ph.dur);
        const e = ease(p01);
        const from = this.gmShapes[ph.from], to = this.gmShapes[ph.to];
        for (let i = 0; i < N; i++) { const p = this.parts[i]; p.x = from[i].x + (to[i].x - from[i].x) * e; p.y = from[i].y + (to[i].y - from[i].y) * e; }
        this.gmCompassAmt = ph.from === 'compass' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'semantic-morph') {
      const tl = this.smTimeline;
      this.smPhaseT += dt;
      let ph = tl[this.smPhase];
      if (this.smPhaseT >= ph.dur) {
        this.smPhaseT -= ph.dur;
        this.smPhase = (this.smPhase + 1) % tl.length;
        ph = tl[this.smPhase];
        if (ph.type === 'morph') this.smScatter = this._scatterPts(this.smShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.smShapes[ph.shape];
        for (let i = 0; i < N; i++) { const p = this.parts[i], t = target[i]; p.x += (t.x - p.x) * Math.min(1, dt * 4); p.y += (t.y - p.y) * Math.min(1, dt * 4); }
        this.smGraphAmt = ph.shape === 'graph' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.smPhaseT / ph.dur);
        const from = this.smShapes[ph.from], to = this.smShapes[ph.to], sc = this.smScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this.smGraphAmt = ph.from === 'graph' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'assistant-morph') {
      const tl = this.amTimeline;
      this.amPhaseT += dt;
      let ph = tl[this.amPhase];
      if (this.amPhaseT >= ph.dur) {
        this.amPhaseT -= ph.dur;
        this.amPhase = (this.amPhase + 1) % tl.length;
        ph = tl[this.amPhase];
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.amShapes[ph.shape];
        for (let i = 0; i < N; i++) { const p = this.parts[i], t = target[i]; p.x += (t.x - p.x) * Math.min(1, dt * 4); p.y += (t.y - p.y) * Math.min(1, dt * 4); }
        this.amBubbleAmt = ph.shape === 'bubble' ? 1 : 0;
      } else {
        const p01 = Math.min(1, this.amPhaseT / ph.dur);
        const e = ease(p01);
        const from = this.amShapes[ph.from], to = this.amShapes[ph.to];
        for (let i = 0; i < N; i++) { const p = this.parts[i]; p.x = from[i].x + (to[i].x - from[i].x) * e; p.y = from[i].y + (to[i].y - from[i].y) * e; }
        this.amBubbleAmt = ph.from === 'bubble' ? 1 - p01 : p01;
      }
    } else if (this.scene === 'contracts-morph') {
      const tl = this.cmTimeline;
      this.cmPhaseT += dt;
      let ph = tl[this.cmPhase];
      if (this.cmPhaseT >= ph.dur) {
        this.cmPhaseT -= ph.dur;
        this.cmPhase = (this.cmPhase + 1) % tl.length;
        ph = tl[this.cmPhase];
        if (ph.type === 'morph') this.cmScatter = this._scatterPts(this.cmShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.cmShapes[ph.shape];
        for (let i = 0; i < N; i++) {
          const p = this.parts[i], t = target[i];
          p.x += (t.x - p.x) * Math.min(1, dt * 4);
          p.y += (t.y - p.y) * Math.min(1, dt * 4);
        }
        this._gateAmt = ph.gate; this._sealAmt = ph.seal; this._hubAmt = ph.hub;
      } else {
        const p01 = Math.min(1, this.cmPhaseT / ph.dur);
        const from = this.cmShapes[ph.from], to = this.cmShapes[ph.to], sc = this.cmScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this._gateAmt = ph.gate[0] + (ph.gate[1] - ph.gate[0]) * p01;
        this._sealAmt = ph.seal[0] + (ph.seal[1] - ph.seal[0]) * p01;
        this._hubAmt = ph.hub[0] + (ph.hub[1] - ph.hub[0]) * p01;
      }
    } else if (this.scene === 'careers-morph') {
      const tl = this.crTimeline;
      this.crPhaseT += dt;
      let ph = tl[this.crPhase];
      if (this.crPhaseT >= ph.dur) {
        this.crPhaseT -= ph.dur;
        this.crPhase = (this.crPhase + 1) % tl.length;
        ph = tl[this.crPhase];
        if (ph.type === 'morph') this.crScatter = this._scatterPts(this.crShapes[ph.from]);
      }
      const N = this.parts.length;
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      if (ph.type === 'hold') {
        const target = this.crShapes[ph.shape];
        for (let i = 0; i < N; i++) {
          const p = this.parts[i], t = target[i];
          p.x += (t.x - p.x) * Math.min(1, dt * 4);
          p.y += (t.y - p.y) * Math.min(1, dt * 4);
        }
        this._seedAmt = ph.seed; this._teamAmt = ph.team; this._stairsAmt = ph.stairs;
      } else {
        const p01 = Math.min(1, this.crPhaseT / ph.dur);
        const from = this.crShapes[ph.from], to = this.crShapes[ph.to], sc = this.crScatter;
        for (let i = 0; i < N; i++) {
          const p = this.parts[i];
          if (p01 < 0.5) { const e = ease(p01 * 2); p.x = from[i].x + (sc[i].x - from[i].x) * e; p.y = from[i].y + (sc[i].y - from[i].y) * e; }
          else { const e = ease((p01 - 0.5) * 2); p.x = sc[i].x + (to[i].x - sc[i].x) * e; p.y = sc[i].y + (to[i].y - sc[i].y) * e; }
        }
        this._seedAmt = ph.seed[0] + (ph.seed[1] - ph.seed[0]) * p01;
        this._teamAmt = ph.team[0] + (ph.team[1] - ph.team[0]) * p01;
        this._stairsAmt = ph.stairs[0] + (ph.stairs[1] - ph.stairs[0]) * p01;
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
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.48;
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

      // Visibility test: d3.geoOrthographic's clipAngle only clips paths,
      // not raw point projection — so we hand-check each point against the
      // hemisphere by angular distance from the projection's center.
      const center = projection.invert([cx, cy]); // [lon°, lat°]
      const HALF_PI = Math.PI / 2;
      const visible = (ll) => d3.geoDistance(ll, center) < HALF_PI;

      // Airport markers — disappear cleanly when the city rotates to the back
      for (const ap of this.airports) {
        const ll = [ap.lon, ap.lat];
        if (!visible(ll)) continue;
        const xy = projection(ll);
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
        if (head && back && visible(headLL)) {
          const ang = Math.atan2(head[1] - back[1], head[0] - back[0]);
          const sz = 5;
          c.save();
          c.translate(head[0], head[1]);
          c.rotate(ang);
          c.fillStyle = vrgba(P.white, 0.98);
          // Top-down airliner silhouette: nose, swept wings, tail stabilizers
          c.beginPath();
          c.moveTo( sz * 1.20,  0);             // nose tip
          c.lineTo( sz * 0.70,  sz * 0.13);     // forward fuselage R
          c.lineTo( sz * 0.15,  sz * 0.17);     // wing root front R
          c.lineTo(-sz * 0.35,  sz * 1.00);     // wing tip front R
          c.lineTo(-sz * 0.50,  sz * 1.00);     // wing tip back R
          c.lineTo(-sz * 0.20,  sz * 0.20);     // wing root back R
          c.lineTo(-sz * 0.75,  sz * 0.14);     // mid-fuselage R
          c.lineTo(-sz * 0.95,  sz * 0.42);     // tail wing tip front R
          c.lineTo(-sz * 1.05,  sz * 0.42);     // tail wing tip back R
          c.lineTo(-sz * 0.92,  sz * 0.12);     // tail wing root R
          c.lineTo(-sz * 1.15,  0);             // tail
          c.lineTo(-sz * 0.92, -sz * 0.12);
          c.lineTo(-sz * 1.05, -sz * 0.42);
          c.lineTo(-sz * 0.95, -sz * 0.42);
          c.lineTo(-sz * 0.75, -sz * 0.14);
          c.lineTo(-sz * 0.20, -sz * 0.20);
          c.lineTo(-sz * 0.50, -sz * 1.00);
          c.lineTo(-sz * 0.35, -sz * 1.00);
          c.lineTo( sz * 0.15, -sz * 0.17);
          c.lineTo( sz * 0.70, -sz * 0.13);
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
    } else if (this.scene === 'morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.62, P.royal, 0.14);

      // subtle per-particle bob, applied at draw-time only (positions stay clean for morph math)
      const disp = this.parts.map(p => ({
        x: p.x + Math.sin(this.t * 1.3 + p.ph) * 1.4,
        y: p.y + Math.cos(this.t * 1.1 + p.ph) * 1.4,
      }));

      // baseline axis — reads under the bar-chart / "data" shape
      const axisAmt = this._axisAmt || 0;
      if (axisAmt > 0.01) {
        const R = Math.min(w, h) * 0.52;
        const y0 = cy + 0.34 * R;
        c.strokeStyle = vrgba(P.light, 0.35 * axisAmt);
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(cx - 0.9 * R, y0); c.lineTo(cx + 0.9 * R, y0); c.stroke();
      }

      // wireframe links — reads as the "AI network" shape, fades out as it breaks apart
      const netAmt = this._netAmt || 0;
      if (netAmt > 0.01 && this.edges) {
        c.lineWidth = 1;
        c.strokeStyle = vrgba(P.royal, 0.32 * netAmt);
        for (const [a, b] of this.edges) {
          c.beginPath(); c.moveTo(disp[a].x, disp[a].y); c.lineTo(disp[b].x, disp[b].y); c.stroke();
        }
      }

      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse2 = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const zMod = this.networkZ ? 1 + this.networkZ[i] * 0.3 * netAmt : 1;
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse2 * zMod;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'ai-net') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.6, P.royal, 0.12);
      const bandW = (this.aiX1 - this.aiX0) * 0.22;
      const waveX = this.aiWaves.map(ph => this.aiX0 + (this.aiX1 - this.aiX0) * ph);
      const disp = this.aiNodes.map(n => this._jit(n.x, n.y, n.ph, 2.2));
      c.lineWidth = 1;
      for (const [a, b] of this.aiEdges) {
        const na = this.aiNodes[a], nb = this.aiNodes[b];
        const midx = (na.x + nb.x) / 2;
        let heat = 0;
        for (const wx of waveX) heat = Math.max(heat, Math.max(0, 1 - Math.abs(midx - wx) / bandW));
        c.strokeStyle = vrgba(P.royal, 0.12 + 0.55 * heat);
        c.beginPath(); c.moveTo(disp[a].x, disp[a].y); c.lineTo(disp[b].x, disp[b].y); c.stroke();
      }
      for (let i = 0; i < this.aiNodes.length; i++) {
        const n = this.aiNodes[i], d = disp[i];
        let heat = 0;
        for (const wx of waveX) heat = Math.max(heat, Math.max(0, 1 - Math.abs(n.x - wx) / bandW));
        const col = heat > 0.5 ? P.accent : P.light;
        const r = 2.2 + heat * 2.4;
        c.fillStyle = vrgba(col, 0.55 + 0.45 * heat);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
        if (heat > 0.3) { c.fillStyle = vrgba(P.white, 0.18 * heat); c.beginPath(); c.arc(d.x, d.y, r * 2.4, 0, 6.2832); c.fill(); }
      }
    } else if (this.scene === 'cloud-tiers') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.6, P.royal, 0.13);
      const cloudAmt = this.ctCloudAmt || 0;
      const rackAmt = 1 - cloudAmt;
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.7));
      c.lineWidth = 1;
      // row rail connectors — read as the rack's internal chassis rails, fade as it dissolves
      for (const [a, b] of this.ctEdges) {
        const pa = disp[a], pb = disp[b];
        c.strokeStyle = vrgba(P.royal, 0.30 * rackAmt);
        c.beginPath(); c.moveTo(pa.x, pa.y); c.lineTo(pb.x, pb.y); c.stroke();
      }
      const leds = this.ctLedIdx;
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse = 0.8 + 0.2 * Math.sin(this.t * 2 + p.ph);
        const isLed = leds.has(i);
        const r = (isLed ? 2.1 + rackAmt * 1.1 : 2) * pulse;
        c.fillStyle = vrgba(isLed ? P.accent : P.light, isLed ? 0.5 + 0.45 * rackAmt : 0.8);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
        if (isLed && rackAmt > 0.35) {
          c.fillStyle = vrgba(P.accent, 0.16 * rackAmt);
          c.beginPath(); c.arc(d.x, d.y, r * 2.6, 0, 6.2832); c.fill();
        }
      }
    } else if (this.scene === 'data-grid') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.6, P.royal, 0.12);
      const lineAmt = this.dgLineAmt || 0;
      if (lineAmt > 0.2) {
        // baseline / axis — a plain reference line under the trend, drawn separately
        // (not part of the dot count), plus a soft glow riding the rising tip
        c.strokeStyle = vrgba(P.light, 0.30 * lineAmt);
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(this.dgAxisX0, this.dgAxisY); c.lineTo(this.dgAxisX1, this.dgAxisY); c.stroke();
        const pulse = 0.7 + 0.3 * Math.sin(this.t * 2.6);
        this._glow(this.dgTipX, this.dgTipY, 32 * pulse * lineAmt, P.accent, 0.22 * lineAmt);
      }
      const curveN = this.dgCurveCount;
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i];
        const d = this._jit(p.x, p.y, p.ph, 1.7);
        const isCurve = i < curveN;
        const col = isCurve ? P.white : P.light;
        const a = isCurve ? (0.55 + 0.35 * lineAmt) : (0.75 - 0.30 * lineAmt);
        const r = isCurve ? 2.1 + 0.5 * lineAmt : 1.7;
        c.fillStyle = vrgba(col, Math.max(0.3, Math.min(0.95, a)));
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'it-modules') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.6, P.royal, 0.12);
      const podsAmt = this.itPodsAmt || 0;
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 0.5 + 1.4 * podsAmt));
      c.lineWidth = 1;
      for (const [a, b] of this.itEdges) {
        c.strokeStyle = vrgba(P.royal, 0.28 * podsAmt);
        c.beginPath(); c.moveTo(disp[a].x, disp[a].y); c.lineTo(disp[b].x, disp[b].y); c.stroke();
      }
      for (let i = 0; i < this.parts.length; i++) {
        const d = disp[i];
        const col = i % 13 === 0 ? P.accent : P.light;
        c.fillStyle = vrgba(col, 0.8);
        c.beginPath(); c.arc(d.x, d.y, 2.1, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'program-timeline') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.55;
      this._glow(cx, cy, R * 1.3, P.royal, 0.12);
      const x0 = this.ptX0, x1 = this.ptX1;
      c.strokeStyle = vrgba(P.royal, 0.28);
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(x0, cy); c.lineTo(x1, cy); c.stroke();
      const wf = this.ptWaveFrac;
      if (wf >= 0 && wf <= 1) {
        const px = x0 + wf * (x1 - x0);
        const grad = c.createRadialGradient(px, cy, 0, px, cy, 26);
        grad.addColorStop(0, vrgba(P.accent, 0.55));
        grad.addColorStop(1, vrgba(P.accent, 0));
        c.fillStyle = grad;
        c.beginPath(); c.arc(px, cy, 26, 0, 6.2832); c.fill();
      }
      for (const p of this.parts) {
        const onLine = wf >= 0 && p.lineFrac <= wf;
        const d = this._jit(p.x, p.y, p.ph, onLine ? 1 : 2.6);
        const pulse = 0.85 + 0.15 * Math.sin(this.t * 2 + p.ph);
        const r = (p.milestone ? 4.2 : 1.9) * pulse;
        const col = p.milestone ? (onLine ? P.accent : P.light) : (onLine ? P.light : P.glow);
        c.fillStyle = vrgba(col, onLine ? 0.95 : 0.5);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
        if (p.milestone && onLine) {
          c.fillStyle = vrgba(P.white, 0.18);
          c.beginPath(); c.arc(d.x, d.y, r * 2.2, 0, 6.2832); c.fill();
        }
      }
    } else if (this.scene === 'products-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.58;
      this._glow(cx, cy, Math.min(w, h) * 0.62, P.royal, 0.14);
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.4));

      // geospatial hold — a rotating radar-sweep line
      const geoAmt = this._geoAmt || 0;
      if (geoAmt > 0.01) {
        const ang = this.t * 1.1;
        const rad = R * 0.58;
        const ex = cx + Math.cos(ang) * rad, ey = cy + Math.sin(ang) * rad;
        const wedge = c.createLinearGradient(cx, cy, ex, ey);
        wedge.addColorStop(0, vrgba(P.accent, 0.32 * geoAmt));
        wedge.addColorStop(1, vrgba(P.accent, 0));
        c.strokeStyle = wedge;
        c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(ex, ey); c.stroke();
      }

      // semantic hold — a scanning read-line sweeping down the document
      const docAmt = this._docAmt || 0;
      if (docAmt > 0.01) {
        const bandY = cy - R * 0.65 + ((this.t * 0.3) % 1.2) * R * 1.3;
        const grad = c.createLinearGradient(0, bandY - 12, 0, bandY + 12);
        grad.addColorStop(0, vrgba(P.accent, 0));
        grad.addColorStop(0.5, vrgba(P.accent, 0.22 * docAmt));
        grad.addColorStop(1, vrgba(P.accent, 0));
        c.fillStyle = grad;
        c.fillRect(cx - R * 0.55, bandY - 12, R * 1.1, 24);
      }

      // assistant hold — a soft pulsing "thinking" glow behind the bubble
      const chatAmt = this._chatAmt || 0;
      if (chatAmt > 0.01) {
        const pulse = 0.7 + 0.3 * Math.sin(this.t * 2.4);
        this._glow(cx, cy - R * 0.05, R * 0.5 * pulse, P.glow, 0.22 * chatAmt);
      }

      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse2 = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse2;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'geo-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      this._glow(cx, cy, R * 1.15, P.royal, 0.13);
      const compassAmt = this.gmCompassAmt || 0;
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.6));
      if (compassAmt > 0.01) {
        const ang = this.t * 1.15;
        const rad = R * 0.56;
        const ex = cx + Math.cos(ang) * rad, ey = cy + Math.sin(ang) * rad;
        const wedge = c.createLinearGradient(cx, cy, ex, ey);
        wedge.addColorStop(0, vrgba(P.accent, 0.34 * compassAmt));
        wedge.addColorStop(1, vrgba(P.accent, 0));
        c.strokeStyle = wedge;
        c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(ex, ey); c.stroke();
      }
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'semantic-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      this._glow(cx, cy, Math.min(w, h) * 0.62, P.royal, 0.13);
      const graphAmt = this.smGraphAmt || 0;
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.6));
      c.lineWidth = 1;
      for (const [a, b] of this.smEdges) {
        const na = this.smNodeCenters[a], nb = this.smNodeCenters[b];
        c.strokeStyle = vrgba(P.royal, 0.32 * graphAmt);
        c.beginPath(); c.moveTo(na.x, na.y); c.lineTo(nb.x, nb.y); c.stroke();
      }
      if (graphAmt > 0.05) {
        const hub = this.smNodeCenters[0];
        this._glow(hub.x, hub.y, 34 * graphAmt, P.accent, 0.20 * graphAmt);
      }
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'assistant-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      this._glow(cx, cy, R * 1.1, P.royal, 0.13);
      const bubbleAmt = this.amBubbleAmt || 0;
      if (bubbleAmt > 0.02) {
        const pulse = 0.7 + 0.3 * Math.sin(this.t * 2.4);
        this._glow(cx, cy - R * 0.04, R * 0.46 * pulse, P.glow, 0.22 * bubbleAmt);
      }
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.6));
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse2 = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse2;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'contracts-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      this._glow(cx, cy, R * 1.15, P.royal, 0.14);
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.5));

      // gateway hold — a soft vertical light beam passing through the opening (streamlined access)
      const gateAmt = this._gateAmt || 0;
      if (gateAmt > 0.01) {
        const beamY = cy - R * 0.5 + ((this.t * 0.35) % 1.15) * R * 1.15;
        const grad = c.createLinearGradient(0, beamY - 20, 0, beamY + 20);
        grad.addColorStop(0, vrgba(P.accent, 0));
        grad.addColorStop(0.5, vrgba(P.accent, 0.24 * gateAmt));
        grad.addColorStop(1, vrgba(P.accent, 0));
        c.fillStyle = grad;
        c.fillRect(cx - R * 0.22, beamY - 20, R * 0.44, 40);
      }

      // seal hold — a slow pulsing glow ring, reads as a "verified/certified" pulse
      const sealAmt = this._sealAmt || 0;
      if (sealAmt > 0.01) {
        const pulse = 0.7 + 0.3 * Math.sin(this.t * 2.2);
        this._glow(cx, cy, R * 0.56 * pulse, P.glow, 0.20 * sealAmt);
      }

      // hub hold — spoke lines connecting the central node to each satellite (ecosystem web)
      const hubAmt = this._hubAmt || 0;
      if (hubAmt > 0.01) {
        c.lineWidth = 1;
        for (const [a, b] of this.cmHubEdges) {
          const na = this.cmHubCenters[a], nb = this.cmHubCenters[b];
          c.strokeStyle = vrgba(P.royal, 0.32 * hubAmt);
          c.beginPath(); c.moveTo(na.x, na.y); c.lineTo(nb.x, nb.y); c.stroke();
        }
      }

      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse2 = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse2;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
    } else if (this.scene === 'careers-morph') {
      this.clear(1);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.56;
      this._glow(cx, cy, R * 1.15, P.royal, 0.13);
      const disp = this.parts.map(p => this._jit(p.x, p.y, p.ph, 1.5));

      // seed hold — bright pulsing core glow (a single individual)
      const seedAmt = this._seedAmt || 0;
      if (seedAmt > 0.01) {
        const pulse = 0.75 + 0.25 * Math.sin(this.t * 2.6);
        this._glow(cx, cy, R * 0.30 * pulse, P.accent, 0.30 * seedAmt);
      }

      // team hold — lines connecting the node-groups (joining a team)
      const teamAmt = this._teamAmt || 0;
      if (teamAmt > 0.01) {
        c.lineWidth = 1;
        for (const [a, b] of this.crTeamEdges) {
          const na = this.crTeamCenters[a], nb = this.crTeamCenters[b];
          c.strokeStyle = vrgba(P.royal, 0.30 * teamAmt);
          c.beginPath(); c.moveTo(na.x, na.y); c.lineTo(nb.x, nb.y); c.stroke();
        }
      }

      // stairs hold — a small glowing marker climbing the staircase (career growth)
      const stairsAmt = this._stairsAmt || 0;
      if (stairsAmt > 0.03) {
        const path = this.crStairsPath;
        const segCount = path.length - 1;
        const cycle = 3.4;
        const frac = (this.t % cycle) / cycle;
        const segF = frac * segCount;
        const segI = Math.min(segCount - 1, Math.floor(segF));
        const segT = segF - segI;
        const a = path[segI], b = path[segI + 1];
        const mx = a.x + (b.x - a.x) * segT, my = a.y + (b.y - a.y) * segT;
        this._glow(mx, my, 16, P.accent, 0.5 * stairsAmt);
        c.fillStyle = vrgba(P.white, 0.85 * stairsAmt);
        c.beginPath(); c.arc(mx, my, 3, 0, 6.2832); c.fill();
      }

      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i], d = disp[i];
        const pulse2 = 0.75 + 0.25 * Math.sin(this.t * 2 + p.ph);
        const col = p.col === 'accent' ? P.accent : (p.col === 'light' ? P.light : P.glow);
        const r = p.size * pulse2;
        c.fillStyle = vrgba(col, p.col === 'accent' ? 0.9 : 0.75);
        c.beginPath(); c.arc(d.x, d.y, r, 0, 6.2832); c.fill();
      }
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
