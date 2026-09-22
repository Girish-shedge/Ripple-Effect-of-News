# Ripple — Standing Rules

> **For agents and humans:** Read this file before any UI or content change. These rules are permanent unless the user explicitly overrides them. Do not ask the user to restate them.

Also read:
- `project.md` — product/engineering context
- `ripple-content-style-guide.md` — voice, narrative arc, evidence phrasing, numbers
- `ripple-trusted-sources.md` — which sources to fetch/cite; no full-text scrape of wire news
- `ripple-mvp-nepal-spec.md` — data/evidence model when changing schema or claims

---

## 1. Product boundary

- This product is **Ripple** (causal-chain news explorer), not the Seasons / Phenology Explorer. Do not merge codebases.
- No backend, auth, or database unless the user explicitly requests it.
- Prefer local `/media/*` (especially `wc-*.png` watercolors) over flaky remote image hosts.

---

## 2. Story detail page layout (hard)

**Single reading column** sized for comfortable reading (**≈66 characters per line**, Bringhurst / Baymard ideal within the 50–75 CPL band). CSS: `max-width: 66ch`. **No sticky side rails** — no Timeline column, no Contents/TOC, no sticky Verified sources rail.

Each section, in order:

1. **Image** (content-width **16:9** AI watercolor; every section must have one)
2. **UPPERCASE** kicker (Geist Mono, **≈10px**). Chain sections: **`relationship · evidence`** + info icon.
3. **Heading** (Geist, ≈32px section titles)
4. **One prose paragraph** (may **bold** complete important phrases: full dates, full numbers with units, full names). Never wrap a fragment or a lone digit. Omit the paragraph if the section is a list or index.
5. Widgets if needed (reach numbers, 2-col timeline, simplified claims)
6. **Verified sources** — blue block, collapsed by default; expand shows **all** section sources

Hard constraints:
- Sections separated by a **horizontal line** with **64px** vertical padding (8-point scale: 8 / 16 / 24 / 32 / 40 / 48 / 56 / 64 / 80…).
- **Typography:** Geist for headings/body; Geist Mono for UPPERCASE; perfect-fourth scale ≈**10 / 13.5 / 18 / 24 / 32px**; body line-height **1.55**.
- **No em dashes** in copy. **No** pastel heading highlights. Corner radius **4px** (`--radius`).
- **Images:** 16:9, `object-fit: cover`, content-width. Later sections stay AI **watercolor + light film grain**. **Hero (first section only):** a short, muted, autoplaying YouTube clip from a named trusted outlet (BBC, Reuters, AP, DW, France 24, USCSB, UNEP). No AI badge on the hero video.
- Detail images only: bottom-right badge — Hugeicons info + **“AI generated”**, white fill **25% opacity**, **16px** from bottom and right. **No** image credits / credit links under images.
- Scroll: sections use **blur → reveal** (`.is-revealed`).
- Reach = **numbers + subheadings** only (no evidence-count tiles). Over time = **2-column** timeline grid.
- Chain kickers: **`relationship · evidence`** (e.g. `The chain begins · Unknown`) plus the Hugeicons info control. Claims = text + optional caveat (no duplicate boxed badge when the kicker already shows the level).
- Evidence badges: Hugeicons **info** control; click opens plain-language meaning tooltip.
- **Icons:** Hugeicons only (`src/components/icons.tsx`).
- Neutral ink/paper greys. No purple/glow chrome. **Dark / light** via `data-theme` and the ticker toggle.
- Responsive across viewports (same single column; no side rails). Breakpoints: **640** phone (1-col home, full-width filters, icon-only theme toggle), **720** story padding + 1-col reach/timeline, **900** reach 2-col, **1100** tablet home (2-col, featured tiles full width), **1280+** desktop bento (4-col). Safe-area insets, 44px tap targets, 16px selects on small screens.
- Site chrome: **yellow stock marquee** (Nifty 50, Sensex, S&P 500, Dow, Nasdaq — **no India/USA labels**) + **home icon** on the left + **theme toggle** on the right of that bar. Quotes are **dot-separated**, **seamless loop**, **live-polled**.
- **No Back button** on detail pages. Home is the ticker home icon (no uppercase RIPPLE wordmark).

---

## 3. Content structure (from `ripple-content-style-guide.md`)

Reading order:

1. **The moment** — Started from (hero). Prose is the event **summary only**.
2. **Reach / over time** — verified numbers and this story’s dated stages
3. **Looking ahead** — predictions if present (`emerging`)
4. **The chain** — one causal node per section; relationship label as kicker; **causes get extra mechanistic detail**
5. **The honesty** — **What we know** stacked above **What remains uncertain**, each as a vertical point list (not a two-column grid)
6. **Sources** — full index (no extra instructional paragraph)

