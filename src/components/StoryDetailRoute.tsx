import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Story, StoryCatalogItem } from '../types'
import { StoryDetailPage } from './StoryDetailPage'

export function StoryDetailRoute() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    fetch('/data/stories.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<StoryCatalogItem[]>
      })
      .then((catalog) => {
        const item = catalog.find((c) => c.id === id)
        if (!item) throw new Error('not found')
        return fetch(item.data_file).then((r) => {
          if (!r.ok) throw new Error(String(r.status))
          return r.json() as Promise<Story>
        })
      })
      .then((data) => {
        if (!cancelled) setStory(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load that ripple story.')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return (
      <main className="boot">
        <p>{error}</p>
        <p>
          <Link to="/">Back to news</Link>
        </p>
      </main>
    )
  }

  if (!story) {
    return (
      <main className="boot">
        <p>Loading story…</p>
      </main>
    )
  }

  return <StoryDetailPage story={story} />
}
