# Ripple — Trusted Source Tiers (for automated fetch / verification)

Reference list for Cursor: which sources to pull from, how (API vs. manual), and what NOT to scrape.

**Hard rule for the build:** Do not scrape full article text from paywalled or copyrighted news sources (Tier 3 in particular). Use their metadata via GDELT for discovery, and pull underlying facts/numbers from the Tier 1 primary source they're reporting on instead. Never store or reproduce copyrighted article text in the app's database — store the fact, the source name, the URL, and the date, not the article's prose.

---

## Tier 1 — Primary scientific / institutional sources (highest reliability, use for actual claims and numbers)

| Source | URL | Access method | Notes |
|---|---|---|---|
| NASA EONET | https://eonet.gsfc.nasa.gov/ | Free API, no key | Live natural events: wildfires, floods, storms, volcanoes |
| NASA POWER | https://power.larc.nasa.gov/ | Free API, no key | Solar/climate/agroclimatology data |
| NOAA (general) | https://www.noaa.gov/ | Mostly free APIs, varies by product | Climate/weather data |
| NOAA Coral Reef Watch | https://coralreefwatch.noaa.gov/ | Free, via ERDDAP | Bleaching alerts, sea-surface temp |
| USGS Earthquake API | https://earthquake.usgs.gov/fdsnws/event/1/ | Free API, no key | Real-time + historical seismic data |
| Open-Meteo | https://open-meteo.com/ | Free API, no key | Historical climate data back to 1940 |
| GBIF | https://www.gbif.org/developer/summary | Free API, no key | Species occurrence records |
| iNaturalist | https://api.inaturalist.org/v1/docs/ | Free API, no key | Phenology-annotated observations |
| eBird | https://documenter.getpostman.com/view/664302/S1ENwy59 | Free API, requires free key | Bird abundance/timing |
| OBIS | https://api.obis.org/ | Free API, no key | Marine species occurrence |
| ReliefWeb (UN OCHA) | https://apidoc.rwlabs.org/ | Free API, no key (rate-limited ~1000/day) | Disaster situation reports, damage assessments |
| GDACS | https://www.gdacs.org/ | Free API | Real-time disaster alerts with severity scoring |
| FAOSTAT | https://www.fao.org/faostat/en/#data | Free API | Crop production/loss data |
| World Bank Open Data | https://data.worldbank.org/ | Free API | Country economic/environmental indicators |
| WHO Global Health Observatory | https://www.who.int/data/gho/info/gho-odata-api | Free API | Health data |
| IPCC | https://www.ipcc.ch/ | No API — reports are PDF | Manual citation of specific assessment reports |
| IPBES | https://www.ipbes.net/ | No API — reports are PDF | Manual citation |
| WMO | https://public.wmo.int/en | Mostly PDF/press releases | Manual citation |
| Peer-reviewed journals (Nature, Science, The Lancet, PNAS) | via publisher sites / DOI | No scraping — use DOI + abstract only | Never store full paywalled paper text; cite DOI and a short paraphrase of the finding |

---

## Tier 2 — Specialist data/climate journalism (rigorous methodology, narrower scope)

| Source | URL | Access method | Notes |
|---|---|---|---|
| Carbon Brief | https://www.carbonbrief.org/ | No public API — manual lookup only | Do not scrape; read and manually cite specific articles/data visualizations, especially their climate attribution mapping work |
| World Weather Attribution | https://www.worldweatherattribution.org/ | No API — publishes studies as reports | Manual lookup; check for a study on a specific event before labeling any claim "attribution" |

---

## Tier 3 — Wire services / major outlets (use for event discovery/timing ONLY, not as a cited data source)

| Source | Discovery method | Notes |
|---|---|---|
| Reuters | Via GDELT (https://www.gdeltproject.org/) | Do not scrape reuters.com directly — licensed/paywalled content |
| AP | Via GDELT | Same — use AP Fact Check page manually if needed, don't scrape wire content |
| AFP | Via GDELT | Same |
| BBC News | Via GDELT or BBC's own limited public feeds | BBC has some open RSS feeds; check current terms before pulling |

**GDELT itself:** https://api.gdeltproject.org/api/v2/doc/doc — free, no key, rate-limited (~1 request/5 sec). Use this to answer "did outlets cover this event, when, roughly how much" — then go find the Tier 1 source behind whatever number is being reported.

---

## Tier 4 — Fact-checking infrastructure (verification only, not primary sourcing)

| Source | URL | Notes |
|---|---|---|
| International Fact-Checking Network (IFCN) signatories directory | https://www.poynter.org/ifcn/ | Directory of vetted fact-checkers, for cross-checking a specific claim |
| Reuters Fact Check | via GDELT discovery, manual read | Don't scrape full text |
| AP Fact Check | via GDELT discovery, manual read | Don't scrape full text |

---

## Instructions for Cursor

1. For any Ripple claim, first check Tier 1 for a direct primary source. Prefer their APIs where listed.
2. Only fall back to Tier 2 (Carbon Brief, WWA) for climate-attribution-specific framing not available from a Tier 1 body.
3. Use Tier 3 exclusively through GDELT metadata (headline, outlet, date, URL) to confirm an event was reported and when — never ingest or store full article text from these.
4. Use Tier 4 only to double-check a claim that's already circulating, never as the origin of a new claim.
5. Every stored claim/source record must include: organization, title, URL, publication date, and retrieval date — no exceptions, no placeholders in production data (per the MVP spec's sourcing rule).
