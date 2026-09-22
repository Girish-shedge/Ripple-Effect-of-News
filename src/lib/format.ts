import type { EvidenceLevel } from '../types'

const LABELS: Record<EvidenceLevel, string> = {
  observed: 'Observed',
  strongly_supported: 'Strongly supported',
  attribution: 'Attribution',
  plausible: 'Plausible',
  emerging: 'Emerging',
  unknown: 'Unknown',
}

export function evidenceLabel(level: EvidenceLevel): string {
  return LABELS[level] ?? level
}

/** Plain-language meanings for evidence badges (style guide §4). */
const MEANINGS: Record<EvidenceLevel, string> = {
  observed: 'This happened, and it is documented by named sources.',
  strongly_supported: 'Scientists broadly agree on this, based on the evidence cited.',
  attribution:
    'A study measured how much more likely climate change made this, or how much more intense.',
  plausible:
    'This is a reasonable link, but no study has confirmed it for this specific event yet.',
  emerging: 'Researchers are still studying this. The picture is still forming.',
  unknown: 'We do not yet have evidence either way. That is a real gap, not a hidden answer.',
}

export function evidenceMeaning(level: EvidenceLevel): string {
  return MEANINGS[level] ?? `Evidence level: ${String(level).replace(/_/g, ' ')}.`
}

export function formatImpact(value: number, unit: string): string {
  if (unit === '×' || unit === 'x') return `${value}×`
  if (unit === '%') return `${value}%`
  if (unit === '°C') return `${value}°C`
  if (unit === 'm3' || unit === 'm³') return `${value.toLocaleString('en-US')} m³`
  if (unit === 'days/year') return `${value} days/yr`
  if (unit === 'sites') return `${value} sites`
  if (unit === 'years') return `${value} years`
  if (unit === 'households_equivalent_order_of_magnitude') {
    return `~${value.toLocaleString('en-US')} households`
  }
  if (unit === 'L_freshwater_per_kWh_cooling_design') return `${value} L/kWh freshwater`
  if (unit === 'qualitative_bound') return 'qualitative bound'
  if (unit === 'tonnes' && value >= 1000) {
    return `${value.toLocaleString('en-US')} ${unit}`
  }
  if (unit === 'MW') return `${value} MW`
  if (unit === 'hectares') return `${value.toLocaleString('en-US')} ha`
  if (unit === 'people') return value.toLocaleString('en-US')
  return `${value.toLocaleString('en-US')} ${unit}`
}

export function formatNewsDate(iso: string) {
  const parts = iso.split('-')
  if (parts.length === 2) {
    return new Date(`${iso}-01T12:00:00`).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })
  }
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
