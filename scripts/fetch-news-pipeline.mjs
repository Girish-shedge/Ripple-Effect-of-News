/**
 * Ripple news discovery pipeline (trusted-sources compliant).
 *
 * Follows ripple-trusted-sources.md:
 * - Tier 1 APIs for events/facts (NASA EONET, GDACS, USGS)
 * - Tier 3 discovery via GDELT metadata ONLY (headline, outlet, date, URL)
 * - Never scrape or store full copyrighted article text
 *
 * Output: public/data/_inbox/news-candidates.json
 *
 * Run: node scripts/fetch-news-pipeline.mjs
 * Or:  npm run fetch:news
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const inboxDir = path.join(root, 'public', 'data', '_inbox')
fs.mkdirSync(inboxDir, { recursive: true })

const UA = 'RippleNewsPipeline/0.1 (educational; respects robots; metadata only)'
const DAYS = Number(process.env.RIPPLE_NEWS_DAYS || 14)
const GDELT_QUERY =
  process.env.RIPPLE_GDELT_QUERY ||
  '(climate OR flood OR wildfire OR heatwave OR drought OR earthquake OR cyclone OR hurricane)'

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchJson(url, { timeout = 30000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      redirect: 'follow',
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return JSON.parse(text)
  } finally {
    clearTimeout(t)
  }
}

function isoDaysAgo(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

/** Tier 1 — NASA EONET open events */
async function fetchEonet() {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=40'
  const data = await fetchJson(url)
  return (data.events || []).map((ev) => {
    const geo = ev.geometry?.[0]
    return {
      id: `eonet:${ev.id}`,
      tier: 1,
      organization: 'NASA EONET',
      source_type: 'agency',
      credibility_class: 'institutional',
      title: ev.title,
      category: ev.categories?.map((c) => c.title).join(', ') || null,
      date: geo?.date?.slice(0, 10) || null,
      url: ev.sources?.[0]?.url || `https://eonet.gsfc.nasa.gov/api/v3/events/${ev.id}`,
      location: geo?.coordinates
        ? { lng: geo.coordinates[0], lat: geo.coordinates[1] }
        : null,
      discovery: 'nasa_eonet',
      note: 'Primary natural-event feed. Use for event discovery; verify numbers from ReliefWeb/agency reports before citing impacts.',
    }
  })
}

/** Tier 1 — GDACS RSS/JSON events map */
async function fetchGdacs() {
  // GDACS 24h JSON endpoint
  const url = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromdate=' +
    encodeURIComponent(isoDaysAgo(DAYS)) +
    '&todate=' +
    encodeURIComponent(new Date().toISOString().slice(0, 10)) +
    '&alertlevel=Orange;Red&limit=40'
  try {
    const data = await fetchJson(url)
    const features = data.features || data || []
    const list = Array.isArray(features) ? features : []
    return list.slice(0, 40).map((f, i) => {
      const p = f.properties || f
      const eid = p.eventid || p.eventId || p.eventid_iso3 || p.name || i
      return {
        id: `gdacs:${String(eid)}`,
        tier: 1,
        organization: 'GDACS',
        source_type: 'agency',
        credibility_class: 'institutional',
        title: String(p.name || p.eventname || p.htmldescription || 'GDACS alert'),
        category: p.eventtype || p.Type || null,
        date: (p.fromdate || p.date || '').toString().slice(0, 10) || null,
        url: String(p.url || p.url_eventid || 'https://www.gdacs.org/'),
        location: f.geometry?.coordinates
          ? { lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }
          : null,
        alert_level: p.alertlevel || p.AlertLevel || null,
        discovery: 'gdacs',
        note: 'Disaster alert feed with severity. Cross-check impacts via ReliefWeb / national agencies.',
      }
    })
  } catch (e) {
    console.warn('GDACS fetch skipped:', e.message || e)
    return []
  }
}

/** Tier 1 — USGS significant earthquakes (M4.5+, past N days) */
async function fetchUsgs() {
  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${isoDaysAgo(DAYS)}&minmagnitude=4.5&orderby=time&limit=40`
  const data = await fetchJson(url)
  return (data.features || []).map((f) => {
    const p = f.properties || {}
    const c = f.geometry?.coordinates || []
    return {
      id: `usgs:${f.id}`,
      tier: 1,
      organization: 'USGS',
      source_type: 'agency',
      credibility_class: 'institutional',
      title: p.title || `M${p.mag} earthquake`,
      category: 'earthquake',
      date: p.time ? new Date(p.time).toISOString().slice(0, 10) : null,
      url: p.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`,
      location: c.length >= 2 ? { lng: c[0], lat: c[1], depth_km: c[2] } : null,
      magnitude: p.mag ?? null,
      discovery: 'usgs_earthquake',
      note: 'Primary seismic feed. Do not invent damage figures — wait for agency/ReliefWeb assessments.',
    }
  })
}

