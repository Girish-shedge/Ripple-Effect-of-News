# News inbox

Output of `npm run fetch:news` (`scripts/fetch-news-pipeline.mjs`).

- `news-candidates.json` — discovered events/coverage (Tier 1 APIs + GDELT metadata)
- `last-news-fetch-summary.json` — short counts + sample titles

**Policy:** `ripple-trusted-sources.md`

Do **not** paste full wire-service article text into story JSON. Curate facts from Tier 1 (or Tier 2 for attribution), then seed a story and run `npm run media:sync` + `npm run fetch:stories`.
