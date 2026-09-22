# Ripple — Project Context

> **For agents / new chats:** Read **`rules.md`** first, then this file. Voice: `ripple-content-style-guide.md`. Trusted fetch policy: `ripple-trusted-sources.md`. Schema: `ripple-mvp-nepal-spec.md`.

---

## 1. What this product is

**Ripple** is a causal-chain news explorer. Each story is a hand-curated graph: event → drivers → physical/ecological response → human systems → economy, with every link tagged by evidence strength and traceable to a named source.

It is **not**:
- An automated news-ingestion pipeline (yet)
- A global knowledge graph UI
- The **Seasons / Phenology / Ecosystems Explorer** — separate product; do not merge codebases

**Brand:** “Ripple” — news that still ripples.  
**Promise:** Readable for non-experts; uncertainty stays visible.

---

## 2. Product surface (UI)

| Route | Component | Role |
|-------|-----------|------|
| `/` | `NewsListPage` | Catalog grid + dropdown filters |
| `/story/:id` | `StoryDetailRoute` → `StoryDetailPage` | Single-column article reader |

### Home (`NewsListPage.tsx`)
- Cards in a **ranked bento grid** (4-col desktop ≥1100px; 2-col tablet with featured tiles full width; 1-col below 640px). Rank 1 is the top-left featured tile; rank 2 is the bottom-right featured tile.
- Sort by explicit `rank` on each catalog item (fallback: recency + theme). Helpers: `catalogRank` / `rankStories` / `catalogSlot`.
- Card: image → date → heading → subheading → location.
- **Filters (dropdowns):** Region · Theme · Year — **label inside the control** (`Region: All`); Clear. Row is **centered**. **No** match count. **No** extra uppercase Ripple wordmark.
- **No** AI badge on home images. Click → `/story/:id`.
- Helpers: `catalogRegion` / `catalogTheme` / `catalogYear` in the same file.

### Detail (`StoryDetailPage.tsx` + `buildStorySections.tsx`)
- Column **≈66ch**. Yellow **stock marquee** (Nifty 50, Sensex, S&P 500, Dow, Nasdaq; no India/USA labels; dot-separated, seamless loop, live quotes) with a **Ripple** home link and **dark/light toggle** above everything (`MarketMarquee.tsx`). **No Back button** on detail pages.
- Per section: 16:9 watercolor → 10px UPPERCASE → heading → one factual paragraph (complete-phrase bold only; skip boilerplate) → widgets → blue Verified sources (**all** sources).
- **Hero exception:** first section media is a short muted autoplaying YouTube player (`StoryHeroMedia` + `src/lib/heroVideos.ts`), from a named trusted outlet. Later sections stay watercolor.
- Hero teaser = event summary only. Reach/timeline teasers from this story’s figures and dates.
- Chain paragraphs carry mechanistic detail, especially causes. No “this page walks…” or “Open Verified sources…” copy.
- Honesty: **What we know** then **What remains uncertain**, stacked point lists (`.knowledge-stack`).
- Detail AI badge: **“AI generated”**, 25% white fill, 16px inset. **No** credits under images.
- Reach: numbers (`StoryReachCharts`) only; no evidence-count tiles. Over time: 2-col `TimelineStrip`. Chain kicker: `relationship · evidence` + info. Claims: text + optional caveat.
- Evidence badge tooltips via Hugeicons info (`EvidenceBadge.tsx`).

### Section order
1. Started from  
2. Reach  
3. Over time  
4. Looking ahead (if predictions)  
5. Causal chain (one section per node; causes written in extra detail)
6. What we know, then what remains uncertain (stacked lists)
7. Source index

---

## 3. Tech stack

| Layer | Choice |
|-------|--------|
| App | Vite + React 18 + TypeScript |
| Style | `src/styles.css` only |
| Fonts | Geist + Geist Mono (uppercase ≈10px) under `public/fonts/` |
| Icons | Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) via `src/components/icons.tsx` |
| Data | Static JSON in `public/data/` |
| Media | `public/media/wc-*.png` watercolors (16:9) |
| Reach | Plain numbers (Recharts may remain in package.json unused for charts) |
| Deploy | `npm run build` → `dist/` |

