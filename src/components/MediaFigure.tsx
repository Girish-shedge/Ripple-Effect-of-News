import type { MediaItem } from '../types'

const FALLBACK = '/media/section-sources-cover.svg'

export function MediaFigure({
  item,
  variant = 'inline',
}: {
  item: MediaItem
  variant?: 'hero' | 'inline' | 'section'
}) {
  const typeLabel = imageryLabel(item.imagery_type)
  return (
    <figure className={`media-figure media-figure--${variant}`}>
      <div className="media-frame">
        <img
          src={item.url}
          alt={item.alt}
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          onLoad={(e) => {
            const el = e.currentTarget
            if (el.naturalWidth === 0 && !el.dataset.fallback) {
              el.dataset.fallback = '1'
              el.src = FALLBACK
            }
          }}
          onError={(e) => {
            const el = e.currentTarget
            if (!el.dataset.fallback) {
              el.dataset.fallback = '1'
              el.src = FALLBACK
            }
          }}
        />
      </div>
      <figcaption>
        <span className="media-caption">{item.caption}</span>
        {typeLabel && <span className="media-type">{typeLabel}</span>}
        {item.note && <span className="media-note">{item.note}</span>}
        <span className="media-credit">
          {item.credit_url ? (
            <a href={item.credit_url} target="_blank" rel="noreferrer">
              {item.credit}
            </a>
          ) : (
            item.credit
          )}
          {item.license ? ` · ${item.license}` : ''}
          {item.date_taken ? ` · taken ${String(item.date_taken).slice(0, 10)}` : ''}
        </span>
      </figcaption>
    </figure>
  )
}

function imageryLabel(type?: string) {
  if (!type) return null
  const map: Record<string, string> = {
    event_day: 'Event-day imagery',
    near_event_context: 'Near-event context',
    location_context: 'Location context',
    campus_context: 'Campus context',
    context: 'Context imagery',
    watercolor_illustration: 'Illustrative watercolor',
  }
  return map[type] ?? type.replace(/_/g, ' ')
}
