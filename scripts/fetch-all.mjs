/**
 * Fetch live provenance for Ripple stories:
 * - HEAD/GET trusted source URLs
 * - Wikimedia Commons extmetadata (credit, license, date, artist)
 * - Write enriched media + fetch log into public/data
 *
 * Run: node scripts/fetch-all.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dataDir = path.join(root, 'public', 'data')
const cacheDir = path.join(dataDir, '_cache')

fs.mkdirSync(cacheDir, { recursive: true })

const UA = 'RippleMVP/0.1 (research; local educational build)'

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function fetchText(url, { timeout = 25000 } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: '*/*' },
      redirect: 'follow',
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, url: res.url, text, contentType: res.headers.get('content-type') }
  } finally {
    clearTimeout(t)
  }
}

async function headOk(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': UA },
      redirect: 'follow',
    })
    return { ok: res.ok, status: res.status, finalUrl: res.url, contentType: res.headers.get('content-type') }
  } catch (e) {
    return { ok: false, status: 0, error: String(e.message || e) }
  }
}

function stripHtml(s = '') {
  return String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

async function commonsMeta(filename) {
  const title = filename.startsWith('File:') ? filename : `File:${filename}`
  const api =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata|size|mime',
      iiurlwidth: '1280',
      format: 'json',
      origin: '*',
    })
  await sleep(800)
  const { ok, text, status } = await fetchText(api)
  if (!ok) throw new Error(`Commons API ${status} for ${filename}`)
  const json = JSON.parse(text)
  const page = Object.values(json.query.pages)[0]
  if (page.missing != null) throw new Error(`Missing Commons file ${filename}`)
  const ii = page.imageinfo[0]
  const em = ii.extmetadata || {}
  return {
    filename,
    url: (ii.thumburl || ii.url || '').replace(/\?.*$/, ''),
    original_url: (ii.url || '').replace(/\?.*$/, ''),
    credit_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title).replace(/%3A/g, ':')}`,
    artist: stripHtml(em.Artist?.value),
    credit: stripHtml(em.Credit?.value),
    license: em.LicenseShortName?.value || em.License?.value || 'unknown',
    license_url: em.LicenseUrl?.value || null,
    date_taken: em.DateTimeOriginal?.value || em.DateTime?.value || null,
    description: stripHtml(em.ImageDescription?.value || ''),
    fetched_at: new Date().toISOString().slice(0, 10),
    source_host: 'commons.wikimedia.org',
  }
}

function listStoryFiles() {
  return fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith('.json') && f !== 'stories.json' && !f.startsWith('_'))
}

async function enrichStory(file) {
  const full = path.join(dataDir, file)
  const story = JSON.parse(fs.readFileSync(full, 'utf8'))
  const log = { file, sources: [], media: [], fetched_at: new Date().toISOString() }

  for (const source of story.sources || []) {
    const check = await headOk(source.url)
    source.fetch = {
      ok: check.ok,
      http_status: check.status,
      checked_at: new Date().toISOString().slice(0, 10),
      final_url: check.finalUrl || source.url,
      content_type: check.contentType || null,
      error: check.error || null,
    }
    log.sources.push({ id: source.id, ...source.fetch })
    await sleep(200)
  }

  const media = story.media || []
  for (const item of media) {
    if (!item.commons_file) continue
    try {
      const meta = await commonsMeta(item.commons_file)
      item.url = meta.url || item.url
      item.original_url = meta.original_url
      item.credit = [meta.artist, meta.license].filter(Boolean).join(' · ') || item.credit
      item.credit_detail = meta.credit
      item.credit_url = meta.credit_url
      item.license = meta.license
      item.license_url = meta.license_url
      item.date_taken = meta.date_taken
      item.fetched_from = 'wikimedia_commons_api'
      item.fetched_at = meta.fetched_at
      if (!item.imagery_type) item.imagery_type = 'context'
      log.media.push({ id: item.id, ok: true, file: item.commons_file, credit: item.credit })
    } catch (e) {
      log.media.push({ id: item.id, ok: false, file: item.commons_file, error: String(e.message || e) })
    }
  }

  story.provenance = {
    fetched_at: new Date().toISOString().slice(0, 10),
    method: 'scripts/fetch-all.mjs — live HEAD of sources + Commons imageinfo/extmetadata',
    note: 'Claims remain hand-curated from named sources. Imagery credits are fetched live from Wikimedia when commons_file is set. Event-day photos are used only when a free-licensed near-event file exists; otherwise imagery_type=context.',
  }

  fs.writeFileSync(full, JSON.stringify(story, null, 2) + '\n')
  fs.writeFileSync(path.join(cacheDir, file.replace('.json', '.fetch.json')), JSON.stringify(log, null, 2))
  return log
}

async function main() {
  const files = listStoryFiles()
  console.log(`Enriching ${files.length} stories…`)
  const summary = []
  for (const file of files) {
    console.log(`→ ${file}`)
    try {
      summary.push(await enrichStory(file))
    } catch (e) {
      console.error(`  FAIL ${file}:`, e.message || e)
      summary.push({ file, error: String(e.message || e) })
    }
  }
  fs.writeFileSync(path.join(cacheDir, 'last-fetch-summary.json'), JSON.stringify(summary, null, 2))
  console.log('Done. Cache in public/data/_cache/')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