**No backend / auth / database.**

```bash
npm install
npm run dev                 # http://localhost:5173
npm run build
npm run fetch:news
npm run media:sync
npm run media:watercolor    # apply wc-*.png into catalog + story media[]
npm run fetch:stories
npm run pipeline
```

Scripts of note:
- `scripts/watercolor-media.mjs` — shared watercolor style + credits
- `scripts/apply-watercolor-media.mjs` — wire files into JSON
- `scripts/cache-images.mjs` / `ensure-local-media.mjs` — place-correct Commons/local covers
- `scripts/fetch-news-pipeline.mjs` / `fetch-all.mjs`

---

## 4. Repo map

```
Phenology 101/          (folder name historical; product is Ripple)
├── rules.md
├── project.md
├── ripple-content-style-guide.md
├── ripple-trusted-sources.md
├── ripple-mvp-nepal-spec.md
├── package.json
├── public/
│   ├── data/           stories.json + per-story JSON + _inbox/_cache
│   ├── media/          wc-*.png watercolors (+ legacy assets)
│   └── fonts/
├── scripts/
└── src/
    ├── App.tsx
    ├── types.ts
    ├── styles.css
    ├── lib/format.ts
    ├── lib/theme.tsx
    ├── lib/heroVideos.ts
    └── components/
        ├── NewsListPage.tsx
        ├── MarketMarquee.tsx
        ├── StoryDetailPage.tsx
        ├── StoryDetailRoute.tsx
        ├── StoryHeroMedia.tsx
        ├── buildStorySections.tsx
        ├── icons.tsx
        ├── EvidenceBadge.tsx
        ├── StoryReachCharts.tsx
        ├── TimelineStrip.tsx
        ├── PredictionsPanel.tsx
        ├── SourceIndex.tsx
        └── MediaFigure.tsx
```

---

## 5. Data model (summary)

Types: `src/types.ts`.

### Catalog (`public/data/stories.json`)
`StoryCatalogItem`: `id`, `data_file`, `date`, `headline`, `subheading`, `location`, `image_url`, `image_alt`, optional **`region`**, **`theme`**, **`rank`**.

### Story JSON
`event`, `nodes[]`, `edges[]`, `claims[]`, `sources[]`, `impacts[]`, `timeline[]`, `knowledge_summary`, `evidence_legend`, `media[]`, `chart`, `predictions[]`, optional `news[]` / `provenance`.

**Media:** prefer `imagery_type: "watercolor_illustration"`, `fetched_from: "ripple_ai_watercolor"`, files `/media/wc-<short>-<slot>.png`. Slots: `cover|hero|reach|timeline|predictions|knowledge|sources|<nodeId>`.

**Evidence levels:** `observed` | `strongly_supported` | `attribution` | `plausible` | `emerging` | `unknown` — never hide unknowns.

---

## 6. Stories in catalog (9)

| id | Region | Theme |
|----|--------|--------|
| `nepal_flood_2026` | South Asia | Climate extremes |
| `europe_heatwave_2026` | Europe | Climate extremes |
| `iberia_wildfires_2025` | Europe | Climate extremes |
| `south_asia_heat_2026` | South Asia | Climate extremes |
| `reliance_ai_datacentre_2026` | South Asia | Technology & energy |
| `global_inflation_2022` | Global | Economy & food |
| `aral_sea_desiccation` | Central Asia | Water & land |
| `deepwater_horizon_2010` | Americas | Pollution & health |
| `bhopal_1984` | South Asia | Pollution & health |

---

## 7. Media rules (critical)

1. Display **watercolor only** on home + detail (convert source photos; do not show raw JPG as the section hero).
2. Same style + grain everywhere (`WATERCOLOR_STYLE` in `scripts/watercolor-media.mjs`).
3. Context must match the section/card — no irrelevant scenery.
4. Every section and every home card must have an image; no duplicates on a detail page.
5. Place-correct only (never Europe→Himalaya, etc.).
6. After adding PNGs: `npm run media:watercolor`.

