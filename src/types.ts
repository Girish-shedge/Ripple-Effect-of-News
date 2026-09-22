export type EvidenceLevel =
  | 'observed'
  | 'strongly_supported'
  | 'attribution'
  | 'plausible'
  | 'emerging'
  | 'unknown'

export interface StoryCatalogItem {
  id: string
  data_file: string
  date: string
  headline: string
  subheading: string
  location: string
  image_url: string
  image_alt: string
  /** Optional explicit region for filters; derived from location when absent. */
  region?: string
  /** Optional theme tag for filters; derived from headline/id when absent. */
  theme?: string
  /** Editorial rank. Lower number appears first and can take a featured tile. */
  rank?: number
}

export interface Source {
  id: string
  organization: string
  title: string
  url: string
  publication_date: string
  source_type: string
  credibility_class: string
  retrieved_at: string
  internal_note?: string
  fetch?: {
    ok: boolean
    http_status: number
    checked_at: string
    final_url?: string
    content_type?: string | null
    error?: string | null
  }
}

export interface Claim {
  id: string
  text: string
  claim_type: string
  evidence_level: EvidenceLevel
  sources: string[]
  geographic_scope: string
  temporal_scope: string
  methodology_status?: string
  last_verified: string
  caveat: string | null
}

export interface Node {
  id: string
  type: string
  title: string
  description: string
}

export interface Edge {
  from: string
  to: string
  relationship: string
  relationship_label: string
  evidence_level: EvidenceLevel
  claim_ids: string[]
}

export interface Impact {
  id: string
  category: string
  metric: string
  value: number
  unit: string
  location: string
  date: string
  source_id: string
  status: string
  note?: string
}

export interface TimelineItem {
  id: string
  bucket: string
  label: string
  detail: string
  evidence_level: EvidenceLevel
  claim_ids: string[]
}

export interface NewsItem {
  id: string
  date: string
  headline: string
  subheading: string
  organization: string
  url: string
  source_id: string
  image_url: string
  image_alt: string
}

export interface MediaItem {
  id: string
  url: string
  credit: string
  credit_url?: string
  credit_detail?: string
  caption: string
  alt: string
  placement: string
  node_ids?: string[]
  note?: string
  commons_file?: string
  imagery_type?: string
  license?: string
  license_url?: string | null
  date_taken?: string | null
  fetched_from?: string
  fetched_at?: string
  original_url?: string
}

export interface Prediction {
  id: string
  node_id: string
  title: string
  method: string
  inputs?: Record<string, number>
  result_low: number | null
  result_high: number | null
  unit: string
  verified_against: string[]
  source_ids: string[]
  confidence: string
  evidence_level: EvidenceLevel
  caveat: string
}

export interface ChartBar {
  id: string
  label: string
  value: number
  unit: string
  source_id: string
}

export interface EvidenceMixItem {
  level: EvidenceLevel
  count: number
}

export interface StoryChart {
  impact_bars: ChartBar[]
  evidence_mix: EvidenceMixItem[]
}

export interface Story {
  event: {
    id: string
    title: string
    date: string
    location: { country: string; region: string; lat: number; lng: number }
    summary: string
    hero: string
    retrieved_at: string
  }
  nodes: Node[]
  edges: Edge[]
  claims: Claim[]
  sources: Source[]
  impacts: Impact[]
  timeline: TimelineItem[]
  news?: NewsItem[]
  knowledge_summary: {
    what_we_know: string[]
    what_remains_uncertain: string[]
  }
  evidence_legend: Array<{ level: EvidenceLevel; label: string; meaning: string }>
  media?: MediaItem[]
  chart?: StoryChart
  predictions?: Prediction[]
  provenance?: {
    fetched_at: string
    method: string
    note: string
  }
}
