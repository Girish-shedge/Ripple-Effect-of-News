import type { ReactNode } from 'react'
import type { Claim, Edge, EvidenceLevel, MediaItem, Source, Story } from '../types'
import { formatImpact } from '../lib/format'
import { StoryReachCharts } from './StoryReachCharts'
import { SourceIndex } from './SourceIndex'
import { PredictionsPanel } from './PredictionsPanel'
import { TimelineStrip } from './TimelineStrip'
import { EvidenceBadge } from './EvidenceBadge'

export type StorySectionDef = {
  id: string
  kicker: string
  /** Shown in the kicker as `label · Evidence` + info icon. */
  evidence?: { level: EvidenceLevel; meaning?: string }
  title: string
  lead?: string
  /** Single prose paragraph after the heading. May include <strong>. Omit instead of writing UI instructions. */
  teaser?: ReactNode
  /** Only when a unique, place-correct photo exists for this section. */
  image?: MediaItem
  /** All verified sources for this section (shown when expanded). */
  sources: Source[]
  /** Non-prose widgets only (figures, lists, claims). Prose lives in teaser. */
  body: ReactNode | null
}

/** Local files that depict Nepal. Never attach them to another story. */
const NEPAL_ONLY_FILES = new Set([
  'langtang_lirung.jpg',
  'langtang_lirung_himal.jpg',
  'trishuli_river_nepal.jpg',
  'rice_terraces_annapurna.jpg',
  'rice_terraces_in_annapurna_region_-_panoramio.jpg',
])

/** Map Commons / remote basenames → local /media paths when cached. */
const LOCAL_BY_BASENAME: Record<string, string> = {
  'langtang_lirung.jpg': '/media/Langtang_Lirung.jpg',
  'langtang_lirung_himal.jpg': '/media/Langtang_Lirung_Himal.jpg',
  'trishuli_river_nepal.jpg': '/media/Trishuli_river_nepal.jpg',
  'rice_terraces_in_annapurna_region_-_panoramio.jpg': '/media/Rice_terraces_Annapurna.jpg',
  'rice_terraces_annapurna.jpg': '/media/Rice_terraces_Annapurna.jpg',
  'gujarat_satellite_view.jpg': '/media/Gujarat_satellite_view.jpg',
  'jamnagar_refinery.jpg': '/media/Jamnagar_Refinery.jpg',
  'incendio_forestal.jpg': '/media/Incendio_forestal.jpg',
}

function fileOf(url: string) {
  return decodeURIComponent(url.split('/').pop() ?? '')
    .split('?')[0]
    .toLowerCase()
}

/** Stable identity so thumb / remapped / Commons variants count as one photo. */
function imageKey(url: string) {
  return fileOf(url).replace(/^\d+px-/, '')
}

function isPlaceCorrect(storyId: string, url: string) {
  if (storyId === 'nepal_flood_2026') return true
  return !NEPAL_ONLY_FILES.has(imageKey(url))
}

function resolveLocalUrl(item: Pick<MediaItem, 'url' | 'commons_file' | 'original_url'>): string {
  const candidates = [item.commons_file, item.original_url, item.url].filter(Boolean) as string[]
  for (const c of candidates) {
    const key = imageKey(c)
    if (LOCAL_BY_BASENAME[key]) return LOCAL_BY_BASENAME[key]
  }
  if (item.url.startsWith('/media/') && !item.url.toLowerCase().endsWith('.svg')) return item.url
  return item.url
}

function isWatercolor(item: MediaItem) {
  return (
    item.imagery_type === 'watercolor_illustration' ||
    item.fetched_from === 'ripple_ai_watercolor' ||
    /watercolor/i.test(item.credit ?? '')
  )
}

