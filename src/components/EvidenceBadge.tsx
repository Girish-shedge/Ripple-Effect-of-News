import { useEffect, useId, useRef, useState } from 'react'
import type { EvidenceLevel } from '../types'
import { evidenceLabel, evidenceMeaning } from '../lib/format'
import { IconInfo } from './icons'

export function EvidenceBadge({
  level,
  compact = false,
  plain = false,
  meaning,
}: {
  level: EvidenceLevel
  compact?: boolean
  /** Label + info only, no boxed chip. Used in section kickers. */
  plain?: boolean
  /** Override tooltip copy; defaults to shared plain-language meaning. */
  meaning?: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()
  const tip = (meaning ?? evidenceMeaning(level)).trim()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent | PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span
      className="evidence-badge-wrap"
      ref={wrapRef}
      data-compact={compact || undefined}
      data-plain={plain || undefined}
    >
      <span
        className={plain ? 'evidence-badge-plain' : 'evidence-badge'}
        data-level={plain ? undefined : level}
        data-compact={compact || undefined}
      >
        {evidenceLabel(level)}
      </span>
      {tip ? (
        <>
          <button
            type="button"
            className="evidence-info"
            data-level={level}
            aria-label={`What ${evidenceLabel(level)} means`}
            aria-expanded={open}
            aria-controls={tipId}
            onClick={() => setOpen((v) => !v)}
          >
            <IconInfo size={14} />
          </button>
          {open ? (
            <span className="evidence-tooltip" id={tipId} role="tooltip">
              {tip}
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  )
}
