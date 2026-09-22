import type { Story } from '../types'
import { formatImpact } from '../lib/format'

/** Simple verified figures: number + subheading. No charts. */
export function StoryReachCharts({ story }: { story: Story }) {
  const bars = story.chart?.impact_bars ?? []
  const mix = story.chart?.evidence_mix ?? []

  if (!bars.length && !mix.length) {
    return <p className="doc-quiet">No verified figures are attached to this story yet.</p>
  }

  return (
    <div className="reach-figures" aria-label="Verified reach figures">
      {bars.length > 0 && (
        <div className="reach-figures-block">
          <p className="reach-figures-kicker">Reported impact</p>
          <ul className="reach-figures-grid">
            {bars.map((b) => (
              <li key={b.id} className="reach-figure">
                <div className="reach-figure-value">{formatImpact(b.value, b.unit)}</div>
                <div className="reach-figure-label">{b.label}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mix.length > 0 && (
        <div className="reach-figures-block">
          <p className="reach-figures-kicker">Evidence across the chain</p>
          <ul className="reach-figures-grid">
            {mix.map((m) => (
              <li key={m.level} className="reach-figure">
                <div className="reach-figure-value">{m.count}</div>
                <div className="reach-figure-label">{m.level.replace(/_/g, ' ')}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
