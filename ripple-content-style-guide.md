# Ripple — Content & Storytelling Style Guide (Rev 2)

## Purpose

This defines how every Ripple story is written — the voice, the reading level, the narrative shape, and how text pairs with maps and charts. It's a companion to `ripple-mvp-nepal-spec.md` (the structural/data spec) and `rules.md` (the layout/engineering rules) — those files define *what* a story contains and *how it's built*; this one defines *how it reads*.

The test for every sentence you write for Ripple: **would a curious 12-year-old and a skeptical scientist both feel this was written for them, in different ways?** The 12-year-old shouldn't feel talked down to. The scientist shouldn't feel the facts were softened to the point of being wrong. Both should be able to read the same sentence and get something true out of it.

**Revision note:** this version adds four rules (Sections 4, 5, 6, and 8) written directly from an editorial review of the live site's actual content, using real sentences from the shipped stories as the before/after examples — not hypothetical ones. Everything else carries forward from the prior version.

---

## 1. Core voice principles

- **Plain language, not simple language.** Simple language dumbs things down. Plain language explains complex things clearly. "Ice and rock collapsed above the valley" is plain. "A significant mass-wasting event occurred in the alpine zone" is neither plain nor engaging — it's jargon wearing a lab coat.
- **Active voice, concrete subjects.** "The flood destroyed 1,800 hectares of crops" — not "1,800 hectares of crops were affected by flooding." Say who or what did the thing.
- **Short sentences carry facts. Slightly longer sentences carry feeling.** Vary rhythm on purpose. A one-line sentence after a longer one lands harder — use that.
- **Define a technical term the moment you use it, in the same breath, not in a glossary the reader has to go find.** "Attribution — a scientific study that measures how much of an event's chances or intensity trace back to climate change" is fine to write inline, once, the first time "attribution" appears in a story.
- **Present tense for ongoing/current impacts, past tense for the event itself.** "The flood struck on August 26" (past — it happened). "Farmers in the valley are still assessing crop loss" (present — it's ongoing).
- **Use "you" sparingly, and only to make stakes concrete, never as false intimacy.** "If you grew rice on this land, this is the season you'd have lost it" is fine once, as a stakes-anchor. Repeated "you" throughout starts to feel like a lecture.

## 2. Reading level

Target: **plain English, roughly a comfortable middle-school reading level for the narrative text**, without ever removing real numbers, real causal complexity, or real uncertainty. Reading level should govern *sentence construction*, not *content depth*. A ten-year-old and a fifty-year-old should both be able to parse every sentence; only the fifty-year-old is likely to sit with the implications longer, and that's fine — the writing doesn't need to do that work for them.

Practical rules:
- Average sentence length: aim for under 20 words. Occasional longer sentences are fine for rhythm, not as the default.
- One idea per sentence. If a sentence needs "and," "which," and "because" all at once, split it.
- Avoid nominalizations (turning verbs into noun-phrases) — "the flood damaged crops" beats "the flood resulted in agricultural damage."
- Never assume the reader already knows what an evidence-level term, an institution's name, or a scientific process means. Assume nothing, explain everything once, briefly.

## 3. The narrative arc of a story

Every Ripple story should move through the same emotional and informational shape, even though the content differs:

1. **The moment** — open on something concrete and human-scale, not an abstraction. Not "Climate change is affecting Nepal's mountains." Instead: "On August 26, a wall of ice and rock let go above a river in Nepal. Within hours, the water below had nowhere to go but out."
2. **The chain** — walk the causal links one at a time, letting the reader feel each step is earned, not asserted. Each node should answer "how do we know this?" as naturally as it answers "what happened?" Cause nodes (the first links: warming, diversion, leak, invasion, blowout) get extra mechanistic detail — several sentences explaining *how*, drawn only from facts already established in that story's claims, not filler.
3. **The stakes** — land on real, specific numbers tied to real people. Numbers work best paired with a relatable scale (Section 7).
4. **The honesty** — **What we know**, stacked above **What remains uncertain**, each as its own vertical point list. Not a side-by-side grid, not a lecture about trust, no meta-commentary about the process of verifying — just the two lists.
5. **The wider view** — close by gently gesturing outward: this is one ripple in a much larger pattern, without overstating what this one event proves on its own.

**Do not pad sections with product voice-over.** Never tell the reader how to use the page, and never repeat a date or place that a preceding summary already named. See Section 9 for the full list of banned phrasings.

## 4. One number, one sentence — don't stitch claims together with semicolons

This is the single most common quality problem found in an audit of the live content, concentrated in stories with dense numeric claims (wildfire area comparisons, data-centre capacity figures). A claim that packs two or three separate facts into one semicolon-joined sentence asks the reader to hold multiple numbers in their head across a single breath — exactly what Section 2's "one idea per sentence" rule exists to prevent.

**Before (real example, shipped):**
> "Spain's 2025 fires were the worst in 30 years, almost quadrupling the average annual area burned over the prior period; Portugal's burned area was about 2.3× its average since 1980; together more than 1% of the Iberian Peninsula burned."

Three separate facts (Spain, Portugal, combined total), one sentence, two semicolons.

**After:**
> "Spain's 2025 fires were the worst in 30 years — nearly four times the average annual area burned in the prior period. Portugal's burned area ran about 2.3 times its average since 1980. Together, the two countries lost more than 1% of the entire Iberian Peninsula to fire."

Same facts, same numbers, three short sentences instead of one long one. Nothing is lost. The reader can actually hold each fact before the next one arrives.

**Rule:** if a claim's source sentence has more than one semicolon, or covers more than one named subject (two countries, two organizations, two time periods), split it into separate sentences — one fact, one sentence, every time. This applies when translating source material into claim text, not just in the final prose.

## 5. Self-reported claims read differently than independently documented ones

A claim sourced entirely from the subject's own press release or AGM statement is not the same kind of fact as a claim documented by an independent government or scientific body — even when both are accurately quoted and properly cited. The evidence badge alone doesn't always make this distinction visible at a glance, so **the sentence itself should carry the signal**, by making the subject of the sentence the party making the claim.

**Before (real example, shipped — technically accurate, reads as more independently verified than it is):**
> "RIL states the Meta Jamnagar data centre will be powered by renewable energy; Reliance Intelligence states its Jamnagar backbone will be powered entirely by clean energy from Reliance's Kutch renewable/solar platform."

**After:**
> "Reliance says the Meta data centre in Jamnagar will run on renewable energy. The company also says its own Jamnagar AI backbone will run entirely on clean power from its Kutch solar platform. Neither claim has been independently audited — details like hourly grid matching and import shares aren't public yet."

The rewrite does three things: splits the semicolon per Section 4, keeps "Reliance says" / "the company says" as the grammatical subject so the reader always knows whose claim this is, and surfaces the caveat in the visible prose rather than leaving it only in a metadata field the reader may not expand.

**Rule:** when a claim's only source is the subject describing itself (a company, a government press office, an individual), open the sentence with that party as the subject — "X says," "X states," "according to X" — every time, even if it feels repetitive. Don't launder a self-reported claim into a neutral-sounding factual sentence just because it's accurately cited.

## 6. Match date precision to what actually happened

A specific calendar date implies something specific happened on that day. Don't assign one to a process, trend, or multi-year event just to fill a date field.

**Before (real example, shipped):** an event dated `1960-01-01` for a story that itself opens with "From the 1960s, Soviet irrigation diverted the Amu Darya and Syr Darya" — a decades-long process, not a single day.

**After:** use the coarsest honest unit — a year, a decade, or a range ("1960s–present") — rather than a manufactured exact date. If the schema requires a single sortable date, use the first day of the correct year and make sure the visible prose (hero, summary, any displayed date label) never implies more precision than that.

**Rule:** before publishing, check that the date attached to a story matches the actual granularity of the event. A flash flood gets a real day. A desiccation, a decades-long contamination, or an ongoing trend gets a year or a range — never a fabricated day-level date.

## 7. Numbers: make them felt, not just stated

A raw number rarely means anything to a reader on first contact. Pair it with a comparison that makes the scale physically or personally graspable — but only using comparisons you can verify, never invented ones.

- Weak: "1,800 hectares of crops were destroyed."
- Better: "1,800 hectares of crops were destroyed — roughly the size of 2,500 football fields, gone in a single day."
- Weak: "431.1 MW of power generation went offline."
- Better: "431.1 MW went offline — enough electricity, on a normal day, to power a mid-sized city."

Rule: **only use a real, checkable equivalence.** If you can't verify the comparison, use a simpler, safely-true framing instead ("a significant share of the region's power supply") rather than inventing an approximate one.

## 8. Vary the entry point across stories that share a structure

Several Ripple stories follow the same underlying shape — a climate-attribution study links warming to an extreme-weather event, which cascades into damage. Individually, each is well written. Read back to back, four stories that all open with "scientists say warming made this more likely" start to feel like the same article with different place names swapped in, even though the causal chains are genuinely distinct events.

**Rule:** for any new story that shares a structural family with existing ones (climate-attribution disasters, industrial-pollution legacies, infrastructure announcements), deliberately choose a different entry point than the most recent story in that family:

- **Mechanism-first** (Nepal's approach): open on the physical event, work outward to the science.
- **Human-impact-first**: open on what changed for people, work backward to why.
- **Place-first**: open on the location itself and what makes it vulnerable, before the event.
- **Number-first**: open on the single most striking verified figure, then unpack it.

Before drafting a new story in a family that already has 2+ entries, skim the openings of the existing ones and pick a different lane.

## 9. Handling evidence levels in prose (not just badges)

The UI badge says "Attribution" or "Plausible" — but the sentence next to it needs to say what that means in human terms, every time, so the reader never has to hold a taxonomy in their head:

| Badge | How to phrase it in a sentence |
|---|---|
| Observed | "This happened, and it's documented by [source]." |
| Strongly supported | "Scientists broadly agree on this, based on [type of evidence]." |
| Attribution | "A study measured how much more likely climate change made this." |
| Plausible | "This is a reasonable link, but no study has confirmed it for this specific event yet." |
| Emerging | "Researchers are actively studying this — the picture is still forming." |
| Unknown | "We don't yet have evidence either way. That's a real gap, not a hidden answer." |

Never write around an "Unknown" node to make it sound more settled than it is. A short, plain "we don't know yet" is more trustworthy — and more interesting — than a vague sentence that implies more certainty than exists.

## 10. Tone around harm — this is often a real disaster, not a story device

Many Ripple stories involve real people who lost real things. A few firm rules:

- No sensationalized language ("catastrophic," "devastating," "unimaginable") used reflexively — use it only where the facts themselves support that weight, and even then sparingly. Let the numbers carry the emotional weight; don't editorialize on top of them.
- Never speculate about individual victims' experiences beyond what's documented. No invented human-interest details.
- Acknowledge human cost plainly and respectfully, without dwelling on graphic detail.
- If children may read this (and given the "all age groups" goal, assume they will), keep descriptions of death or injury factual and brief — state what happened, don't linger.

## 11. How maps and charts integrate with the writing

Every map or chart needs a 1-2 sentence caption that tells the reader exactly what to look at and what it means — a visual without a pointed caption becomes decoration, not evidence.

**Maps:** use the moment location matters; keep styling minimal and labeled; caption pattern answers "where" and "how far/fast" together.

**Charts:** use the simplest chart type that tells the truth (bar for discrete comparisons, line/area for change over time); state the one takeaway in the caption before the reader has to derive it from the axes; every chart's numbers must trace to the same sourced data as the surrounding text.

## 12. Hard content bans (do not generate)

Do **not** write UI instructions, reading guides, or repeated location/date lines. Banned patterns include:

- "this page walks the chain step by step…"
- "Each step names who reported it…"
- "Open Verified sources to check the original link."
- "Consequences arrive in stages: minutes, days, seasons…"
- "Every ripple has a first hinge…"
- "This step follows because the previous one…"
- "Trust comes from separating settled claims…"
- Repeating the date and place after a summary that already contains them

Hero, reach, and timeline teasers must be **story-specific facts**. Chain paragraphs explain the mechanism. Honesty is the two stacked lists, with no meta intro.

## 13. Worked example — same fact, three drafts

**Too technical (avoid):**
> "Anthropogenic radiative forcing has been associated with increased cryospheric instability in high-altitude terrain, potentially elevating the probability of mass-wasting events in glaciated catchments."

**Too dramatic (avoid):**
> "The mountain betrayed the valley below it — a ticking time bomb of ice, primed by humanity's reckless warming of the planet, finally exploded into catastrophe."

**Ripple's voice (target):**
> "Warmer temperatures have been steadily changing how stable Nepal's high mountains are — melting ice and thawing ground that used to stay frozen year-round. Scientists say this kind of warming makes collapses like this one more likely, though they're still studying exactly how much more likely, for this specific event."

## 14. Pre-publish checklist

- [ ] Read the story aloud — does any sentence require a re-read to parse? Rewrite it.
- [ ] Does any claim sentence contain a semicolon or cover more than one named subject? Split it (Section 4).
- [ ] Is every technical/scientific term defined in-line the first time it appears?
- [ ] Does every evidence-level badge have a matching plain-language sentence nearby (Section 9)?
- [ ] Is every self-reported claim's sentence subject the party making the claim, not a neutral passive construction (Section 5)?
- [ ] Does the story's date match the actual precision of the event — no fabricated day-level dates for processes or trends (Section 6)?
- [ ] If this story shares a structural family with existing ones, does it open differently than the most recent entry (Section 8)?
- [ ] Is every number paired with a verified, checkable comparison, or left unadorned if no safe comparison exists?
- [ ] Does the story explicitly state what's uncertain, in its own words, not just via a badge?
- [ ] Is any language about human harm factual and restrained rather than dramatized?
- [ ] Does every map and chart have a caption stating its one takeaway in plain language?
- [ ] Would this sentence embarrass you if the scientist whose study you cited read it? Would it lose a curious kid if they tried to read it?
