/**
 * Ensure catalog + story covers use place-correct local media under /media.
 *
 * IMPORTANT: Never map Story A to a photo of Place B.
 * Wrong mappings here caused Europe heat → Himalaya, Aral Sea → Nepal river, etc.
 *
 * Run after: node scripts/cache-images.mjs
 * Prefer: npm run media:sync
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.join(__dirname, '..', 'public', 'media')
const dataDir = path.join(__dirname, '..', 'public', 'data')
fs.mkdirSync(mediaDir, { recursive: true })

/** Place-correct local photos (must match scripts/cache-images.mjs assets). */
const STORY_PHOTO = {
  nepal_flood_2026: {
    file: 'Langtang_Lirung.jpg',
    alt: 'Langtang Lirung mountain in Nepal',
  },
  europe_heatwave_2026: {
    file: 'Heat_Paris_summer.jpg',
    alt: 'Western Europe city context during summer heat',
  },
  iberia_wildfires_2025: {
    file: 'Incendio_forestal.jpg',
    alt: 'Forest fire flames and smoke',
  },
  south_asia_heat_2026: {
    file: 'Gujarat_satellite_view.jpg',
    alt: 'South Asia regional geography context',
  },
  reliance_ai_datacentre_2026: {
    file: 'Jamnagar_Refinery.jpg',
    alt: 'Jamnagar industrial coast, Gujarat',
  },
  aral_sea_desiccation: {
    file: 'Aral_Sea_comparison.jpg',
    alt: 'Shrinking Aral Sea from space',
  },
  deepwater_horizon_2010: {
    file: 'Deepwater_Horizon_slick.jpg',
    alt: 'Deepwater Horizon oil slick from space',
  },
  bhopal_1984: {
    file: 'Bhopal_memorial.jpg',
    alt: 'Bhopal gas tragedy memorial',
  },
  global_inflation_2022: {
    file: 'Wheat_harvest.jpg',
    alt: 'Wheat harvest — food price context',
  },
}

function hasPhoto(name) {
  const p = path.join(mediaDir, name)
  return fs.existsSync(p) && fs.statSync(p).size > 5000
}

function svgCover({ id, title, accent, bg }) {
  const file = `${id}-cover.svg`
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#g)"/>
  <circle cx="980" cy="120" r="180" fill="rgba(255,255,255,0.08)"/>
  <circle cx="160" cy="620" r="220" fill="rgba(0,0,0,0.12)"/>
  <text x="64" y="620" fill="#fff" font-family="Georgia, serif" font-size="42" font-weight="700">${escapeXml(title)}</text>
  <text x="64" y="670" fill="rgba(255,255,255,0.75)" font-family="ui-monospace, monospace" font-size="18">Ripple - context cover</text>
</svg>`
  fs.writeFileSync(path.join(mediaDir, file), svg)
  return `/media/${file}`
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function coverForStory(id, headline) {
  const meta = STORY_PHOTO[id]
  if (meta && hasPhoto(meta.file)) {
    return { url: `/media/${meta.file}`, alt: meta.alt, kind: 'photo' }
  }
  const title = (headline || id).slice(0, 48)
  return {
    url: svgCover({
      id: id.replace(/_/g, '-'),
      title,
      accent: '#5a534a',
      bg: '#1a1814',
    }),
    alt: headline || id,
    kind: 'svg',
  }
}

const catalogPath = path.join(dataDir, 'stories.json')
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const report = []

for (const item of catalog) {
  const cover = coverForStory(item.id, item.headline)
  item.image_url = cover.url
  item.image_alt = cover.alt
  report.push({ id: item.id, cover: cover.url, kind: cover.kind })

  const storyPath = path.join(dataDir, path.basename(item.data_file))
  if (!fs.existsSync(storyPath)) continue
  const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'))
  if (!story.media) story.media = []

  const hero = story.media.find((m) => m.placement === 'hero')
  if (!hero) {
    story.media.unshift({
      id: 'hero',
      url: cover.url,
      credit: cover.kind === 'photo' ? 'Local verified media cache' : 'Ripple local cover',
      caption: item.headline,
      alt: cover.alt,
      placement: 'hero',
      imagery_type: 'location_context',
    })
  } else {
    // Only rewrite hero when missing, remote, SVG, or known wrong-place reuse
    const wrong =
      !hero.url ||
      hero.url.includes('wikimedia') ||
      hero.url.includes('Special:FilePath') ||
      hero.url.endsWith('.svg') ||
      isCrossPlaceMismatch(item.id, hero.url)
    if (wrong && cover.kind === 'photo') {
      hero.url = cover.url
      hero.alt = cover.alt
      hero.note =
        (hero.note ? hero.note + ' ' : '') +
        'Hero remapped to place-correct local /media file by ensure-local-media.'
    }
  }

  // Do NOT blanket-replace every media URL with the story cover (that caused
  // Trishuli captions pointing at Langtang files, Europe using Himalaya, etc.)
  fs.writeFileSync(storyPath, JSON.stringify(story, null, 2) + '\n')
}

function isCrossPlaceMismatch(storyId, url) {
  const file = String(url).split('/').pop() || ''
  const expected = STORY_PHOTO[storyId]?.file
  if (!expected) return false
  // Flag known wrong Nepal assets on non-Nepal stories
  const nepalOnly = new Set(['Langtang_Lirung.jpg', 'Langtang_Lirung_Himal.jpg', 'Trishuli_river_nepal.jpg'])
  if (storyId !== 'nepal_flood_2026' && nepalOnly.has(file)) return true
  return false
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n')
fs.writeFileSync(path.join(mediaDir, 'covers.json'), JSON.stringify({ stories: report }, null, 2))
console.log('Place-correct covers applied:')
for (const row of report) console.log(`  ${row.id} → ${row.cover} (${row.kind})`)
