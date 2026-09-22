/**
 * Seed historical still-suffering ripple stories into public/data + stories.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'data')

const legend = [
  { level: 'observed', label: 'Observed', meaning: 'Directly documented by a trusted source for this event.' },
  { level: 'strongly_supported', label: 'Strongly supported', meaning: 'Multiple studies or established scientific understanding.' },
  { level: 'attribution', label: 'Attribution', meaning: 'A scientific study attributes a measurable contribution to a driver.' },
  { level: 'plausible', label: 'Plausible', meaning: 'Scientifically reasonable, not yet demonstrated for this specific outcome.' },
  { level: 'emerging', label: 'Emerging', meaning: 'Trend-based estimate verified against trusted baselines — not yet fully settled.' },
  { level: 'unknown', label: 'Unknown', meaning: 'Insufficient evidence — shown, never hidden.' },
]

function write(id, story, catalogItem) {
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(story, null, 2) + '\n')
  const catalogPath = path.join(dir, 'stories.json')
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  if (!catalog.some((c) => c.id === id)) catalog.push(catalogItem)
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n')
  console.log('wrote', id)
}

// --- ARAL ---
write(
  'aral_sea_desiccation',
  {
    event: {
      id: 'aral_sea_desiccation',
      title: 'The Aral Sea was drained — the dust still blows',
      date: '1960-01-01',
      location: {
        country: 'Uzbekistan / Kazakhstan',
        region: 'Aral Sea basin / Aralkum desert',
        lat: 45.0,
        lng: 60.0,
      },
      summary:
        'From the 1960s, Soviet irrigation diverted the Amu Darya and Syr Darya. The Aral Sea lost most of its water, exposing a poisoned seabed — the Aralkum — that still launches salt-and-pesticide dust across Central Asia. UNEP and UNCCD documents show people are still breathing that legacy.',
      hero: 'They turned a sea into a desert that still storms our lungs.',
      retrieved_at: '2026-09-21',
    },
    nodes: [
      { id: 'irrigation', type: 'human_system', title: 'Rivers were diverted to grow cotton', description: 'Mass irrigation upstream starved the Aral of inflow starting in the 1960s.' },
      { id: 'sea_collapse', type: 'environment', title: 'The sea emptied and salinity exploded', description: 'The Aral lost most of its volume and area; fisheries and climate buffering collapsed.' },
      { id: 'aralkum', type: 'hazard', title: 'A new desert of toxic dust was born', description: 'The dry lakebed became the Aralkum — a source of salt- and pollutant-laden dust storms.' },
      { id: 'air_quality', type: 'hazard', title: 'Dust still breaches WHO air thresholds', description: 'Models show Aralkum dust alone can push Nukus over WHO daily PM10 limits dozens of days a year.' },
      { id: 'health', type: 'human_system', title: 'Respiratory and chronic illness remain elevated', description: 'UNCCD cites millions affected and disease rates far above national averages — with caveats that dust is not the only cause.' },
      { id: 'displacement', type: 'human_system', title: 'Livelihoods and towns emptied', description: 'Fisheries died; UNCCD notes displacement of more than 100,000 people.' },
      { id: 'farmland', type: 'economy', title: 'Salt fallout still cuts farm productivity', description: 'Uzbek assessments cited by UNCCD: atmospheric salt fallout cuts farmland bioproductivity ~5–10% and pastures 20–30%.' },
      { id: 'today', type: 'human_system', title: '2025: UNEP still warns of Aral-origin dust', description: 'A UNEP Uzbekistan SDS report traced an extreme pollution spike to a plume from the Aral region ~900 km away.' },
      { id: 'future', type: 'economy', title: 'Recovery is generational — not finished', description: 'Partial North Aral restoration exists, but South Aral / Aralkum dust and health burdens persist.' },
    ],
    edges: [
      { from: 'irrigation', to: 'sea_collapse', relationship: 'causes', relationship_label: 'starves', evidence_level: 'observed', claim_ids: ['c1'] },
      { from: 'sea_collapse', to: 'aralkum', relationship: 'creates', relationship_label: 'creates', evidence_level: 'observed', claim_ids: ['c2'] },
      { from: 'aralkum', to: 'air_quality', relationship: 'emits', relationship_label: 'emits', evidence_level: 'observed', claim_ids: ['c3'] },
      { from: 'air_quality', to: 'health', relationship: 'harms', relationship_label: 'harms', evidence_level: 'strongly_supported', claim_ids: ['c4'] },
      { from: 'sea_collapse', to: 'displacement', relationship: 'causes', relationship_label: 'displaces', evidence_level: 'observed', claim_ids: ['c5'] },
      { from: 'aralkum', to: 'farmland', relationship: 'degrades', relationship_label: 'salts', evidence_level: 'observed', claim_ids: ['c6'] },
      { from: 'air_quality', to: 'today', relationship: 'continues_as', relationship_label: 'continues as', evidence_level: 'observed', claim_ids: ['c7'] },
      { from: 'health', to: 'future', relationship: 'extends_into', relationship_label: 'extends into', evidence_level: 'emerging', claim_ids: ['c8'] },
    ],
    claims: [
      { id: 'c1', text: 'From the 1960s, over-exploitation of the Amu Darya and Syr Darya for irrigation caused the Aral Sea to lose ~80% of its volume and shrink to about a third of its former area.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_ije_aral', 'src_water_aral'], geographic_scope: 'Aral Sea basin', temporal_scope: '1960s–2000s', methodology_status: 'established hydrology', last_verified: '2026-09-21', caveat: null },
      { id: 'c2', text: 'The exposed seabed became a major dust source (Aralkum), with documented increases in local dust-storm activity.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_ije_aral', 'src_e3s_aralkum'], geographic_scope: 'Former Aral seabed', temporal_scope: 'post-desiccation to present', last_verified: '2026-09-21', caveat: null },
      { id: 'c3', text: 'Regional modelling (2024): Aralkum dust alone can exceed WHO daily PM10 (45 µg/m³) on ~29 days/year in Nukus, ~8 in Bukhara, ~2 in Tashkent.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_e3s_aralkum'], geographic_scope: 'Uzbekistan cities downwind', temporal_scope: 'model year in 2024 paper', last_verified: '2026-09-21', caveat: 'Modelled Aralkum-only dust; other deserts also contribute.' },
      { id: 'c4', text: 'UNCCD Central Asia SDS strategy: Aral disaster affected health of over 5 million people region-wide; disease rates in Aral districts reported far above national averages — peer-reviewed reviews caution dust is not the sole cause.', claim_type: 'context', evidence_level: 'strongly_supported', sources: ['src_unccd_sds', 'src_water_aral'], geographic_scope: 'Central Asia / Karakalpakstan', temporal_scope: 'multi-decade to 2020s', last_verified: '2026-09-21', caveat: 'Multi-causal: pesticides, poverty, and dust intertwine.' },
      { id: 'c5', text: 'UNCCD strategy: environmental disaster of the Aral Sea region led to displacement of more than 100,000 people.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_unccd_sds'], geographic_scope: 'Aral Sea region', temporal_scope: 'decades of collapse', last_verified: '2026-09-21', caveat: null },
      { id: 'c6', text: 'UNCCD citing Uzbek hydromet: salt fallout reduces farmland bioproductivity by 5–10% and pastures by 20–30%.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_unccd_sds'], geographic_scope: 'Uzbekistan arid zones', temporal_scope: 'assessment cited in strategy', last_verified: '2026-09-21', caveat: null },
      { id: 'c7', text: 'UNEP (16 Dec 2025): sand and dust storms drive Uzbekistan’s worst urban air spikes; the highest daily PM spike in Termez was traced to a dust plume originating from the Aral Sea region ~900 km away.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_unep_uzbekistan_2025'], geographic_scope: 'Termez / Uzbekistan', temporal_scope: '2025 report', last_verified: '2026-09-21', caveat: null },
      { id: 'c8', text: 'Partial North Aral recovery exists, but South Aral dust, SDS risk, and health inequities remain active into the 2020s — a multi-generation ripple.', claim_type: 'prediction', evidence_level: 'emerging', sources: ['src_unep_uzbekistan_2025', 'src_unccd_sds'], geographic_scope: 'Aral basin', temporal_scope: '2020s–2030s', methodology_status: 'institutional trajectory', last_verified: '2026-09-21', caveat: 'Depends on restoration funding and climate.' },
    ],
    predictions: [
      { id: 'pred_sds_days', node_id: 'air_quality', title: 'Nukus still faces ~month/year of WHO-breaching Aralkum dust days', method: 'Use published model count (29 days exceeding WHO daily PM10 from Aralkum dust) as verified exposure-frequency bound.', result_low: 29, result_high: 29, unit: 'days/year', verified_against: ['E3S 2024 Aralkum dust modelling vs WHO PM10'], source_ids: ['src_e3s_aralkum'], confidence: 'medium', evidence_level: 'emerging', caveat: 'Single-model year; other dust sources add days.' },
    ],
    sources: [
      { id: 'src_unep_uzbekistan_2025', organization: 'UNEP', title: 'Regional action needed to protect Uzbekistan from sand and dust storms', url: 'https://www.unep.org/news-and-stories/press-release/regional-action-needed-protect-uzbekistan-sand-and-dust-storms-warns', publication_date: '2025-12-16', source_type: 'institutional_assessment', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_unccd_sds', organization: 'UNCCD', title: 'Regional Strategy for Sand and Dust Storms Management in Central Asia 2021–2030', url: 'https://www.unccd.int/sites/default/files/2022-10/Regional%20strategy_SDS_%D0%B0%D0%BD%D0%B3%D0%BB_print.pdf', publication_date: '2021', source_type: 'institutional_assessment', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_e3s_aralkum', organization: 'E3S Web of Conferences', title: 'Impacts on Central Asia of dust emitted from the Aralkum', url: 'https://www.e3s-conferences.org/articles/e3sconf/pdf/2024/105/e3sconf_caduc2024_04002.pdf', publication_date: '2024', source_type: 'peer_reviewed', credibility_class: 'tier_2', retrieved_at: '2026-09-21' },
      { id: 'src_water_aral', organization: 'Water (MDPI)', title: 'Health Impact of Drying Aral Sea: One Health and Socio-Economical Approach', url: 'https://doi.org/10.3390/w13223196', publication_date: '2021', source_type: 'peer_reviewed', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_ije_aral', organization: 'International Journal of Epidemiology', title: 'Airborne dust and respiratory health in children in the Aral Sea region', url: 'https://doi.org/10.1093/ije/dym195', publication_date: '2008', source_type: 'peer_reviewed', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
    ],
    impacts: [
      { id: 'i_displaced', category: 'humanitarian', metric: 'people_displaced', value: 100000, unit: 'people', location: 'Aral Sea region', date: '2021', source_id: 'src_unccd_sds', status: 'institutional_estimate' },
      { id: 'i_health', category: 'humanitarian', metric: 'people_health_affected', value: 5000000, unit: 'people', location: 'Central Asia', date: '2021', source_id: 'src_unccd_sds', status: 'institutional_estimate' },
      { id: 'i_nukus_days', category: 'air', metric: 'who_pm10_exceedance_days_nukus', value: 29, unit: 'days/year', location: 'Nukus', date: '2024', source_id: 'src_e3s_aralkum', status: 'modelled' },
    ],
    timeline: [
      { id: 't0', bucket: '1960s', label: 'Diversion begins', detail: 'Irrigation expansions cut river inflow; sea level starts falling.', evidence_level: 'observed', claim_ids: ['c1'] },
      { id: 't1', bucket: '1980s–2000s', label: 'Sea collapse', detail: 'Volume loss ~80%; fisheries collapse; Aralkum expands.', evidence_level: 'observed', claim_ids: ['c2'] },
      { id: 't2', bucket: 'TODAY', label: 'Dust still travels hundreds of km', detail: 'UNEP 2025: Aral-region plume hits Termez ~900 km away.', evidence_level: 'observed', claim_ids: ['c7'] },
      { id: 't3', bucket: 'YEARS AHEAD', label: 'Generational recovery', detail: 'SDS strategies run through 2030; health burdens lag physical restoration.', evidence_level: 'emerging', claim_ids: ['c8'] },
    ],
    knowledge_summary: {
      what_we_know: [
        'Irrigation diversion collapsed the Aral Sea (observed).',
        'The dry bed still emits dust that can breach WHO air guidelines (modelled/observed).',
        'UN institutions still treat Aral-linked SDS as an active regional health threat in the 2020s (observed).',
      ],
      what_remains_uncertain: [
        'Exact fraction of disease burden attributable to dust vs pesticides and poverty.',
        'How fast South Aral dust emissions will fall under current restoration plans.',
      ],
    },
    evidence_legend: legend,
    media: [
      {
        id: 'hero',
        commons_file: 'AralSea1985_1992.jpg',
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/AralSea1985_1992.jpg?width=1280',
        credit: 'NASA / Wikimedia Commons',
        credit_url: 'https://commons.wikimedia.org/wiki/File:AralSea1985_1992.jpg',
        caption: 'NASA comparison of the shrinking Aral Sea — the physical start of a dust disaster still underway.',
        alt: 'Satellite comparison of the Aral Sea shrinking',
        placement: 'hero',
        imagery_type: 'near_event_context',
        note: 'Historic satellite documentation of desiccation — not a 2025 dust-storm photo.',
      },
    ],
    chart: {
      impact_bars: [
        { id: 'disp', label: 'People displaced', value: 100000, unit: 'people', source_id: 'src_unccd_sds' },
        { id: 'health', label: 'Health affected (regional)', value: 5000000, unit: 'people', source_id: 'src_unccd_sds' },
        { id: 'days', label: 'Nukus WHO exceedance days', value: 29, unit: 'days/year', source_id: 'src_e3s_aralkum' },
      ],
      evidence_mix: [
        { level: 'observed', count: 6 },
        { level: 'strongly_supported', count: 1 },
        { level: 'emerging', count: 1 },
      ],
    },
  },
  {
    id: 'aral_sea_desiccation',
    data_file: '/data/aral_sea_desiccation.json',
    date: '1960-01-01',
    headline: 'They drained the Aral Sea — the dust still storms our lungs',
    subheading: 'Irrigation killed a sea; decades later UNEP still tracks Aral dust plumes hundreds of kilometres away.',
    location: 'Central Asia',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/AralSea1985_1992.jpg?width=640',
    image_alt: 'Shrinking Aral Sea from space',
  },
)

console.log('aral done — continuing in part 2…')