Voice: plain language, active voice, one idea per sentence; never hide **unknown** evidence; verified numbers only; harm factual and restrained.

### Hard content bans (do not generate)

Do **not** write UI instructions, reading guides, or repeated location/date lines. Banned patterns include:

- “this page walks the chain step by step…”
- “Each step names who reported it…”
- “Open Verified sources to check the original link.”
- “Consequences arrive in stages: minutes, days, seasons…”
- “Every ripple has a first hinge…”
- “This step follows because the previous one…”
- “Trust comes from separating settled claims…”
- Repeating the date and place after a summary that already contains them

Hero, reach, and timeline teasers must be **story-specific facts**. Chain paragraphs explain the mechanism. Honesty is the two stacked lists, with no meta intro.

---

## 4. News list page (`/`)

- Heading **“Ripple Effects of News”** + short subheading. **No** extra uppercase “Ripple” wordmark above the heading.
- Cards in a **ranked bento grid** (4 columns on desktop): two featured tiles (rank 1 top-left 2×2, rank 2 bottom-right 2×2) plus smaller cells. Rank comes from explicit `rank` on each `stories.json` item (lower = higher); fallback scores recency + theme. Responsive 2 → 1, featured tiles go full width.
- Card: image → date → heading → subheading → location.
- **Dropdown filters:** Region · Theme · Year. The **label lives inside the closed dropdown** (`Region: All`). Options derived from catalog. **Clear** resets. Filters are **center-aligned**. **No** “N of N” match count.
- **No** horizontal auto-scroll. **No** AI badge on home card images.
- Card click → `/story/:id`.

---

## 4b. Reading measure (psychology)

Body line length **50–75 characters per line**, ideal **≈66ch** (Bringhurst; Baymard). Detail column and prose use `max-width: 66ch`.

---

## 5. File & code naming

- Components: `PascalCase.tsx` (`StoryDetailPage.tsx`).
- Icons: `src/components/icons.tsx`.
- Lib: `src/lib/format.ts`, `src/lib/theme.tsx`
- Update `project.md` when routes or primary files change.

---

## 6. News, media & facts pipeline (hard)

Follow **`ripple-trusted-sources.md`**:

1. Prefer **Tier 1** for facts/numbers.
2. **Tier 2** for attribution framing when Tier 1 lacks it.
3. **Tier 3** only via GDELT metadata — **never scrape full article text**.
4. Every source: organization, title, URL, publication date, retrieval date.

Commands:
```bash
npm run fetch:news         # discover → public/data/_inbox/
npm run media:sync         # Commons cache + place-correct covers
npm run media:watercolor   # wire wc-*.png into stories.json + story media[]
npm run fetch:stories      # HEAD-check sources
npm run pipeline           # news → media → verify
```

**Image place rule:** Never remap Story A to a photo/watercolor of Place B.

**Watercolor workflow:** Generate place-correct 16:9 watercolors → save as `public/media/wc-<short>-<slot>.png` → `npm run media:watercolor`. Style template: `scripts/watercolor-media.mjs`.

---

## 7. Shipping checklist

- [ ] `npm run build` passes
- [ ] Every detail section + home card has a unique place-correct watercolor
- [ ] Verified sources expand **all** section sources; no sticky rails
- [ ] Home: ranked bento grid + Region/Theme/Year dropdowns with labels inside (`Region: All`), centered; no AI badges; no “N of N”; no extra Ripple wordmark
- [ ] Detail: “AI generated” badge at 25% white fill; no image credits; no Back button
- [ ] Prose ≈66ch; uppercase ≈10px; 16:9; 2-col timeline; simplified claims
- [ ] Scroll blur→reveal; section lines; Hugeicons only
- [ ] Yellow stock marquee (dot-separated, no India/USA labels, seamless loop, live quotes) + home icon + dark/light toggle
- [ ] Responsive: phone / tablet / desktop; no horizontal overflow; filters and ticker usable on 360px
- [ ] No heading highlights; **4px** radius; no em dashes; 8-pt spacing
- [ ] No banned boilerplate teasers; honesty lists stacked; causes written in detail
- [ ] Claims cite Tier 1 (or documented Tier 2); copy follows content style guide
- [ ] These rules were not silently reversed

---

*Last updated: 2026-09-22 — responsive viewports; ranked bento home; 4px radius; marquee without region labels.*
