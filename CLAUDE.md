# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full marketing-site redesign for iCatalyst, a Virginia-based IT & AI consulting firm serving federal and commercial clients. Built by Columbia Software Solutions. In active development.

## Running it locally

**There is no build step, package manager, bundler, linter, or test suite in this repo** — do not go looking for `npm run *` scripts or a `package.json`; there isn't one. Every page is a static `.html` shell that loads React 18 (UMD) + Babel Standalone from a CDN and transpiles the `.jsx` files in-browser at request time.

To preview, serve the repo root over HTTP and open any `<page>.html` — e.g.:

```
python3 -m http.server 8080
```

Do **not** open the files via `file://`. Two things break under `file://`:
- `lib/canvasviz.jsx`'s `globe` scene `fetch()`es world-atlas topojson data — this requires http(s).
- `window.__ICV` (cache-busting `?v=timestamp` on script/stylesheet URLs) only activates when `location.hostname` is `localhost`/`127.0.0.1`, so edits can appear to silently not apply.

## Architecture

### Page shells and script loading order

Each root `<page>.html` is a near-identical boilerplate shell (see any one, e.g. `solution.html`) that `document.write`s an ordered list of `<script type="text/babel" src="...">` tags, then never touches the DOM directly again — everything else is React. The list always starts with `lib/data.jsx`, then shared UI libs, then whichever optional libs that page's components need, and ends with exactly one `pages/*.jsx` file that calls `ReactDOM.createRoot(...).render(<App/>)`. Order matters — later files assume earlier ones already ran. Example (`solutions.html`):

```
['lib/data.jsx','lib/ui.jsx','lib/chrome.jsx','lib/motion.jsx','lib/canvasviz.jsx','lib/solmotifs.jsx','pages/solutions.jsx']
```

To add a new page: create `pages/foo.jsx`, copy an existing `.html` shell to `foo.html`, and edit its module list to match what `foo.jsx` actually imports (only pull in `lib/canvasviz.jsx` / `lib/visuals.jsx` / `lib/solmotifs.jsx` / `lib/tweaks-panel.jsx` if that page uses them).

### No modules — everything is global

There are no ES module imports/exports. Every `lib/*.jsx` file ends with `Object.assign(window, { ... })` to expose its components, and `lib/data.jsx` assigns all site content to `window.IC`. Page components read `IC.*` for copy and call shared components as plain globals (`<PageHeader>`, `<NavBar>`, `<Viz>`, etc.) — there's nothing to import.

### `lib/data.jsx` is the single source of truth for content

All copy — company info, nav structure, `IC.solutions` (5 items: `ai`, `cloud`, `data`, `it`, `program`), `IC.products` (3 items: `geospatial`, `semantic`, `assistant`), values, partners — lives here as plain data. Page components (`pages/solution.jsx`, `pages/products.jsx`, etc.) never hardcode copy; they look it up by id. This file also maps each solution/product id to its visual treatment: `IC.solutionScene` / `IC.productScene` (canvas scene name, see below) and `IC.solutionMotif` / `IC.productMotif` (static SVG motif variant). When content is sourced from the client's real site, keep it verbatim rather than paraphrasing — solution pages in particular mirror specific sections from the live site ("Our Expertise", "Our Advantage").

### Hash-based routing for detail pages, not query strings

