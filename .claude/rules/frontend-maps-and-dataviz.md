---
description: MapLibre via react-map-gl, and d3 for maths with React owning the DOM.
paths:
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.ts"
---

# Frontend — maps and data visualisation

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend`. **Locked:** `maplibre-gl@5.24.0`, `react-map-gl@8.1.1`, `@turf/centroid@7.3.5`, `d3@7.9.0` (+ `@types/d3@7.4.3`), `react-zoom-pan-pinch@4.0.3`, `html-to-image@1.11.13`. `[manifest]`

> Map style URL, tile provider, and what the visualisations depict are deliberately out of scope here. This file governs library usage, not cartography or the data domain.

## MapLibre, not Mapbox

- The map engine is **`maplibre-gl@5`**. Import from the MapLibre entrypoint: `[manifest]`+`[upstream]`

  ```tsx
  import Map from 'react-map-gl/maplibre';
  import 'maplibre-gl/dist/maplibre-gl.css';
  ```
- `react-map-gl@8` selects the engine **by import path** (`react-map-gl/maplibre` vs `react-map-gl/mapbox`). Do not import from the bare `react-map-gl` root and do not pass a `mapLib` prop. `[upstream]`
- **The stylesheet is mandatory.** Without `maplibre-gl.css` the controls and canvas render wrong in ways that look like layout bugs. `[upstream]`
- Nothing Mapbox-branded is installed and no Mapbox token exists here. Mapbox-specific examples, styles, and props do not apply. `[manifest]`

## Map state

- Prefer **uncontrolled** state via `initialViewState`. Only lift to a controlled `viewState` + `onMove` when something outside the map genuinely needs to drive the camera — controlled mode re-renders the React tree on every frame of a pan. `[upstream]`+`[principle]`

  ```tsx
  <Map
    initialViewState={{ longitude: 0, latitude: 0, zoom: 3 }}
    mapStyle={styleUrl}
    style={{ width: '100%', height: '100%' }}
  />
  ```
- The map is a client-only component: it needs the DOM and WebGL. Mark it `'use client'` and keep it out of the server render path. `[principle]`
- `maplibre-gl` is large. Load the map component lazily so it does not sit in the initial bundle of pages that do not show a map. `[principle]`

## Map data

- Pass GeoJSON to `<Source>`/`<Layer>` and let MapLibre draw it. Do not render one React marker per feature for large collections — hundreds of DOM nodes tracking a moving camera will drop frames. Reserve markers for a handful of genuinely interactive pins. `[principle]`
- Memoise GeoJSON objects and layer style objects. A new object identity each render forces MapLibre to re-diff the source. `[principle]`
- `@turf/centroid` is the only Turf module installed — a single-purpose geometry helper. If you need more Turf functionality, add the specific `@turf/*` module rather than the `@turf/turf` bundle. `[manifest]`+`[principle]`
- Compute geometry once (in a memo, or server-side) rather than per render. `[principle]`

## d3

- `d3@7` is installed as the **full** bundle. Import from the specific package where you can — `import { scaleLinear } from 'd3-scale'` — so the rest is never in the graph. `[manifest]`+`[principle]`
- **`import * as d3` versus named imports from `d3` is not the lever.** Measured on the locked toolchain, converting all six namespace importers to named imports moved total chunk bytes by **+24** (2,817,036 → 2,817,060) — webpack tree-shakes a namespace import with static property access identically. What actually cost 213.7 KB was the barrel-import chain that pulled `features/charts` into eight routes rendering no chart; fixing that is a boundary problem, not an import-style one. `[manifest]`+`[principle]`
- **Use d3 for maths, React for the DOM.** Scales, shape generators, axes-as-data, interpolators, hierarchies and force layouts are d3's job; producing `<path>`/`<g>` elements is React's. `[principle]`
- Never call `d3.select(...)` on a node React owns. Two libraries mutating the same subtree produce bugs neither can explain. If you must use a d3 DOM module, give it its own container ref that React never renders into. `[principle]`

  ```tsx
  const x = scaleLinear().domain([0, max]).range([0, width]);
  return <g>{items.map((t) => <rect key={t.id} x={x(t.value)} /* … */ />)}</g>;
  ```
- Charts need explicit dimensions. Measure the container with `ResizeObserver` rather than reading layout during render. `[principle]`

## Other libraries

- `react-zoom-pan-pinch` handles zoom/pan for **non-map** content. Do not nest it around the map — MapLibre already owns those gestures, and two gesture handlers on one surface will fight. `[manifest]`+`[principle]`
- `html-to-image` rasterises DOM to an image. It is client-only, it cannot capture WebGL canvas content the way it captures DOM, and cross-origin images taint the canvas and make export fail. Test export against real data, not placeholders. `[manifest]`+`[principle]`

## Accessibility and correctness

- A map or chart is not readable by a screen reader. Provide a text or table equivalent of the same data, and label the region. `[principle]`
- Never encode meaning in colour alone — pair hue with shape, pattern, label, or position. `[principle]`
- Coordinates in this stack are `[longitude, latitude]` in GeoJSON order. Most bugs in mapping code are a swapped pair; assert the order at the boundary where external data enters. `[principle]`