/**
 * Tier 3 discovery via GDELT — metadata only (headline, outlet, date, URL).
 * Never store article body.
 */
async function fetchGdelt() {
  const start = isoDaysAgo(DAYS).replace(/-/g, '') + '000000'
  const url =
    'https://api.gdeltproject.org/api/v2/doc/doc?' +
    new URLSearchParams({
      query: GDELT_QUERY,
      mode: 'ArtList',
      maxrecords: '40',
      format: 'json',
      sort: 'DateDesc',
      startdatetime: start,
    })
  try {
    await sleep(5500) // GDELT ~1 req / 5 sec
    const data = await fetchJson(url, { timeout: 45000 })
    return (data.articles || []).map((a, i) => ({
      id: `gdelt:${a.url || i}`,
      tier: 3,
      organization: a.domain || a.sourceCountry || 'Wire/outlet (via GDELT)',
      source_type: 'wire_discovery',
      credibility_class: 'discovery_only',
      title: a.title,
      category: 'press_coverage',
      date: (a.seendate || '').slice(0, 8)
        ? `${a.seendate.slice(0, 4)}-${a.seendate.slice(4, 6)}-${a.seendate.slice(6, 8)}`
        : null,
      url: a.url,
      location: a.sourcecountry || null,
      discovery: 'gdelt',
      note:
        'Discovery metadata only. Do not scrape or store article text. Find the Tier 1 number behind the headline before citing.',
    }))
  } catch (e) {
    console.warn('GDELT fetch skipped:', e.message || e)
    return []
  }
}

async function headCheck(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': UA },
      redirect: 'follow',
    })
    return { ok: res.ok, status: res.status, final_url: res.url }
  } catch (e) {
    return { ok: false, status: 0, error: String(e.message || e) }
  }
}

function dedupe(candidates) {
  const seen = new Set()
  const out = []
  for (const c of candidates) {
    const key = String(c.url || c.id || '').toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(c)
  }
  return out
}

async function main() {
  console.log(`Ripple news pipeline — last ${DAYS} days`)
  console.log('Policy: ripple-trusted-sources.md (no full-text scrape)\n')

  const batches = []
  for (const [name, fn] of [
    ['NASA EONET', fetchEonet],
    ['GDACS', fetchGdacs],
    ['USGS', fetchUsgs],
    ['GDELT (metadata)', fetchGdelt],
  ]) {
    process.stdout.write(`→ ${name}… `)
    try {
      const rows = await fn()
      console.log(`${rows.length} items`)
      batches.push(...rows)
    } catch (e) {
      console.log(`FAIL (${e.message || e})`)
    }
    await sleep(400)
  }

  let candidates = dedupe(batches)

  // Light HEAD check on first 25 Tier 1 URLs only
  let checked = 0
  for (const c of candidates) {
    if (c.tier !== 1 || checked >= 25) continue
    c.fetch = await headCheck(c.url)
    checked++
    await sleep(150)
  }

  const payload = {
    fetched_at: new Date().toISOString(),
    policy: 'ripple-trusted-sources.md',
    window_days: DAYS,
    counts: {
      total: candidates.length,
      tier1: candidates.filter((c) => c.tier === 1).length,
      tier3_discovery: candidates.filter((c) => c.tier === 3).length,
    },
    next_steps: [
      'Review public/data/_inbox/news-candidates.json',
      'For each candidate worth a Ripple story: find Tier 1 numbers (ReliefWeb, FAO, WWA, agency PDFs)',
      'Author public/data/<id>.json by hand (or extend a seed script) — never paste wire article prose',
      'Add catalog row in stories.json',
      'npm run media:sync && npm run fetch:stories',
    ],
    candidates,
  }

  const outPath = path.join(inboxDir, 'news-candidates.json')
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n')
  fs.writeFileSync(
    path.join(inboxDir, 'last-news-fetch-summary.json'),
    JSON.stringify(
      {
        fetched_at: payload.fetched_at,
        counts: payload.counts,
        sample_titles: candidates.slice(0, 12).map((c) => ({
          tier: c.tier,
          org: c.organization,
          title: c.title,
        })),
      },
      null,
      2,
    ) + '\n',
  )

  console.log(`\nWrote ${candidates.length} candidates → ${path.relative(root, outPath)}`)
  console.log('Next: curate Tier 1 facts into a story JSON (do not ingest wire article text).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
