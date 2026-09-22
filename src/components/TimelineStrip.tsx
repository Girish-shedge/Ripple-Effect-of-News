import type { TimelineItem } from '../types'
import { EvidenceBadge } from './EvidenceBadge'

export function TimelineStrip({
  items,
  eventDate,
}: {
  items: TimelineItem[]
  eventDate?: string
}) {
  return (
    <ol className="timeline-grid" aria-label="Dated ripple timeline">
      {items.map((item) => (
        <li
          key={item.id}
          id={`timeline-${item.id}`}
          className="timeline-grid-item"
          data-level={item.evidence_level}
        >
          <time className="timeline-date" dateTime={isoHint(item.bucket, eventDate)}>
            {item.bucket}
          </time>
          <strong className="timeline-grid-label">{item.label}</strong>
          <EvidenceBadge level={item.evidence_level} compact />
          <p className="timeline-grid-detail">{item.detail}</p>
        </li>
      ))}
    </ol>
  )
}

function isoHint(bucket: string, eventDate?: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(bucket)) return bucket.slice(0, 10)
  if (/^\d{4}$/.test(bucket)) return `${bucket}-01-01`
  return eventDate ?? undefined
}
