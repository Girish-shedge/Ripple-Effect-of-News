import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { StoryCatalogItem } from '../types'
import { formatNewsDate } from '../lib/format'
import { IconChevronDown } from './icons'

const ALL = 'all'

type Filters = {
  region: string
  theme: string
  year: string
}

/** Normalize catalog fields so filters stay useful as the archive grows. */
export function catalogRegion(item: StoryCatalogItem): string {
  if (item.region?.trim()) return item.region.trim()
  const loc = item.location.toLowerCase()
  if (loc.includes('nepal') || loc.includes('india') || loc.includes('pakistan') || loc.includes('jamnagar') || loc.includes('bhopal')) {
    return 'South Asia'
  }
  if (loc.includes('europe') || loc.includes('spain') || loc.includes('portugal')) return 'Europe'
  if (loc.includes('central asia') || loc.includes('aral')) return 'Central Asia'
  if (loc.includes('mexico') || loc.includes('gulf') || loc.includes('united states')) return 'Americas'
  if (loc.includes('global') || loc.includes('worldwide')) return 'Global'
  return item.location.split(',')[0]?.trim() || 'Other'
}

export function catalogTheme(item: StoryCatalogItem): string {
  if (item.theme?.trim()) return item.theme.trim()
  const blob = `${item.id} ${item.headline} ${item.subheading}`.toLowerCase()
  if (/(heat|wildfire|flood|climate|warming|monsoon|fire weather)/.test(blob)) return 'Climate extremes'
  if (/(oil|gas|groundwater|toxic|spill|dolphin|bhopal)/.test(blob)) return 'Pollution & health'
  if (/(inflation|price|market|hunger|food)/.test(blob)) return 'Economy & food'
  if (/(data centre|datacentre|ai |renewable|compute)/.test(blob)) return 'Technology & energy'
  if (/(aral|dust|irrigation|desert|sea)/.test(blob)) return 'Water & land'
  return 'Other'
}

export function catalogYear(item: StoryCatalogItem): string {
  return item.date.slice(0, 4)
}

/**
 * Editorial rank. Lower number is shown first and can take a featured tile.
 * Explicit `rank` on the catalog item always wins.
 *
 * Fallback score (when rank is missing): recency first, then theme urgency
 * (climate and pollution ahead of slower historical processes).
 */
export function catalogRank(item: StoryCatalogItem): number {
  if (typeof item.rank === 'number' && Number.isFinite(item.rank)) return item.rank
  const year = Number(catalogYear(item)) || 0
  const recency = 3000 - year
  const theme = catalogTheme(item)
  const themeWeight: Record<string, number> = {
    'Climate extremes': 0,
    'Pollution & health': 12,
    'Technology & energy': 18,
    'Economy & food': 24,
    'Water & land': 30,
  }
  return recency + (themeWeight[theme] ?? 36)
}

export function rankStories(items: StoryCatalogItem[]): StoryCatalogItem[] {
  return [...items].sort((a, b) => {
    const rank = catalogRank(a) - catalogRank(b)
    if (rank !== 0) return rank
    return b.date.localeCompare(a.date)
  })
}

/** Map a ranked index onto the home bento: two featured tiles, then small cells. */
export function catalogSlot(index: number, total: number): string {
  if (total >= 8) {
    if (index === 0) return 'hero-tl'
    if (index === 1) return 'hero-br'
    if (index === total - 1) return 'wide'
    return 'small'
  }
  if (total >= 5 && index === 0) return 'hero-tl'
  return 'small'
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

export function NewsListPage() {
  const [catalog, setCatalog] = useState<StoryCatalogItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    region: ALL,
    theme: ALL,
    year: ALL,
  })

  useEffect(() => {
    fetch('/data/stories.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<StoryCatalogItem[]>
      })
      .then((items) => {
        setCatalog(rankStories(items))
      })
      .catch(() => setError('Could not load the news catalog.'))
  }, [])

  const options = useMemo(() => {
    if (!catalog) return { regions: [] as string[], themes: [] as string[], years: [] as string[] }
    return {
      regions: uniqueSorted(catalog.map(catalogRegion)),
      themes: uniqueSorted(catalog.map(catalogTheme)),
      years: uniqueSorted(catalog.map(catalogYear)).sort((a, b) => b.localeCompare(a)),
    }
  }, [catalog])

  const filtered = useMemo(() => {
    if (!catalog) return []
    return rankStories(
      catalog.filter((item) => {
        if (filters.region !== ALL && catalogRegion(item) !== filters.region) return false
        if (filters.theme !== ALL && catalogTheme(item) !== filters.theme) return false
        if (filters.year !== ALL && catalogYear(item) !== filters.year) return false
        return true
      }),
    )
  }, [catalog, filters])

  const activeCount = [filters.region, filters.theme, filters.year].filter((v) => v !== ALL).length

  if (error) {
    return (
      <main className="boot">
        <p>{error}</p>
      </main>
    )
  }

  if (!catalog) {
    return (
      <main className="boot">
        <p>Loading news…</p>
      </main>
    )
  }

  return (
    <div className="news-page">
      <header className="news-page-head">
        <h1>Ripple Effects of News</h1>
        <p className="news-page-sub">
          Hand-traced causal chains behind the headlines, with evidence strength visible on every
          link.
        </p>
      </header>

      <div className="news-filters" role="search" aria-label="Filter stories">
        <FilterSelect
          id="filter-region"
          label="Region"
          value={filters.region}
          options={options.regions}
          onChange={(region) => setFilters((f) => ({ ...f, region }))}
        />
        <FilterSelect
          id="filter-theme"
          label="Theme"
          value={filters.theme}
          options={options.themes}
          onChange={(theme) => setFilters((f) => ({ ...f, theme }))}
        />
        <FilterSelect
          id="filter-year"
          label="Year"
          value={filters.year}
          options={options.years}
          onChange={(year) => setFilters((f) => ({ ...f, year }))}
        />
        {activeCount > 0 ? (
          <button
            type="button"
            className="news-filters-clear"
            onClick={() => setFilters({ region: ALL, theme: ALL, year: ALL })}
          >
            Clear
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="news-filters-empty">No stories match these filters.</p>
      ) : (
        <div className="news-page-grid" role="list">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="news-page-card"
              role="listitem"
              data-slot={catalogSlot(index, filtered.length)}
            >
              <Link className="news-page-card-link" to={`/story/${item.id}`}>
                <div className="news-card-img">
                  <img
                    src={item.image_url}
                    alt={item.image_alt}
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (!el.dataset.fallback) {
                        el.dataset.fallback = '1'
                        el.src = '/media/section-sources-cover.svg'
                      }
                    }}
                  />
                </div>
                <time className="news-card-date" dateTime={item.date}>
                  {formatNewsDate(item.date)}
                </time>
                <h3 className="news-card-headline">{item.headline}</h3>
                <p className="news-card-sub">{item.subheading}</p>
                <span className="news-card-org">{item.location}</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="news-filter" htmlFor={id}>
      <span className="news-filter-control">
        <select
          id={id}
          className="news-filter-select"
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value={ALL}>
            {label}: All
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {label}: {opt}
            </option>
          ))}
        </select>
        <span className="news-filter-chevron" aria-hidden="true">
          <IconChevronDown size={16} />
        </span>
      </span>
    </label>
  )
}
