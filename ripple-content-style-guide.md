# Ripple — Content & Storytelling Style Guide

## Purpose

This defines how every Ripple story is written — the voice, the reading level, the narrative shape, and how text pairs with maps and charts. It's a companion to `ripple-mvp-nepal-spec.md` (the structural/data spec) — that file defines *what* a story contains; this one defines *how it reads*.

The test for every sentence you write for Ripple: **would a curious 12-year-old and a skeptical scientist both feel this was written for them, in different ways?** The 12-year-old shouldn't feel talked down to. The scientist shouldn't feel the facts were softened to the point of being wrong. Both should be able to read the same sentence and get something true out of it.

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

Every Ripple story — not just Nepal — should move through the same emotional and informational shape, even though the content differs:

1. **The moment** — open on something concrete and human-scale, not an abstraction. Not "Climate change is affecting Nepal's mountains." Instead: "On August 26, a wall of ice and rock let go above a river in Nepal. Within hours, the water below had nowhere to go but out."
2. **The chain** — walk the causal links one at a time, letting the reader feel each step is earned, not asserted. Each node should answer "how do we know this?" as naturally as it answers "what happened?"
3. **The stakes** — land on real, specific numbers tied to real people: hectares of crops, tonnes of rice, megawatts of power offline, people affected. Numbers work best paired with a relatable scale (Section 5).
4. **The honesty** — explicitly say what's still uncertain. This isn't a weakness in the story — for Ripple, it's the entire point. Present **What we know** first, then **What remains uncertain**, as two stacked point lists, not a side-by-side grid and not a lecture about trust.
5. **The wider view** — close by gently gesturing outward: this is one ripple in a much larger pattern, without overstating what this one event proves on its own.

**Do not pad sections with product voice-over.** Never tell the reader how to use the page. Never repeat the date and place after a summary that already named them. Never write “Open Verified sources…”, “this page walks the chain…”, or “Consequences arrive in stages…”. Cause nodes (the first links: warming, diversion, leak, invasion, blowout) must explain the mechanism in several sentences, using only facts already in that story’s claims.

## 4. Handling evidence levels in prose (not just badges)

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

## 5. Numbers: make them felt, not just stated

A raw number rarely means anything to a reader on first contact. Pair it with a comparison that makes the scale physically or personally graspable — but only using comparisons you can verify, never invented ones.

- Weak: "1,800 hectares of crops were destroyed."
- Better: "1,800 hectares of crops were destroyed — roughly the size of 2,500 football fields, gone in a single day."
- Weak: "431.1 MW of power generation went offline."
- Better: "431.1 MW went offline — enough electricity, on a normal day, to power a mid-sized city."

Rule: **only use a real, checkable equivalence.** If you can't verify the comparison (e.g. "enough to power X city" needs a real per-capita consumption figure for that country), don't invent an approximate one — use a simpler, safely-true framing instead ("a significant share of the region's power supply").

## 6. Tone around harm — this is a real disaster, not a story device

Nepal, and every future Ripple story, involves real people who lost real things. A few firm rules:

- No sensationalized language ("catastrophic," "devastating," "unimaginable") used reflexively — use it only where the facts themselves support that weight, and even then sparingly. Let the numbers carry the emotional weight; don't editorialize on top of them.
- Never speculate about individual victims' experiences beyond what's documented. No invented human-interest details.
- Acknowledge human cost plainly and respectfully, without dwelling on graphic detail. "84,270 people were affected" is factual and sufficient; there's no need to embellish what that meant for any one household unless a real, sourced account exists to quote or paraphrase.
- If children may read this (and given the "all age groups" goal, assume they will), keep descriptions of death or injury factual and brief — state what happened, don't linger.

## 7. How maps and charts integrate with the writing — never let a visual stand alone

Every map or chart needs a 1-2 sentence caption that tells the reader exactly what to look at and what it means — a visual without a pointed caption becomes decoration, not evidence.

**Maps:**
- Use a map the moment location matters — show where the event happened, and where its downstream effects reach, if that's geographically distinct (e.g. the river corridor vs. the wider agricultural region affected).
- Keep map styling minimal and labeled (place names visible), matching the neutral, editorial visual direction already set for Ripple.
- Caption pattern: "The flood originated in [place] and reached [place] within [timeframe]." Always answer "where" and "how far/fast" together, not just "where."

**Charts:**
- Use the simplest chart type that tells the truth: a bar chart for comparing discrete quantities (hectares by district, tonnes by crop type), a line/area chart for something changing over time (rainfall in the weeks before the event, historical frequency of similar events in the region).
- Avoid decorative or complex chart types (3D, radial, stacked charts with many categories) — they slow comprehension, which works against "easy to understand for all ages."
- Caption pattern: state the one takeaway the chart proves, in plain language, before the reader has to interpret the axes themselves. "Rainfall in the week before the collapse was well above the 10-year average for this region" — then let them look at the chart to see it, rather than making them derive the point from the chart alone.
- Every chart's underlying numbers must trace to the same sourced data as the surrounding text — a chart is not exempt from the sourcing rules in the structural spec.

## 8. Worked example — same fact, three drafts

**Too technical (avoid):**
> "Anthropogenic radiative forcing has been associated with increased cryospheric instability in high-altitude terrain, potentially elevating the probability of mass-wasting events in glaciated catchments."

**Too dramatic (avoid):**
> "The mountain betrayed the valley below it — a ticking time bomb of ice, primed by humanity's reckless warming of the planet, finally exploded into catastrophe."

**Ripple's voice (target):**
> "Warmer temperatures have been steadily changing how stable Nepal's high mountains are — melting ice and thawing ground that used to stay frozen year-round. Scientists say this kind of warming makes collapses like this one more likely, though they're still studying exactly how much more likely, for this specific event."

Notice: the third version keeps every real fact and every real uncertainty from the first version, loses none of the stakes, and reads at a level a twelve-year-old can follow without simplifying the science into something false.

## 9. Pre-publish checklist (apply to every story, every node)

- [ ] Read the story aloud — does any sentence require a re-read to parse? Rewrite it.
- [ ] Is every technical/scientific term defined in-line the first time it appears?
- [ ] Does every evidence-level badge have a matching plain-language sentence nearby (Section 4)?
- [ ] Is every number paired with a verified, checkable comparison, or left unadorned if no safe comparison exists?
- [ ] Does the story explicitly state what's uncertain, in its own words, not just via a badge?
- [ ] Is any language about human harm factual and restrained rather than dramatized?
- [ ] Does every map and chart have a caption stating its one takeaway in plain language?
- [ ] Would this sentence embarrass you if the scientist whose study you cited read it? Would it lose a curious kid if they tried to read it?
