import type { Source, Story } from '../types'
import { IconExternal, IconFail, IconOk } from './icons'

export function SourceIndex({ story, compact }: { story: Story; compact?: boolean }) {
  const sorted = [...story.sources].sort(
    (a, b) =>
      a.organization.localeCompare(b.organization) ||
      a.publication_date.localeCompare(b.publication_date),
  )

  const claimCounts = new Map<string, number>()
  for (const claim of story.claims) {
    for (const sid of claim.sources) {
      claimCounts.set(sid, (claimCounts.get(sid) ?? 0) + 1)
    }
  }
  for (const impact of story.impacts) {
    claimCounts.set(impact.source_id, (claimCounts.get(impact.source_id) ?? 0) + 1)
  }

  return (
    <div className="source-index" id="sources" aria-label="Sources" data-compact={compact || undefined}>
      {!compact && (
        <>
          <h2>Every claim here points back to a named source</h2>
          <p className="section-lead">
            Each row shows whether the URL responded on the last live fetch.
          </p>
        </>
      )}

      <ol className="source-index-list">
        {sorted.map((source) => (
          <SourceRow key={source.id} source={source} uses={claimCounts.get(source.id) ?? 0} />
        ))}
      </ol>
    </div>
  )
}

function SourceRow({ source, uses }: { source: Source; uses: number }) {
  return (
    <li className="source-index-item">
      <div className="source-index-head">
        <span className="source-org">
          {source.organization} · {source.publication_date}
        </span>
        <span className="source-uses">
          used {uses}× · {prettyType(source.source_type)} · <FetchStatus source={source} />
        </span>
      </div>
      <div className="source-title">{source.title}</div>
      <a className="source-index-link" href={source.url} target="_blank" rel="noreferrer">
        Open original
        <IconExternal size={14} />
      </a>
    </li>
  )
}

function FetchStatus({ source }: { source: Source }) {
  if (!source.fetch) return <span>not checked</span>
  if (source.fetch.ok) {
    return (
      <span className="source-fetch source-fetch--ok">
        <IconOk size={12} />
        live {source.fetch.http_status}
      </span>
    )
  }
  return (
    <span className="source-fetch source-fetch--fail">
      <IconFail size={12} />
      live {source.fetch.http_status || 'fail'}
    </span>
  )
}

function prettyType(type: string) {
  return type.replace(/_/g, ' ')
}
