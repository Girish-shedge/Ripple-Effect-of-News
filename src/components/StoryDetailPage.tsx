import { useEffect, useMemo, useRef, useState } from 'react'
import type { Source, Story } from '../types'
import { heroVideoForStory } from '../lib/heroVideos'
import { buildStorySections } from './buildStorySections'
import { EvidenceBadge } from './EvidenceBadge'
import { StoryHeroMedia } from './StoryHeroMedia'
import { IconArrowRight, IconChevronDown, IconInfo } from './icons'

export function StoryDetailPage({ story }: { story: Story }) {
  const sections = useMemo(() => buildStorySections(story), [story])
  const heroVideo = heroVideoForStory(story.event.id)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = mainRef.current
    if (!root) return
    const nodes = root.querySelectorAll<HTMLElement>('.story-doc-section')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-revealed')
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
    )
    nodes.forEach((el, i) => {
      if (i === 0) el.classList.add('is-revealed')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [sections])

  return (
    <div className="story-doc">
      <main className="story-doc-main" ref={mainRef}>
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="story-doc-section"
            data-first={index === 0 || undefined}
          >
            {index === 0 && heroVideo ? (
              <StoryHeroMedia video={heroVideo} />
            ) : section.image ? (
              <figure className="story-doc-hero-image">
                <div className="story-doc-hero-frame">
                  <img
                    src={section.image.url}
                    alt={section.image.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="story-doc-ai-badge" aria-label="AI generated">
                    <IconInfo size={14} />
                    <span>AI generated</span>
                  </div>
                </div>
              </figure>
            ) : null}

            <p className="story-doc-eyebrow">
              <span>{section.kicker}</span>
              {section.evidence ? (
                <>
                  <span className="story-doc-eyebrow-dot" aria-hidden="true">
                    ·
                  </span>
                  <EvidenceBadge
                    level={section.evidence.level}
                    meaning={section.evidence.meaning}
                    plain
                  />
                </>
              ) : null}
            </p>
            <h2 className="story-doc-title">{section.title}</h2>
            {section.teaser ? <p className="story-doc-prose">{section.teaser}</p> : null}

            {section.body ? <div className="story-doc-section-body">{section.body}</div> : null}

            <VerifiedSources sources={section.sources} />
          </section>
        ))}
      </main>
    </div>
  )
}

function VerifiedSources({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)
  const list = sources
  const count = list.length

  return (
    <div className="story-doc-sources-blue">
      <button
        type="button"
        className="story-doc-sources-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="story-doc-sources-toggle-label">Verified sources</span>
        <span className="story-doc-sources-toggle-meta">
          {count ? `${count}` : '0'}
          <span className="story-doc-sources-chevron" data-open={open}>
            <IconChevronDown size={16} />
          </span>
        </span>
      </button>

      {open && (
        <div className="story-doc-sources-panel">
          {!count ? (
            <p className="story-doc-sources-empty">No section sources listed yet.</p>
          ) : (
            <ul className="story-doc-sources-list">
              {list.map((s) => (
                <li key={s.id} className="story-doc-sources-item">
                  <div className="story-doc-sources-org">{s.organization}</div>
                  <div className="story-doc-sources-title">{s.title}</div>
                  <div className="story-doc-sources-meta">
                    {s.publication_date}
                    {s.credibility_class ? ` · ${s.credibility_class}` : ''}
                  </div>
                  <a className="story-doc-sources-link" href={s.url} target="_blank" rel="noreferrer">
                    Verify
                    <IconArrowRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
