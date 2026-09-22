/**
 * Download story imagery to public/media so the UI never depends on flaky Commons redirects.
 * Place-correct only — each asset is tagged for the stories that may use it.
 *
 * Run: node scripts/cache-images.mjs
 * Prefer: npm run media:sync
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'media')
fs.mkdirSync(outDir, { recursive: true })

/**
 * Hand-picked Commons originals. Keep `stories` in sync with ensure-local-media.mjs.
 * If a URL 404s, replace with another verified upload.wikimedia.org original for the SAME place.
 */
const ASSETS = [
  {
    id: 'langtang',
    file: 'Langtang_Lirung.jpg',
    stories: ['nepal_flood_2026'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Langtang_Lirung.jpg',
  },
  {
    id: 'langtang_himal',
    file: 'Langtang_Lirung_Himal.jpg',
    stories: ['nepal_flood_2026'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Langtang_Lirung_Himal.jpg',
  },
  {
    id: 'trishuli',
    file: 'Trishuli_river_nepal.jpg',
    stories: ['nepal_flood_2026'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Trishuli_river_nepal.jpg',
  },
  {
    id: 'gujarat',
    file: 'Gujarat_satellite_view.jpg',
    stories: ['south_asia_heat_2026', 'reliance_ai_datacentre_2026'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Gujarat_satellite_view.jpg',
  },
  {
    id: 'jamnagar',
    file: 'Jamnagar_Refinery.jpg',
    stories: ['reliance_ai_datacentre_2026'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Jamnagar_Refinery.jpg',
  },
  {
    id: 'incendio',
    file: 'Incendio_forestal.jpg',
    stories: ['iberia_wildfires_2025'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Incendio_forestal.jpg',
  },
  {
    id: 'heat_city',
    file: 'Heat_Paris_summer.jpg',
    stories: ['europe_heatwave_2026'],
    // Alternate Europe summer city photo (Eiffel widescreen 404'd)
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Paris_Night.jpg',
  },
  {
    id: 'aral',
    file: 'Aral_Sea_comparison.jpg',
    stories: ['aral_sea_desiccation'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/AralSea1989_2014.jpg',
  },
  {
    id: 'dwh',
    file: 'Deepwater_Horizon_slick.jpg',
    stories: ['deepwater_horizon_2010'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Oil_Spill%2C_Gulf_of_Mexico%2C_May_2010.jpg',
  },
  {
    id: 'bhopal',
    file: 'Bhopal_memorial.jpg',
    stories: ['bhopal_1984'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bhopal_disaster_memorial.jpg',
  },
  {
    id: 'grain',
    file: 'Wheat_harvest.jpg',
    stories: ['global_inflation_2022'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Wheat_close-up.jpg',
  },
]

const UA = 'RippleMVP/0.1 (local cache; educational; polite crawler)'

async function download(asset, attempt = 1) {
  const dest = path.join(outDir, asset.file)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    console.log('skip', asset.file)
    return true
  }
  try {
    const res = await fetch(asset.url, {
      headers: { 'User-Agent': UA },
      redirect: 'follow',
    })
    if (res.status === 429 && attempt < 4) {
      const wait = attempt * 8000
      console.log('rate-limited', asset.file, `retry in ${wait}ms`)
      await new Promise((r) => setTimeout(r, wait))
      return download(asset, attempt + 1)
    }
    if (!res.ok) {
      console.log('FAIL', asset.file, res.status, asset.url)
      return false
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1000) {
      console.log('FAIL tiny', asset.file, buf.length)
      return false
    }
    fs.writeFileSync(dest, buf)
    console.log('ok', asset.file, buf.length)
    return true
  } catch (e) {
    console.log('ERR', asset.file, e.message)
    return false
  }
}

const results = {}
for (const a of ASSETS) {
  results[a.id] = (await download(a)) ? `/media/${a.file}` : null
  await new Promise((r) => setTimeout(r, 1200))
}
fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify({ fetched_at: new Date().toISOString(), results, assets: ASSETS }, null, 2),
)
console.log('manifest', results)
