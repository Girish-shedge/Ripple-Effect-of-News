# Ripple — MVP Build Spec: The Nepal Flood Story

## 1. What this build is

A single, fully-realized causal-chain story — the August 2026 Nepal flash flood — built end to end: event → environmental driver → ecological/physical response → human systems → economy, with every link tagged by evidence strength and traceable to a real source.

This is **not** the automated news-ingestion pipeline. This is **not** the global knowledge graph. This is one story, built by hand, done extremely well, to prove the interaction model and the evidence-integrity system before anything gets automated. If this one story doesn't feel compelling and trustworthy, automating it 500 times over would just scale the problem.

**This project is separate from the Seasons & Ecosystems Explorer** (the country/month/species map project). Don't merge them or reuse that codebase. The one intentional link: later, once the Seasons Explorer is generating real phenology deltas, Ripple's phenology-related claims should be able to cite it as a live evidence source instead of a static academic citation. Not needed for this build — just don't architect anything that would make that impossible later.

---

## 2. Core interaction model

A single vertical (or horizontal, decide during build — vertical is likely stronger on mobile) chain of connected cards, each representing one node in the causal chain:

```
[Human-caused warming]
        ↓  (evidence: attribution)
[Glacier / high-altitude instability]
        ↓  (evidence: attribution)
[Ice + rock collapse]
        ↓  (evidence: observed)
[Temporary river blockage / sudden release]
        ↓  (evidence: observed)
[Flash flood]
        ↓  (evidence: observed)
[Infrastructure + agricultural damage]
        ↓  (evidence: observed — preliminary assessment)
[Food production loss]
        ↓  (evidence: observed — preliminary assessment)
[Livelihood impacts]
        ↓  (evidence: plausible)
[Potential economic effects]
        ↓  (evidence: unknown / not yet established)
```

### Node card (collapsed state)
- Title (e.g. "Flash flood")
- One-line description
- Evidence-level badge (color + label — see Section 4)
- Small connector arrow to next node, labeled with the relationship type (e.g. "triggers," "contributes to," "potentially affects")