`solution.html` and `products.html` are single templates that render different content based on the URL **hash** (`solution.html#cloud`, `products.html#geospatial`), not a `?id=` query string. This is deliberate: static-file hosts commonly do "clean URL" redirects that strip query strings but never touch hash fragments (hash is client-side only). Any new id-driven detail page should follow this same convention — read `location.hash`, and listen for the `hashchange` event (not just read it once) since same-page anchor links (e.g. footer links to another id on the page you're already on) only fire `hashchange`, not a full navigation.

### Design tokens

`lib/colors_and_type.css` is the single source of truth for color and type CSS custom properties and loads before everything else; `lib/site.css` layers component/motion CSS on top. Reference `var(--token-name)` rather than hardcoding colors. The brand's licensed display/mono faces aren't available yet, so Geist/Geist Mono stand in for them (see the font note at the top of `colors_and_type.css`).

Responsive collapse to a single column under 1000px is done via specific class-name hooks declared per-page in an inline `<style>` block in each `.html` file: `.hero-grid, .two-grid, .three-grid, .five-grid, .stat-grid, .footer-grid, .split-grid, .prod-grid`. These are hooks, not literal column-count promises — a 4-column grid can reuse `.five-grid` for its collapse behavior. When adding a new responsive grid, reuse one of these existing class names rather than inventing a new one the breakpoint doesn't know about.

### The canvas visual engine (`lib/canvasviz.jsx`)

A single `VizEngine` class drives every animated hero/card background via `<Viz scene="name" intensity="bold|medium|subtle" />`. One `requestAnimationFrame` loop calls `init()` (on mount/resize) then `step(dt)`/`draw()` per frame, each a long `if/else if` chain keyed on `this.scene` — adding a scene means adding one branch to each of the three methods.

Scenes fall into two families:
- **Continuous/ambient** (`flow`, `network`, `globe`, `accelerate`): particles in perpetual motion, no fixed "shape."
- **Assemble → hold → break-apart → reassemble morph cycles** (`morph`, `ai-net`, `cloud-tiers`, `data-grid`, `it-modules`, `program-timeline`, `products-morph`): a fixed-size particle set eases between named target shapes on a timeline of `{type:'hold'|'morph', dur, ...}` entries. These share three helpers worth knowing before adding another one:
  - `_silhouettePts(N, x0,y0,x1,y1, inFn, edgeFrac)` — bins a shape's bounding box into a grid and samples points biased toward the boundary of `inFn`. This is what makes a sparse dot count read as a recognizable outline instead of a fuzzy blob; use it for any new silhouette-style shape.
  - `_scatterPts(pts)` — pushes a shape's points radially outward from center, used as the mid-transition "explosion" waypoint between two assembled shapes.
  - `_jit(x, y, ph, amp)` — small continuous per-point sinusoidal drift applied only at draw time (never mutates simulation state), so held shapes stay recognizable but nothing sits perfectly frozen.

`PageHeader` (`lib/ui.jsx`) is the shared dark hero band on every inner page and just forwards its `graphic` prop straight to `<Viz scene={graphic}>`; `IC.solutionScene`/`IC.productScene` is what picks the scene per id. `graphicHeight`/`graphicCols` size the hero's layout grid; `graphicScale` (>1) lets the canvas visually bleed larger than its grid cell via an absolutely-positioned overlay *without* growing the hero band's own height — the section still clips at `overflow:hidden` as a safety net.

### Other visual systems (don't confuse with `canvasviz.jsx`)

- `lib/visuals.jsx` (`BrandHeroViz`, `ProductViz`) and `lib/solmotifs.jsx` (`SolutionMotif`) are hand-authored static SVG + CSS-animation graphics — an older, different approach (declarative SVG paths with CSS keyframe classes like `ic-pulse`/`ic-trace`/`ic-breathe`) still used for some card/motif art, not the canvas particle engine.
- `lib/tweaks-panel.jsx` is dev-only scaffolding (a generic "live tweak" panel + host protocol for an external edit-mode tool) only loaded by `index.html`, used on the home page to live-adjust hero settings during development. It's infrastructure, not site content.

## Design & stylistic preferences

Things the project owner has explicitly corrected or asked for during development — apply these on future work even when not restated.

- **Alternate band colors down the page.** Inner pages built from a sequence of full-width `Band` components (`lib/ui.jsx`, toggled via its `dark` prop) should default to alternating light/dark rhythm — light, dark, light, dark. `pages/solution.jsx` is the reference: Why It Matters=light, Our Expertise=dark, Our Advantage=light, The Outcome=dark. A thin utility row (e.g. a plain "back to X" link) isn't a content band and doesn't need to participate. When adding/removing/reordering bands on any page, re-check the alternation instead of leaving everything light.

- **Canvas-scene shapes must read instantly, with no explanation needed.** In `lib/canvasviz.jsx`'s morph-family scenes (`morph`, `ai-net`, `cloud-tiers`, `data-grid`, `it-modules`, `program-timeline`, `products-morph`), each assembled shape must be large and bold enough that a viewer immediately recognizes the real-world thing it represents — a server rack looks like a server rack, a cloud like a cloud, a line graph like a line graph. Err toward bigger/simpler/higher-contrast over subtle or abstract. (Direct correction after an earlier pass shipped shapes that were technically correct in code but not recognizable on screen.)

- **Grow the graphic's container, not the hero band.** When a hero visual needs more room, use `PageHeader`'s `graphicScale` prop (`lib/ui.jsx`) — it enlarges the `<Viz>` canvas via an absolutely-positioned overlay that bleeds bigger without affecting the grid row's height. Reserve `graphicHeight`/`graphicCols` for actual layout-track sizing and watch that they don't inadvertently grow the band itself.

- **Every particle/dot scene needs continuous real motion.** A scene that only holds a static assembled shape — even a geometrically correct one — reads as "dead." Apply the `_jit()` helper (small continuous per-point sinusoidal drift, applied at draw time only, never mutating simulation state) to every point drawn, so held/assembled shapes stay recognizable but nothing ever sits perfectly frozen. (Direct correction after an earlier pass only pulsed size/opacity with no positional movement.)

- **Shape/motif reuse across pages is a judgment call, not a fixed rule.** The owner has gone back and forth on this explicitly — at one point asking for a visually distinct concept per solution page with no shared imagery, later explicitly asking for a shared cloud-silhouette motif reused between the Solutions Overview page and the Cloud & Infrastructure solution page. Default to a distinct concept per page unless told otherwise, but don't treat "no reuse" as absolute if reusing a motif communicates the underlying content better.

- **Prefer real content over invented filler.** Same instinct as the copy rule above (source solution-page text from the client's live site verbatim) applies to visual concepts: prefer a motif that reflects something concrete and true about the product/solution over decorative abstraction.