---

## 8. How to add a new story

1. Author `public/data/<id>.json` (`Story` type).
2. Add catalog row in `stories.json` with `region`, `theme`, dates, copy.
3. Generate `wc-<short>-*.png` watercolors for cover + every section slot.
4. `npm run media:watercolor` then optionally `npm run fetch:stories`.
5. `npm run build`; spot-check home filters + detail sections.

---

## 9. Design system notes

- CSS vars in `src/styles.css` (`--paper`, `--ink`, evidence colors, `--image-ratio: 16 / 9`).
- Perfect-fourth type; 8-pt spacing; section padding 64px with border-top.
- Avoid purple-on-white clichés, heavy hero chrome, and em dashes. Corner radius **4px**.

---

## 10. Decisions already made (don’t reopen unless asked)

- Single reading column (no Timeline / TOC / sources rails).
- Home = ranked bento grid + Region/Theme/Year dropdowns with labels inside the control (`Region: All`), centered (not horizontal scroll).
- Watercolor-only imagery + “AI generated” badge on detail only (25% fill); no image credits.
- 66ch reading measure; 10px uppercase; 16:9; 2-col timeline; number reach; simplified claims.
- No Back button on detail; section lines; scroll blur→reveal; Hugeicons only.
- Corner radius **4px**.
- Responsive: 640 / 720 / 900 / 1100 / 1280+; phone 1-col home; icon-only theme toggle under 720px; 44px tap targets; safe-area insets.
- Unknown evidence stays visible; predictions labeled `emerging`.
- Standing rules in `rules.md` — do not reverse without an explicit user ask.

---

## 11. GitHub + Vercel (shipping)

| Item | Value |
|------|--------|
| GitHub (public) | https://github.com/Girish-shedge/Ripple-Effect-of-News |
| Owner | [Girish-shedge](https://github.com/Girish-shedge) |
| Production | https://ripple-effect-of-news.vercel.app |
| Vercel project | `ripple-effect-of-news` (team: Girish Shedge's projects) |
| Build | `npm run build` → `dist/` |
| Config | `vercel.json` — SPA fallback + `/api/yahoo/*` proxy to Yahoo Finance |

Deploy / re-deploy from this folder:

```bash
npx vercel --prod --yes
```

Or connect the GitHub repo in the Vercel dashboard so pushes to `main` auto-deploy.

**New chat handoff:** Read `rules.md` → this file → content style guide. Do not merge with Seasons / Phenology Explorer. Prefer local `wc-*.png` media. Do not reverse standing UI/content rules unless the user explicitly asks.

---

## 12. Open / future (not built)

- Automated live news ingestion
- Global knowledge graph UI
- Seasons Explorer as live phenology evidence
- Richer per-story photography beyond watercolor

---

## 13. Quick agent checklist

- [ ] Followed `rules.md` + content style guide
- [ ] Home: ranked bento, filters work, no AI badges on cards, no extra Ripple wordmark, no match count
- [ ] Detail: every section has unique watercolor; AI badge; no credits
- [ ] 66ch prose; 10px uppercase; 16:9; 2-col timeline; simplified claims
- [ ] No Back button on detail; blur-reveal; Hugeicons; no em dashes / heading highlights; 4px radius
- [ ] Yellow ticker (dots, no India/USA labels, seamless loop, live) + home icon + dark/light toggle
- [ ] Responsive on phone / tablet / desktop; no horizontal overflow
- [ ] Detail copy has no banned boilerplate; honesty lists are stacked
- [ ] `npm run build` passes
- [ ] New stories have `region`/`theme` + `wc-*` media wired
- [ ] GitHub remote + Vercel production URL stay in sync in this file / README

---

*Last updated: 2026-09-22 — responsive viewports; ranked bento home; 4px radius; marquee without region labels.*
