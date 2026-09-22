# Ripple Effect of News

Hand-traced causal chains behind the headlines. Each story is a curated graph: event → drivers → response → human systems → economy, with evidence strength visible on every link.

**Live:** https://ripple-effect-of-news.vercel.app  
**Repo:** https://github.com/Girish-shedge/Ripple-Effect-of-News

---

## Stack

| Layer | Choice |
|-------|--------|
| App | Vite + React 18 + TypeScript |
| Style | `src/styles.css` (Geist / Geist Mono) |
| Data | Static JSON in `public/data/` |
| Media | Local watercolor PNGs in `public/media/` |
| Deploy | Vercel (`npm run build` → `dist/`) |

No backend, auth, or database.

## Local development

```bash
npm install
npm run dev                 # http://localhost:5173
npm run build
```

Optional pipelines:

```bash
npm run fetch:news
npm run media:sync
npm run media:watercolor
npm run fetch:stories
npm run pipeline
```

## Deploy

GitHub repo: [Girish-shedge/Ripple-Effect-of-News](https://github.com/Girish-shedge/Ripple-Effect-of-News). Production is the Vercel project `ripple-effect-of-news`.

```bash
npx vercel --prod --yes
```

Pushes to `main` also deploy when the GitHub repo is connected in the Vercel dashboard. SPA fallback and the Yahoo Finance ticker proxy live in `vercel.json`.

## Responsive layout

The same single-column reader and ranked home grid reflow across viewports. No horizontal overflow; ticker and filters stay usable on a 360px phone.

| Width | Home | Detail |
|-------|------|--------|
| ≥1280 | 4-col ranked bento | 66ch column |
| 1100–1279 | 2-col; featured tiles full width | 66ch column |
| 721–1099 | 2-col (1-col below 640) | 2-col reach/timeline down to 720 |
| ≤720 | Full-width filters; icon-only theme toggle; 44px tap targets | 1-col reach/timeline; 16:9 hero video |

Safe-area insets apply on notched phones (`viewport-fit=cover`).

## Documentation for agents / new chats

Read in this order:

1. **`rules.md`** — standing UI/content/engineering rules (do not reverse without an explicit ask)
2. **`project.md`** — product surface, routes, data model, repo map, deploy notes
3. **`ripple-content-style-guide.md`** — voice and narrative shape
4. **`ripple-trusted-sources.md`** — citation / fetch policy
5. **`ripple-mvp-nepal-spec.md`** — evidence model / schema

## Product surface

| Route | Role |
|-------|------|
| `/` | Ranked bento catalog + Region · Theme · Year filters |
| `/story/:id` | Single-column detail reader (~66ch); first section is a muted YouTube clip |

Site chrome: yellow stock marquee (Nifty 50, Sensex, S&P 500, Dow, Nasdaq; no India/USA labels) + home icon + dark/light toggle.

## License

Private product exploration unless otherwise noted. Sources remain copyright of their publishers; cite via Verified sources links.
