import type { Prediction, Story } from '../types'
import { formatImpact } from '../lib/format'
import { EvidenceBadge } from './EvidenceBadge'
import { IconExternal } from './icons'

export function PredictionsPanel({ story, compact }: { story: Story; compact?: boolean }) {
  const preds = story.predictions ?? []
  if (preds.length === 0) return null
  const byId = new Map(story.sources.map((s) => [s.id, s]))

  return (
    <div className="predictions" aria-label="Trend-based predictions" data-compact={compact || undefined}>
      {!compact && (
        <>
          <h2>Where primary data is missing, we bound it from verified trends</h2>
          <p className="section-lead">
            These are not meter readings. Each estimate names its method and baseline.
          </p>
        </>
      )}
      <div className="prediction-list">
        {preds.map((p) => (
          <PredictionCard key={p.id} prediction={p} sources={byId} />
        ))}
      </div>
    </div>
  )
}

function PredictionCard({
  prediction: p,
  sources,
}: {
  prediction: Prediction
  sources: Map<string, Story['sources'][number]>
}) {
  const range =
    p.result_low != null && p.result_high != null
      ? p.result_low === p.result_high
        ? formatImpact(p.result_low, p.unit)
        : `${formatImpact(p.result_low, p.unit)} – ${formatImpact(p.result_high, p.unit)}`
      : null

  return (
    <article className="prediction-card">
      <div className="prediction-head">
        <h3>{p.title}</h3>
        <EvidenceBadge level={p.evidence_level} />
      </div>
      {range && <div className="prediction-value">{range}</div>}
      <p className="prediction-method">
        <strong>Method:</strong> {p.method}
      </p>
      <div className="prediction-meta">
        <span>Confidence: {p.confidence.replace(/_/g, ' ')}</span>
      </div>
      <ul className="prediction-verified">
        {p.verified_against.map((v) => (
          <li key={v}>Verified against: {v}</li>
        ))}
      </ul>
      <ul className="prediction-sources">
        {p.source_ids.map((id) => {
          const s = sources.get(id)
          if (!s) return null
          return (
            <li key={id}>
              <a className="prediction-source-link" href={s.url} target="_blank" rel="noreferrer">
                {s.organization}
                <IconExternal size={14} />
              </a>
            </li>
          )
        })}
      </ul>
      <p className="caveat">{p.caveat}</p>
    </article>
  )
}