function isUsablePhoto(item: MediaItem | undefined, storyId: string): item is MediaItem {
  if (!item) return false
  const resolved = resolveLocalUrl(item)
  const url = resolved.toLowerCase()
  if (!resolved) return false
  if (url.endsWith('.svg')) return false
  if (url.includes('section-') && url.includes('cover')) return false
  if (item.credit === 'Ripple local cover') return false
  if (!isPlaceCorrect(storyId, resolved)) return false
  // Verified Commons / licensed photos
  if (item.commons_file || item.license || item.credit_url || item.fetched_from === 'wikimedia_commons_api')
    return true
  // AI watercolor fallbacks (local PNG/JPEG), clearly typed
  if (isWatercolor(item) && resolved.startsWith('/media/') && /\.(jpe?g|png|webp)$/i.test(resolved))
    return true
  // Other place-correct local photos
  if (item.fetched_from === 'story_news') return true
  if (resolved.startsWith('/media/') && /\.(jpe?g|png|webp)$/i.test(resolved) && !isWatercolor(item))
    return true
  return false
}

function asDisplayMedia(item: MediaItem, storyId: string): MediaItem | undefined {
  if (!isUsablePhoto(item, storyId)) return undefined
  const url = resolveLocalUrl(item)
  return { ...item, url }
}

function uniqueSources(list: Source[]): Source[] {
  return Array.from(new Map(list.map((s) => [s.id, s])).values())
}

function claimImage(
  usedKeys: Set<string>,
  storyId: string,
  candidates: Array<MediaItem | undefined>,
): MediaItem | undefined {
  const ranked = [...candidates].filter(Boolean).sort((a, b) => {
    // Prefer watercolor (all detail imagery should be watercolor style).
    return Number(!isWatercolor(a!)) - Number(!isWatercolor(b!))
  }) as MediaItem[]
  for (const raw of ranked) {
    const item = asDisplayMedia(raw, storyId)
    if (!item) continue
    const key = imageKey(item.url)
    if (usedKeys.has(key)) continue
    usedKeys.add(key)
    return item
  }
  return undefined
}

function mediaForNode(story: Story, nodeId: string): MediaItem[] {
  return (story.media ?? []).filter(
    (m) => m.node_ids?.includes(nodeId) || m.placement === nodeId,
  )
}

function mediaForPlacement(story: Story, placement: string): MediaItem[] {
  return (story.media ?? []).filter((m) => m.placement === placement)
}

/** Prefer news images that belong to this section’s verified sources. */
function newsImagesForSources(story: Story, sourceIds: string[]): MediaItem[] {
  const news = story.news ?? []
  const bySource = new Map(news.map((n) => [n.source_id, n]))
  const out: MediaItem[] = []
  for (const sid of sourceIds) {
    const n = bySource.get(sid)
    if (!n?.image_url) continue
    const key = imageKey(n.image_url)
    const local = LOCAL_BY_BASENAME[key] ?? n.image_url
    out.push({
      id: `news-img-${n.id}`,
      url: local,
      alt: n.image_alt || n.headline,
      caption: n.headline,
      credit: n.organization,
      credit_url: n.url,
      placement: 'news',
      imagery_type: 'near_event_context',
      fetched_from: 'story_news',
    })
  }
  return out
}

function sectionImage(
  story: Story,
  usedKeys: Set<string>,
  opts: {
    placements?: string[]
    nodeId?: string
    sourceIds?: string[]
    preferHero?: boolean
  },
): MediaItem | undefined {
  const storyId = story.event.id
  const media = story.media ?? []
  const pool: MediaItem[] = []

  if (opts.preferHero) {
    pool.push(...media.filter((m) => m.placement === 'hero'))
  }
  if (opts.nodeId) pool.push(...mediaForNode(story, opts.nodeId))
  for (const p of opts.placements ?? []) pool.push(...mediaForPlacement(story, p))
  if (opts.sourceIds?.length) {
    // Only use news-linked images that are already watercolor conversions.
    pool.push(
      ...newsImagesForSources(story, opts.sourceIds).filter((m) => isWatercolor(m)),
    )
  }

  // Prefer unused watercolors already attached to this story.
  pool.push(...media.filter((m) => isWatercolor(m)))

  // Last resort for hero: any usable media
  if (opts.preferHero) {
    pool.push(...media.filter((m) => isUsablePhoto(m, storyId)))
  }

  return claimImage(usedKeys, storyId, pool)
}