### Node card (expanded state — on click)
- Full evidence card:
  - The claim, in plain language
  - Evidence level + what that level means (a one-line definition, since most users won't know the taxonomy on sight)
  - Source(s): organization, title, publication date, URL
  - Geographic scope
  - Methodology / assessment status (e.g. "preliminary," "final," "peer-reviewed")
  - Last verified timestamp
  - Explicit caveat text where relevant (e.g. "Climate change was not identified as the sole cause; geological factors and prior earthquake damage also contributed.")
- "View source →" — opens the original source URL
- If the node has more than one supporting/relevant source, show all of them, not just one

### Top of story
- Hero: "A mountain moved. What happened next?"
- Event metadata: date, location, one-paragraph summary
- Timeline strip (Section 6 below) sitting above or beside the chain

### Bottom of story
- "The ripple doesn't stop at the flood."
- "What we know" / "What remains uncertain" — a short explicit summary pulling together the evidence-level badges across the whole chain (this is Section 23's "Click 'What do we know?'" / "What don't we know?" interaction, surfaced automatically rather than requiring a click, so uncertainty is visible without extra effort)
- CTA: "Explore another ripple" (disabled/placeholder for MVP — there's only one story)

---

## 3. Data model

This is a graph, not a flat article. Build it as such even for one story — the schema needs to support many stories later without a rewrite.

```json
{
  "event": {
    "id": "nepal_flood_2026",
    "title": "Nepal flash flood — Bhote Koshi–Trishuli corridor",
    "date": "2026-08-26",
    "location": {
      "country": "Nepal",
      "region": "Bhote Koshi–Trishuli river corridor",
      "lat": 27.9,
      "lng": 85.4
    },
    "summary": "A catastrophic flash flood, potentially associated with an ice avalanche and temporary damming of the Lhende River, struck Nepal's Bhote Koshi–Trishuli corridor in August 2026."
  },
  "nodes": [
    {
      "id": "warming",
      "type": "climate_driver",
      "title": "Human-caused warming",
      "description": "Long-term global warming attributable to human greenhouse gas emissions."
    },
    {
      "id": "mountain_instability",
      "type": "environment",
      "title": "Glacier / high-altitude frozen ground changes",
      "description": "Changes in glacier mass and permafrost that can increase mountain slope instability."
    },
    {
      "id": "collapse",
      "type": "hazard",
      "title": "Ice + rock collapse",
      "description": "A collapse event in the high-altitude terrain above the river corridor."
    },
    {
      "id": "flood",
      "type": "hazard",
      "title": "Flash flood",
      "description": "A sudden, high-volume flood following temporary river blockage and release."
    },
    {
      "id": "infrastructure_ag_damage",
      "type": "human_system",
      "title": "Infrastructure + agricultural damage",
      "description": "Damage to hydropower stations, farmland, and rural infrastructure in affected municipalities."
    },
    {
      "id": "food_production_loss",
      "type": "human_system",
      "title": "Food production loss",
      "description": "Reduced rice and crop yield in the affected agricultural areas."
    },
    {
      "id": "livelihoods",
      "type": "human_system",
      "title": "Livelihood impacts",
      "description": "Effects on farmer and local household income and food security."
    },
    {
      "id": "economic_effects",
      "type": "economy",
      "title": "Potential economic effects",
      "description": "Broader economic consequences — not yet established with evidence specific to this event."
    }
  ],
  "edges": [
    {
      "from": "warming",
      "to": "mountain_instability",
      "relationship": "contributing_factor",
      "evidence_level": "attribution",
      "claim_ids": ["claim_warming_instability"]
    },
    {
      "from": "mountain_instability",
      "to": "collapse",
      "relationship": "increases_risk_of",
      "evidence_level": "plausible",
      "claim_ids": ["claim_instability_collapse"]
    },
    {
      "from": "collapse",
      "to": "flood",
      "relationship": "triggers",
      "evidence_level": "observed",
      "claim_ids": ["claim_collapse_flood"]
    },
    {
      "from": "flood",
      "to": "infrastructure_ag_damage",
      "relationship": "causes",
      "evidence_level": "observed",
      "claim_ids": ["claim_flood_damage"]
    },
    {
      "from": "infrastructure_ag_damage",
      "to": "food_production_loss",
      "relationship": "results_in",
      "evidence_level": "observed",
      "claim_ids": ["claim_damage_food_loss"]
    },
    {
      "from": "food_production_loss",
      "to": "livelihoods",
      "relationship": "potentially_affects",
      "evidence_level": "plausible",
      "claim_ids": ["claim_food_loss_livelihoods"]
    },
    {
      "from": "livelihoods",
      "to": "economic_effects",
      "relationship": "uncertain_relationship",
      "evidence_level": "unknown",
      "claim_ids": []
    }
  ],
  "claims": [
    {
      "id": "claim_warming_instability",
      "text": "Human-caused warming likely contributed to conditions that made high-altitude glacier/rock instability more likely in this region.",
      "claim_type": "attribution",
      "evidence_level": "attribution",
      "sources": ["source_wwa_or_equivalent"],
      "geographic_scope": "Bhote Koshi–Trishuli corridor, Nepal",
      "temporal_scope": "2026",
      "caveat": "Climate change was not identified as the sole cause; geological factors, including the legacy of major earthquakes, also contributed."
    },
    {
      "id": "claim_flood_damage",
      "text": "Approximately 1,800 hectares of crops were reported damaged in an FAO assessment.",
      "claim_type": "observed",
      "evidence_level": "observed",
      "sources": ["source_fao_assessment"],
      "geographic_scope": "Affected municipalities, Nepal",
      "temporal_scope": "August–September 2026"
    }
  ],
  "sources": [
    {
      "id": "source_fao_assessment",
      "organization": "FAO",
      "title": "Nepal flood agricultural damage assessment",
      "url": "PLACEHOLDER — insert real URL when sourcing",
      "publication_date": "2026-09",
      "source_type": "institutional_assessment",
      "credibility_class": "tier_1",
      "retrieved_at": "PLACEHOLDER"
    }
  ],
  "impacts": [
    {
      "id": "impact_rice_loss",
      "category": "agriculture",
      "metric": "rice_production_loss",
      "value": 5843,
      "unit": "tonnes",
      "location": "Nepal",
      "date": "2026-09",
      "source_id": "source_agricultural_damage_assessment",
      "status": "preliminary"
    },
    {
      "id": "impact_hydropower_offline",
      "category": "energy",
      "metric": "power_generation_stopped",
      "value": 431.1,
      "unit": "MW",
      "location": "Nepal",
      "date": "2026",
      "source_id": "source_undp_preliminary",
      "status": "preliminary"
    }
  ]
}
```

**Important build note:** every numeric figure in Section 6 of the original concept doc (1,800 hectares, 5,843 tonnes, NPR 1.09 billion, 431.1 MW, 2.2 million tonnes of debris, 84,270 people) needs a **real, verified source URL** before it goes live — the concept doc lists these as example data points, not yet linked to specific retrievable URLs. Do not publish a number with a placeholder source. If a real source can't be found or verified for a specific figure, either omit that figure or mark it clearly as "figure needs sourcing" in an internal (non-public) draft state — never ship an unsourced number as if it were sourced.

---

## 4. Evidence-level taxonomy (must be visually distinct, consistently applied)

| Level | Meaning | Suggested treatment |
|---|---|---|
| **Observed** | Directly documented by a trusted source | Solid, confident visual treatment |
| **Strongly supported** | Multiple studies / established scientific understanding | Solid, slightly less emphatic |
| **Attribution** | A scientific study attributes a measurable contribution to a driver | Distinct badge — this is your Nepal warming→instability link |
| **Plausible** | Scientifically reasonable, not yet demonstrated for this specific event | Dashed/lighter visual treatment |
| **Emerging** | Evidence is developing | Dashed, "developing" indicator |
| **Unknown** | Insufficient evidence | Clearly muted/greyed — never hide this, never skip it |

Never silently upgrade a lower evidence level to a higher one for narrative effect. If a connection is "plausible," the UI treatment must not look as confident as "observed" — this distinction is the entire credibility mechanism of the product.

---

## 5. Source hierarchy (for anyone doing the actual research/citation work)

1. **Tier 1 — primary scientific/institutional**: NASA, NOAA, WMO, UNEP, FAO, WHO, IPCC, IPBES, national meteorological/disaster agencies, government ministries, peer-reviewed papers
2. **Tier 2 — reputable research organizations**: World Weather Attribution, universities, recognized research institutions
3. **Tier 3 — reputable journalism**: Reuters, AP, BBC, FT, major regional outlets — use these to discover/contextualize the event, not as the source for underlying numbers where a primary source exists

For the Nepal story specifically, the real sourcing work is:
- Find the actual FAO crop damage assessment (real URL, not the summary description in the concept doc)
- Find the actual UNDP preliminary assessment report (hydropower, debris, population figures)
- Find whether a World Weather Attribution study (or equivalent) has been published on this event's climate linkage — if none exists yet, the warming→instability edge should be marked "plausible" or "emerging," not "attribution," until a real study is found
- Check ReliefWeb (reliefweb.int) first for aggregated situation reports — it indexes exactly this kind of disaster assessment and is free to query

---

## 6. Time dimension (Section 21 of the concept doc)

Add a lightweight timeline strip showing how consequences unfold at different speeds:

```
DAY 0        Flash flood occurs
DAY 1–7      Infrastructure disruption (hydropower stations offline)
WEEKS        Agricultural / livelihood damage assessments published
MONTHS       Supply-chain / local economic effects (if evidenced)
YEARS        Long-term ecosystem recovery (if evidenced)
```

Only populate a time-bucket with a claim if there's a real source for it — an empty bucket with "not yet established" is honest and fine; a filled bucket with an invented timeline isn't.

---

## 7. Real data sources for this build

**For the causal claims and damage figures (manual, not automatable):**
- ReliefWeb (reliefweb.int / API) — search for Nepal 2026 flood situation reports first
- FAO assessment reports (fao.org)
- UNDP Nepal country office reports
- World Weather Attribution (worldweatherattribution.org) — check whether they've published on this specific event

**For optional live enrichment (not required for this single-story MVP, but architect the schema to allow it later):**
- NASA EONET (free, no key) — could later auto-flag "a flood event occurred here" as a trigger for a draft story
- USGS Earthquake API (free, no key) — relevant given the doc's own note that prior earthquake damage may be a contributing geological factor
- Open-Meteo (free, no key) — historical rainfall/temperature data for the region around the event date, useful as supporting environmental context

Do not build the automated ingestion pipeline in this pass. These are noted so the data model doesn't have to be redesigned when that phase starts.

---

## 8. Visual design direction

- Minimalist, generous whitespace — this mirrors the direction we set for the Seasons Explorer (serif type, neutral palette), but Ripple's tone should read slightly more editorial/journalistic than that project, since it's making evidentiary claims about a real disaster. Respectful, not sensational — this is about a real event that hurt real people.
- Evidence-level badges need a consistent, learnable visual language from the very first card the user sees — a short inline legend near the top of the story (not a separate "how to read this" page) is worth including.
- The connector between nodes should visually encode the relationship type where feasible (e.g. a solid line for "causes"/"triggers," a dashed line for "potentially affects"/"uncertain relationship") rather than relying on the label text alone.
- Numbers (5,843 tonnes, NPR 1.09 billion, etc.) should be visually prominent where they appear — they're the most concrete, human-graspable part of an otherwise abstract chain.

---

## 9. Explicit non-goals for this build

- No automated news ingestion
- No AI-drafted claims — every claim in this build is hand-researched and hand-verified
- No second story yet — prove this one first
- No user accounts, comments, or editing UI
- No "explore everything connected to X" global graph browsing — that's Phase 3 territory
- No economic predictions beyond what a real source states — if no source quantifies an economic effect, the node stays labeled "unknown / not yet established," full stop

---

## 10. Build order

1. Do the actual research first: find real, verifiable sources for every claim and number in Section 3, replacing every placeholder. This is the least glamorous step and the most important one — don't let Cursor start on UI before this is done, or you'll end up polishing a UI around numbers that turn out to be unsourced.
2. Build the data file (JSON, per Section 3's schema) with real sources filled in.
3. Build the static node-chain UI reading from that JSON — vertical chain, click-to-expand evidence cards, evidence-level badges.
4. Add the timeline strip (Section 6).
5. Add the "what we know / what remains uncertain" summary at the bottom.
6. Polish: typography, badge visual language, connector line styling, mobile layout.
7. Only after this story feels right: revisit whether a second hand-built story is worth adding before touching any automation.
