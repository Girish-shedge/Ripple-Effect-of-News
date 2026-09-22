# Ripple Effect of News

Hand-traced causal chains behind the headlines. Each story is a curated graph: event → drivers → response → human systems → economy, with evidence strength visible on every link.

**Live:** (set after Vercel deploy)  
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
| `/` | Catalog grid + Region · Theme · Year filters |
| `/story/:id` | Single-column detail reader (~66ch) |

Site chrome: yellow India/USA stock marquee + dark/light toggle.

## License

Private product exploration unless otherwise noted. Sources remain copyright of their publishers; cite via Verified sources links.
