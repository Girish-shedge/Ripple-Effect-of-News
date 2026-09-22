/**
 * Wire generated watercolor PNGs into story JSON + catalog covers.
 * Expects files in public/media/ as wc-<short>-<slot>.png
 *
 * Usage: node scripts/apply-watercolor-media.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WATERCOLOR_CREDIT, WATERCOLOR_NOTE } from './watercolor-media.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const mediaDir = path.join(root, 'public', 'media')
const dataDir = path.join(root, 'public', 'data')

const SHORT = {
  nepal_flood_2026: 'nepal',
  reliance_ai_datacentre_2026: 'reliance',
  europe_heatwave_2026: 'europe',
  iberia_wildfires_2025: 'iberia',
  south_asia_heat_2026: 'southasia',
  aral_sea_desiccation: 'aral',
  deepwater_horizon_2010: 'dwh',
  bhopal_1984: 'bhopal',
  global_inflation_2022: 'inflation',
}

/** Nepal early filenames used shorter slot names. */
const SLOT_ALIASES = {
  nepal: {
    mountain_instability: 'instability',
    debris_cascade: 'debris',
    infrastructure_ag_damage: 'infrastructure',
    food_production_loss: 'crops',
    economic_effects: 'economy',
  },
}

function exists(file) {
  const p = path.join(mediaDir, file)
  return fs.existsSync(p) && fs.statSync(p).size > 2000
}

function resolveFile(short, slot) {
  const alias = SLOT_ALIASES[short]?.[slot]
  const candidates = []
  if (alias) candidates.push(`wc-${short}-${alias}.png`)
  candidates.push(`wc-${short}-${slot}.png`)
  for (const file of candidates) {
    if (exists(file)) return file
  }
  return null
}

function wcEntry({ id, file, placement, nodeIds, caption, alt }) {
  return {
    id,
    url: `/media/${file}`,
    credit: WATERCOLOR_CREDIT,
    caption,
    alt,
    placement,
    ...(nodeIds ? { node_ids: nodeIds } : {}),
    note: WATERCOLOR_NOTE,
    imagery_type: 'watercolor_illustration',
    fetched_from: 'ripple_ai_watercolor',
    fetched_at: new Date().toISOString().slice(0, 10),
  }
}

const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'stories.json'), 'utf8'))

for (const item of catalog) {
  const short = SHORT[item.id]
  if (!short) continue
  const storyPath = path.join(dataDir, path.basename(item.data_file))
  const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'))
  const place = `${story.event.location.region}, ${story.event.location.country}`

  const coverFile = `wc-${short}-cover.png`
  if (exists(coverFile)) {
    item.image_url = `/media/${coverFile}`
    item.image_alt = `${item.headline} (watercolor)`
  }

  const slots = [
    {
      slot: 'hero',
      placement: 'hero',
      caption: `${story.event.hero} (illustrative watercolor).`,
      alt: `Watercolor for: ${story.event.hero}`,
    },
    {
      slot: 'reach',
      placement: 'impacts',
      caption: `Reach figures for this story (illustrative watercolor).`,
      alt: `Watercolor reach context, ${place}`,
    },
    {
      slot: 'timeline',
      placement: 'timeline',
      caption: `Consequences over time (illustrative watercolor).`,
      alt: `Watercolor timeline context, ${place}`,
    },
    {
      slot: 'predictions',
      placement: 'predictions',
      caption: `Looking ahead (illustrative watercolor).`,
      alt: `Watercolor looking ahead, ${place}`,
    },
    {
      slot: 'knowledge',
      placement: 'knowledge',
      caption: `What we know and what remains uncertain (illustrative watercolor).`,
      alt: `Watercolor knowledge section, ${place}`,
    },
    {
      slot: 'sources',
      placement: 'sources',
      caption: `Source index context (illustrative watercolor).`,
      alt: `Watercolor sources section, ${place}`,
    },
  ]

  for (const node of story.nodes || []) {
    slots.push({
      slot: node.id,
      placement: node.id,
      nodeIds: [node.id],
      caption: `${node.title} (illustrative watercolor).`,
      alt: `Watercolor for: ${node.title}`,
    })
  }

  const byId = new Map()
  for (const s of slots) {
    const file = resolveFile(short, s.slot)
    if (!file) continue
    const id = `wc_${short}_${s.slot}`
    byId.set(
      id,
      wcEntry({
        id,
        file,
        placement: s.placement,
        nodeIds: s.nodeIds,
        caption: s.caption,
        alt: s.alt,
      }),
    )
  }

  if (exists(coverFile) && ![...byId.values()].some((m) => m.placement === 'hero')) {
    byId.set(
      `wc_${short}_hero`,
      wcEntry({
        id: `wc_${short}_hero`,
        file: coverFile,
        placement: 'hero',
        caption: `${story.event.hero} (illustrative watercolor).`,
        alt: `Watercolor for: ${story.event.hero}`,
      }),
    )
  }

  story.media = [...byId.values()]
  fs.writeFileSync(storyPath, JSON.stringify(story, null, 2) + '\n')
  console.log(item.id, 'media', story.media.length, 'cover', item.image_url)
}

fs.writeFileSync(path.join(dataDir, 'stories.json'), JSON.stringify(catalog, null, 2) + '\n')
console.log('Catalog covers updated.')
