import { useEffect, useMemo, useState } from 'react'
import { IconMoon, IconSun } from './icons'
import { useTheme } from '../lib/theme'

type Market = 'India' | 'USA'

type Instrument = {
  symbol: string
  market: Market
  name: string
}

type Quote = Instrument & {
  price: number | null
  changePct: number | null
}

const INSTRUMENTS: Instrument[] = [
  { symbol: '^NSEI', market: 'India', name: 'Nifty 50' },
  { symbol: '^BSESN', market: 'India', name: 'Sensex' },
  { symbol: '^GSPC', market: 'USA', name: 'S&P 500' },
  { symbol: '^DJI', market: 'USA', name: 'Dow Jones' },
  { symbol: '^IXIC', market: 'USA', name: 'Nasdaq' },
]

const CACHE_KEY = 'ripple-market-quotes'

function chartPath(symbol: string) {
  return `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`
}

function quoteUrls(symbol: string): string[] {
  const path = chartPath(symbol)
  return [
    `/api/yahoo${path}`,
    `https://query1.finance.yahoo.com${path}`,
    `https://corsproxy.io/?${encodeURIComponent(`https://query1.finance.yahoo.com${path}`)}`,
  ]
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

function parseChart(data: unknown): { price: number; prev: number } | null {
  const meta = (data as { chart?: { result?: Array<{ meta?: Record<string, unknown> }> } })
    ?.chart?.result?.[0]?.meta
  if (!meta) return null
  const price = Number(meta.regularMarketPrice)
  const prev = Number(meta.chartPreviousClose ?? meta.previousClose)
  if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) return null
  return { price, prev }
}

async function fetchQuote(item: Instrument): Promise<Quote> {
  let lastError: unknown
  for (const url of quoteUrls(item.symbol)) {
    try {
      const parsed = parseChart(await fetchJson(url))
      if (!parsed) continue
      return {
        ...item,
        price: parsed.price,
        changePct: ((parsed.price - parsed.prev) / parsed.prev) * 100,
      }
    } catch (err) {
      lastError = err
    }
  }
  throw lastError instanceof Error ? lastError : new Error('quote failed')
}

function readCache(): Quote[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Quote[]
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(quotes: Quote[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(quotes))
  } catch {
    /* ignore */
  }
}

function formatPrice(value: number | null) {
  if (value == null) return '-'
  return value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}

function formatChange(value: number | null) {
  if (value == null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function QuoteChip({ quote }: { quote: Quote }) {
  const dir = quote.changePct == null ? 'flat' : quote.changePct > 0 ? 'up' : quote.changePct < 0 ? 'down' : 'flat'
  return (
    <span className="market-quote">
      <span className="market-quote-name">{quote.name}</span>
      <span className="market-quote-price">{formatPrice(quote.price)}</span>
      <span className="market-quote-change" data-dir={dir}>
        {formatChange(quote.changePct)}
      </span>
    </span>
  )
}

function MarketGroup({ market, quotes }: { market: Market; quotes: Quote[] }) {
  const items = quotes.filter((q) => q.market === market)
  if (!items.length) return null
  return (
    <span className="market-group">
      <span className="market-group-label">{market}</span>
      {items.map((quote) => (
        <QuoteChip key={quote.symbol} quote={quote} />
      ))}
    </span>
  )
}

export function MarketMarquee() {
  const { theme, toggle } = useTheme()
  const [quotes, setQuotes] = useState<Quote[]>(() => readCache() ?? INSTRUMENTS.map((i) => ({ ...i, price: null, changePct: null })))

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const results = await Promise.allSettled(INSTRUMENTS.map(fetchQuote))
      if (cancelled) return
      setQuotes((prev) => {
        const next = INSTRUMENTS.map((item, i) => {
          const result = results[i]
          if (result.status === 'fulfilled') return result.value
          return prev.find((q) => q.symbol === item.symbol) ?? { ...item, price: null, changePct: null }
        })
        if (next.some((q) => q.price != null)) writeCache(next)
        return next
      })
    }

    void load()
    const id = window.setInterval(() => void load(), 60_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const tape = useMemo(
    () => (
      <>
        <MarketGroup market="India" quotes={quotes} />
        <MarketGroup market="USA" quotes={quotes} />
      </>
    ),
    [quotes],
  )

  return (
    <div className="market-bar" role="region" aria-label="India and USA stock markets">
      <div className="market-bar-track">
        <div className="market-bar-marquee">
          <div className="market-bar-copy">{tape}</div>
          <div className="market-bar-copy" aria-hidden="true">
            {tape}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  )
}