function sourcesForClaimIds(story: Story, claimIds: string[]): Source[] {
  const claimMap = new Map(story.claims.map((c) => [c.id, c]))
  const sourceMap = new Map(story.sources.map((s) => [s.id, s]))
  const out: Source[] = []
  const seen = new Set<string>()
  for (const cid of claimIds) {
    const claim = claimMap.get(cid)
    if (!claim) continue
    for (const sid of claim.sources) {
      if (seen.has(sid)) continue
      const s = sourceMap.get(sid)
      if (s) {
        seen.add(sid)
        out.push(s)
      }
    }
  }
  return out
}

function claimsForIds(story: Story, claimIds: string[]): Claim[] {
  const claimMap = new Map(story.claims.map((c) => [c.id, c]))
  return claimIds.map((id) => claimMap.get(id)).filter(Boolean) as Claim[]
}

function legendMeaning(story: Story, level: string) {
  return story.evidence_legend.find((l) => l.level === level)?.meaning
}

/** Strip em dashes from displayed copy. */
function plain(text: string) {
  return text
    .replace(/\u2014/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Highlight only complete phrases: full dates, numbers with units, named quantities.
 * Never wrap a lone digit or a truncated fragment of a longer token.
 */
function pickBoldFrom(text: string): string[] {
  const clean = plain(text)
  const out: string[] = []
  const patterns = [
    /\b\d{1,2}\s*[–-]\s*\d{1,2}\s+[A-Za-z]+\s+\d{4}\b/g,
    /\b\d{1,2}\s+[A-Za-z]+\s+\d{4}\b/g,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/g,
    /\b(?:about |roughly |nearly |at least |over |~)?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s*[–-]\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?)?\s*(?:%|°C|×|x|MW|ha|hectares|tonnes|people|days|years|km²|km|m³|m3)(?![A-Za-z0-9])/gi,
    /\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g,
    /\b\d+(?:\.\d+)?×\b/g,
  ]
  for (const pattern of patterns) {
    const matches = clean.match(pattern)
    if (!matches) continue
    for (const m of matches) {
      const phrase = m.trim()
      if (phrase.length < 3) continue
      if (/^\d{1,2}$/.test(phrase)) continue
      out.push(phrase)
    }
  }
  return [...new Set(out)]
}

/** Wrap matches of each phrase in <strong> (case-insensitive, longest first). */
function withBold(text: string, phrases: string[]): ReactNode {
  const clean = plain(text)
  const unique = [
    ...new Set(phrases.map((p) => plain(p)).filter((p) => p.length > 2 && !/^\d{1,2}$/.test(p))),
  ].sort((a, b) => b.length - a.length)
  if (!unique.length) return clean

  const pattern = new RegExp(
    `(?<![A-Za-z0-9])(${unique.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![A-Za-z0-9])`,
    'gi',
  )
  const parts = clean.split(pattern)
  const keys = new Set(unique.map((u) => u.toLowerCase()))
  return parts.map((part, i) =>
    keys.has(part.toLowerCase()) ? <strong key={`${i}-${part}`}>{part}</strong> : part,
  )
}

function emphasize(text: string, extra: Array<string | undefined | null> = []): ReactNode {
  return withBold(text, [...pickBoldFrom(text), ...extra.filter(Boolean) as string[]])
}

function asSentence(text: string) {
  const t = plain(text)
  if (!t) return ''
  return /[.!?]$/.test(t) ? t : `${t}.`
}

function reachTeaser(story: Story): string {
  const bars = story.chart?.impact_bars ?? []
  const bits = bars.length
    ? bars.slice(0, 3).map((b) => `${plain(b.label)} is ${formatImpact(b.value, b.unit)}`)
    : story.impacts
        .slice(0, 3)
        .map((i) => `${plain(i.metric.replace(/_/g, ' '))} is ${formatImpact(i.value, i.unit)}`)
  if (!bits.length) return plain(story.event.summary)
  if (bits.length === 1) return asSentence(`Named sources report that ${bits[0]}`)
  if (bits.length === 2) {
    return `${asSentence(`Named sources report that ${bits[0]}`)} ${asSentence(`They also report that ${bits[1]}`)}`
  }
  return `${asSentence(`Named sources report that ${bits[0]}`)} ${asSentence(`They also report that ${bits[1]}`)} ${asSentence(`A third figure is that ${bits[2]}`)}`
}

function timelineTeaser(story: Story): string {
  const items = story.timeline
  if (!items.length) return plain(story.event.summary)
  const first = items[0]
  const last = items[items.length - 1]
  if (items.length === 1) return asSentence(`${first.bucket}: ${first.detail}`)
  return `${asSentence(`${first.bucket}: ${first.detail}`)} ${asSentence(`${last.bucket}: ${last.detail}`)}`
}

function predictionsTeaser(story: Story): string {
  const list = story.predictions ?? []
  if (!list.length) return ''
  const first = list[0]
  const second = list[1]
  if (!second) return plain(`${first.title}.`)
  return plain(`${first.title}. ${second.title}.`)
}

function primarySources(story: Story): Source[] {
  const preferred = story.sources.filter(
    (s) =>
      s.credibility_class === 'institutional' ||
      s.credibility_class === 'peer_reviewed' ||
      s.source_type === 'agency' ||
      s.source_type === 'scientific',
  )
  return preferred.length ? preferred : story.sources
}

export function buildStorySections(story: Story): StorySectionDef[] {
  const usedImageKeys = new Set<string>()

  const edgeByTo = new Map<string, Edge>()
  for (const e of story.edges) edgeByTo.set(e.to, e)

  const primary = uniqueSources(primarySources(story))
  const reachSourceList = uniqueSources(
    (story.chart?.impact_bars ?? [])
      .map((b) => story.sources.find((s) => s.id === b.source_id))
      .filter(Boolean) as Source[],
  )
  const timelineSourceList = uniqueSources(
    sourcesForClaimIds(
      story,
      story.timeline.flatMap((t) => t.claim_ids),
    ),
  )

  const heroSources = primary
  const heroMedia = sectionImage(story, usedImageKeys, {
    preferHero: true,
    sourceIds: heroSources.map((s) => s.id),
  })

  const sections: StorySectionDef[] = [
    {
      id: 'hero',
      kicker: 'Started from',
      title: plain(story.event.hero),
      teaser: emphasize(story.event.summary),
      image: heroMedia,
      sources: heroSources,
      body: null,
    },
    {
      id: 'reach',
      kicker: 'Reach',
      title: 'How far the shock travelled',
      teaser: emphasize(reachTeaser(story)),
      image: sectionImage(story, usedImageKeys, {
        placements: ['impacts', 'charts'],
        sourceIds: (reachSourceList.length ? reachSourceList : primary).map((s) => s.id),
      }),
      sources: reachSourceList.length ? reachSourceList : primary,
      body: (
        <div className="doc-detail">
          <StoryReachCharts story={story} />
        </div>
      ),
    },
    {
      id: 'timeline',
      kicker: 'Over time',
      title: 'What happened next',
      teaser: emphasize(timelineTeaser(story)),
      image: sectionImage(story, usedImageKeys, {
        placements: ['timeline'],
        sourceIds: (timelineSourceList.length ? timelineSourceList : primary).map((s) => s.id),
      }),
      sources: timelineSourceList.length ? timelineSourceList : primary,
      body: (
        <div className="doc-detail">
          <TimelineStrip items={story.timeline} eventDate={story.event.date} />
        </div>
      ),
    },
  ]

  if (story.predictions?.length) {
    const predSources = uniqueSources(
      story.predictions.flatMap((p) =>
        p.source_ids
          .map((id) => story.sources.find((s) => s.id === id))
          .filter(Boolean),
      ) as Source[],
    )
    sections.push({
      id: 'predictions',
      kicker: 'Looking ahead',
      title: 'What may still unfold',
      teaser: emphasize(predictionsTeaser(story)),
      image: sectionImage(story, usedImageKeys, {
        placements: ['predictions'],
        sourceIds: predSources.map((s) => s.id),
      }),
      sources: predSources.length ? predSources : primary,
      body: (
        <div className="doc-detail">
          <PredictionsPanel story={story} compact />
        </div>
      ),
    })
  }

  story.nodes.forEach((node, index) => {
    const inbound = edgeByTo.get(node.id)
    const evidence = inbound?.evidence_level ?? 'unknown'
    const claimIds = inbound?.claim_ids ?? []
    const nodeClaims = claimsForIds(story, claimIds)
    const nodeSources = uniqueSources(sourcesForClaimIds(story, claimIds))
    const sources = nodeSources.length ? nodeSources : primary
    const nodeImage = sectionImage(story, usedImageKeys, {
      nodeId: node.id,
      sourceIds: sources.map((s) => s.id),
    })
    const kicker =
      index === 0
        ? 'The chain begins'
        : inbound?.relationship_label
          ? inbound.relationship_label
          : 'Next link'

    const claimPhrases = nodeClaims.flatMap((c) => pickBoldFrom(c.text))
    const evidenceMeaningText = plain(legendMeaning(story, evidence) ?? '') || undefined

    sections.push({
      id: `chain-${node.id}`,
      kicker,
      evidence: { level: evidence, meaning: evidenceMeaningText },
      title: plain(node.title),
      teaser: emphasize(node.description, [...claimPhrases, inbound?.relationship_label]),
      image: nodeImage,
      sources,
      body: (
        <div className="doc-detail">
          {nodeClaims.length === 0 ? (
            <p className="doc-quiet">No verified claim is attached to this link yet.</p>
          ) : (
            <div className="doc-claims">
              {nodeClaims.map((claim) => (
                <ClaimDetail
                  key={claim.id}
                  claim={claim}
                  meaning={
                    plain(legendMeaning(story, claim.evidence_level) ?? '') || undefined
                  }
                  hideBadge={claim.evidence_level === evidence}
                />
              ))}
            </div>
          )}
        </div>
      ),
    })
  })

  sections.push(
    {
      id: 'knowledge',
      kicker: 'What we can say',
      title: 'What we know, and what remains uncertain',
      image: sectionImage(story, usedImageKeys, {
        placements: ['knowledge'],
        sourceIds: primary.map((s) => s.id),
      }),
      sources: primary,
      body: (
        <div className="doc-detail">
          <div className="knowledge-stack">
            <div className="knowledge-stack-block">
              <h3>What we know</h3>
              <ul>
                {story.knowledge_summary.what_we_know.map((line) => (
                  <li key={line}>{plain(line)}</li>
                ))}
              </ul>
            </div>
            <div className="knowledge-stack-block">
              <h3>What remains uncertain</h3>
              <ul>
                {story.knowledge_summary.what_remains_uncertain.map((line) => (
                  <li key={line}>{plain(line)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sources',
      kicker: 'Source index',
      title: 'Named sources for this story',
      image: sectionImage(story, usedImageKeys, {
        placements: ['sources'],
        sourceIds: story.sources.map((s) => s.id),
      }),
      sources: uniqueSources(story.sources),
      body: (
        <div className="doc-detail">
          <SourceIndex story={story} compact />
        </div>
      ),
    },
  )

  return ensureEverySectionHasImage(sections, story, usedImageKeys)
}

/** Every section must show an image; fill gaps from unused watercolors. */
function ensureEverySectionHasImage(
  sections: StorySectionDef[],
  story: Story,
  usedKeys: Set<string>,
): StorySectionDef[] {
  const storyId = story.event.id
  for (const section of sections) {
    if (section.image) continue
    const unused = (story.media ?? []).filter((m) => {
      if (!isUsablePhoto(m, storyId)) return false
      const url = resolveLocalUrl(m)
      return !usedKeys.has(imageKey(url))
    })
    const pick =
      unused.find((m) => isWatercolor(m)) ??
      unused[0] ??
      (story.media ?? []).find((m) => isUsablePhoto(m, storyId) && isWatercolor(m))
    if (!pick) continue
    const display = asDisplayMedia(pick, storyId)
    if (!display) continue
    usedKeys.add(imageKey(display.url))
    section.image = display
  }
  return sections
}

function ClaimDetail({
  claim,
  meaning,
  hideBadge = false,
}: {
  claim: Claim
  meaning?: string
  hideBadge?: boolean
}) {
  return (
    <div className="doc-claim">
      {hideBadge ? null : (
        <div className="doc-claim-head">
          <EvidenceBadge level={claim.evidence_level} meaning={meaning} />
        </div>
      )}
      <p className="doc-claim-text">{plain(claim.text)}</p>
      {claim.caveat ? <p className="doc-claim-caveat">{plain(claim.caveat)}</p> : null}
    </div>
  )
}
