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

function add(id, story, catalogItem) {
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(story, null, 2) + '\n')
  const catalogPath = path.join(dir, 'stories.json')
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  if (!catalog.some((c) => c.id === id)) catalog.push(catalogItem)
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n')
  console.log('wrote', id)
}

add(
  'deepwater_horizon_2010',
  {
    event: {
      id: 'deepwater_horizon_2010',
      title: 'Deepwater Horizon — dolphins still haven’t recovered',
      date: '2010-04-20',
      location: { country: 'United States', region: 'Northern Gulf of Mexico / Barataria Bay', lat: 28.74, lng: -88.37 },
      summary:
        'On 20 April 2010 the Deepwater Horizon rig exploded, releasing about 490,000 m³ of oil into the Gulf. Fifteen years later NOAA and peer-reviewed studies still track injured dolphin populations — Barataria Bay bottlenose dolphins fell ~45% and may need ~35 years to recover.',
      hero: 'One spill. Decades of sick lungs in the Gulf.',
      retrieved_at: '2026-09-21',
    },
    nodes: [
      { id: 'blowout', type: 'hazard', title: 'The well blew out and oil poured for months', description: 'Explosion and spill released ~490,000 m³ of oil into the northern Gulf of Mexico.' },
      { id: 'exposure', type: 'hazard', title: 'Coastal and offshore mammals swam through the footprint', description: 'Estuarine bottlenose dolphins and pelagic cetaceans were exposed across a vast oil footprint.' },
      { id: 'lungs', type: 'human_system', title: 'Dolphins developed chronic lung disease', description: 'Barataria Bay dolphins showed progressive respiratory injury years after the spill.' },
      { id: 'population', type: 'environment', title: 'The local dolphin population crashed ~45%', description: 'Population models integrating health assessments estimate a 45% decline vs baseline.' },
      { id: 'recovery_clock', type: 'environment', title: 'Recovery may take ~35 years', description: 'Same models: ~35 years (18–67) to return to 95% of baseline numbers.' },
      { id: 'offshore', type: 'environment', title: 'Offshore whales also lost “cetacean years”', description: 'NOAA analyses quantified lost cetacean-years across sperm whales, beaked whales, and dolphins.' },
      { id: 'monitoring', type: 'human_system', title: '15 years on, monitoring still finds declines', description: 'NOAA’s 15-year science update reports acoustic declines that can exceed early predictions.' },
      { id: 'humans', type: 'human_system', title: 'Human oil exposure shares the lung pathway', description: 'Dolphin findings parallel human oil-exposure respiratory literature — a sentinel warning.' },
      { id: 'still', type: 'economy', title: 'Restoration is underway — injury is not over', description: 'NRDA-funded restoration continues while populations sit near modelled minima.' },
    ],
    edges: [
      { from: 'blowout', to: 'exposure', relationship: 'causes', relationship_label: 'exposes', evidence_level: 'observed', claim_ids: ['d1'] },
      { from: 'exposure', to: 'lungs', relationship: 'injures', relationship_label: 'injures', evidence_level: 'observed', claim_ids: ['d2'] },
      { from: 'lungs', to: 'population', relationship: 'reduces', relationship_label: 'shrinks', evidence_level: 'observed', claim_ids: ['d3'] },
      { from: 'population', to: 'recovery_clock', relationship: 'implies', relationship_label: 'implies', evidence_level: 'emerging', claim_ids: ['d4'] },
      { from: 'exposure', to: 'offshore', relationship: 'harms', relationship_label: 'harms', evidence_level: 'observed', claim_ids: ['d5'] },
      { from: 'population', to: 'monitoring', relationship: 'confirmed_by', relationship_label: 'is tracked by', evidence_level: 'observed', claim_ids: ['d6'] },
      { from: 'lungs', to: 'humans', relationship: 'parallels', relationship_label: 'parallels', evidence_level: 'plausible', claim_ids: ['d7'] },
      { from: 'recovery_clock', to: 'still', relationship: 'extends_into', relationship_label: 'extends into', evidence_level: 'emerging', claim_ids: ['d4'] },
    ],
    claims: [
      { id: 'd1', text: 'Deepwater Horizon released about 490,000 m³ of oil into the northern Gulf of Mexico.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_noaa_pelagic'], geographic_scope: 'N. Gulf of Mexico', temporal_scope: '2010', last_verified: '2026-09-21', caveat: null },
      { id: 'd2', text: 'Frontiers in Marine Science (2022): Barataria Bay bottlenose dolphins showed chronic and potentially progressive respiratory injury eight years after the spill.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_frontiers_dolphin'], geographic_scope: 'Barataria Bay', temporal_scope: '2010–2018', last_verified: '2026-09-21', caveat: null },
      { id: 'd3', text: 'Conservation Biology (2022): Barataria Bay dolphin population declined ~45% (95% CI 14–74) relative to baseline; 78% of assessed 2018 dolphins had guarded/poor/grave prognosis.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_conbio_dolphin'], geographic_scope: 'Barataria Bay', temporal_scope: 'post-spill modelling', last_verified: '2026-09-21', caveat: 'Model + expert elicitation.' },
      { id: 'd4', text: 'Same study: estimated 35 years (18–67) to recover to 95% of baseline; ~30,148 lost cetacean-years.', claim_type: 'prediction', evidence_level: 'emerging', sources: ['src_conbio_dolphin'], geographic_scope: 'Barataria Bay', temporal_scope: 'multi-decade forward', methodology_status: 'population dynamics model', last_verified: '2026-09-21', caveat: 'Depends on restoration and future stressors.' },
      { id: 'd5', text: 'NOAA Fisheries: exposure fractions and lost cetacean-years quantified across sperm whales, beaked whales, and 11 delphinid species.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_noaa_pelagic'], geographic_scope: 'Oceanic Gulf', temporal_scope: 'post-2010', last_verified: '2026-09-21', caveat: null },
      { id: 'd6', text: 'NOAA 15-year science update: acoustic declines include sperm whales (up to 31%), beaked whales (up to 83%), small delphinids (up to 43%); some declines exceed early injury-model predictions and are not all conclusively linked to oil alone.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_noaa_15yr'], geographic_scope: 'Gulf acoustic moorings', temporal_scope: 'decade after spill', last_verified: '2026-09-21', caveat: 'NOAA notes non-oil stressors may contribute.' },
      { id: 'd7', text: 'Dolphin respiratory findings are consistent with human oil-exposure lung literature cited in the studies — a plausible shared toxic pathway.', claim_type: 'inference', evidence_level: 'plausible', sources: ['src_frontiers_dolphin'], geographic_scope: 'comparative medicine', temporal_scope: 'post-spill literature', last_verified: '2026-09-21', caveat: null },
    ],
    predictions: [
      { id: 'pred_recovery', node_id: 'recovery_clock', title: 'Barataria Bay dolphin recovery horizon', method: 'Publish the peer-reviewed model’s central estimate and CI as the verified prediction bound.', result_low: 18, result_high: 67, unit: 'years', verified_against: ['Conservation Biology 2022 population model'], source_ids: ['src_conbio_dolphin'], confidence: 'medium', evidence_level: 'emerging', caveat: 'Central estimate 35 years.' },
    ],
    sources: [
      { id: 'src_conbio_dolphin', organization: 'Conservation Biology', title: 'Modeling population effects of the Deepwater Horizon oil spill on a long-lived species', url: 'https://doi.org/10.1111/cobi.13878', publication_date: '2022', source_type: 'peer_reviewed', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_frontiers_dolphin', organization: 'Frontiers in Marine Science', title: 'Poor pulmonary health in Barataria Bay dolphins eight years after Deepwater Horizon', url: 'https://doi.org/10.3389/fmars.2022.975006', publication_date: '2022', source_type: 'peer_reviewed', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_noaa_pelagic', organization: 'NOAA Fisheries', title: 'Population Consequences of the Deepwater Horizon Oil Spill on Pelagic Cetaceans', url: 'https://www.fisheries.noaa.gov/resource/peer-reviewed-research/population-consequences-deepwater-horizon-oil-spill-pelagic', publication_date: '2022', source_type: 'institutional_assessment', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_noaa_15yr', organization: 'NOAA Fisheries', title: 'Reflecting on 15 Years of Science Since Deepwater Horizon', url: 'https://www.fisheries.noaa.gov/feature-story/reflecting-15-years-science-deepwater-horizon-monitoring-recovery', publication_date: '2025', source_type: 'institutional_assessment', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
    ],
    impacts: [
      { id: 'i_oil', category: 'pollution', metric: 'oil_released', value: 490000, unit: 'm3', location: 'N. Gulf of Mexico', date: '2010', source_id: 'src_noaa_pelagic', status: 'observed' },
      { id: 'i_decline', category: 'wildlife', metric: 'dolphin_population_decline', value: 45, unit: '%', location: 'Barataria Bay', date: '2022', source_id: 'src_conbio_dolphin', status: 'modelled' },
      { id: 'i_years', category: 'wildlife', metric: 'years_to_95pct_recovery', value: 35, unit: 'years', location: 'Barataria Bay', date: '2022', source_id: 'src_conbio_dolphin', status: 'modelled' },
    ],
    timeline: [
      { id: 't0', bucket: 'DAY 0', label: 'Blowout', detail: '20 April 2010 — Deepwater Horizon explosion; months of oil release.', evidence_level: 'observed', claim_ids: ['d1'] },
      { id: 't1', bucket: 'YEARS', label: 'Chronic lung disease', detail: 'Health assessments through 2018 show progressive respiratory injury.', evidence_level: 'observed', claim_ids: ['d2'] },
      { id: 't2', bucket: 'TODAY', label: 'Still below baseline', detail: 'Population ~45% down; NOAA still monitoring 15 years on.', evidence_level: 'observed', claim_ids: ['d3', 'd6'] },
      { id: 't3', bucket: 'DECADES', label: '~35-year recovery clock', detail: 'Modelled return to 95% baseline if stressors ease.', evidence_level: 'emerging', claim_ids: ['d4'] },
    ],
    knowledge_summary: {
      what_we_know: [
        'The 2010 spill released ~490,000 m³ of oil (observed).',
        'Barataria Bay dolphins suffered chronic lung disease and an estimated ~45% population drop (observed/modelled).',
        'NOAA continues Gulf mammal monitoring 15 years later (observed).',
      ],
      what_remains_uncertain: [
        'How much of later acoustic declines are oil vs cumulative noise and other stressors.',
        'Exact calendar year of recovery under changing Gulf conditions.',
      ],
    },
    evidence_legend: legend,
    media: [
      {
        id: 'hero',
        commons_file: 'Deepwater_Horizon_oil_spill_-_May_24,_2010_-_with_locator.jpg',
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deepwater_Horizon_oil_spill_-_May_24,_2010_-_with_locator.jpg?width=1280',
        credit: 'NASA / Wikimedia Commons',
        credit_url: 'https://commons.wikimedia.org/wiki/File:Deepwater_Horizon_oil_spill_-_May_24,_2010_-_with_locator.jpg',
        caption: 'NASA view of the Deepwater Horizon oil slick — 24 May 2010, during the spill.',
        alt: 'Satellite image of oil slick in the Gulf of Mexico',
        placement: 'hero',
        imagery_type: 'event_day',
        note: 'Near-event satellite imagery from the active spill period.',
      },
    ],
    chart: {
      impact_bars: [
        { id: 'oil', label: 'Oil released', value: 490000, unit: 'm3', source_id: 'src_noaa_pelagic' },
        { id: 'dec', label: 'Dolphin population decline', value: 45, unit: '%', source_id: 'src_conbio_dolphin' },
        { id: 'rec', label: 'Years to 95% recovery', value: 35, unit: 'years', source_id: 'src_conbio_dolphin' },
      ],
      evidence_mix: [
        { level: 'observed', count: 5 },
        { level: 'emerging', count: 2 },
        { level: 'plausible', count: 1 },
      ],
    },
  },
  {
    id: 'deepwater_horizon_2010',
    data_file: '/data/deepwater_horizon_2010.json',
    date: '2010-04-20',
    headline: 'Deepwater Horizon: dolphin lungs still failing 15 years on',
    subheading: 'NOAA science: Barataria Bay dolphins down ~45%; recovery may take ~35 years.',
    location: 'Gulf of Mexico',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deepwater_Horizon_oil_spill_-_May_24,_2010_-_with_locator.jpg?width=640',
    image_alt: 'Deepwater Horizon oil slick from space',
  },
)

add(
  'bhopal_1984',
  {
    event: {
      id: 'bhopal_1984',
      title: 'Bhopal 1984 — the gas cleared; the poison didn’t',
      date: '1984-12-03',
      location: { country: 'India', region: 'Bhopal, Madhya Pradesh (UCIL plant)', lat: 23.28, lng: 77.41 },
      summary:
        'On the night of 2–3 December 1984, methyl isocyanate leaked from the Union Carbide pesticide plant in Bhopal. Forty years on, Amnesty and Indian regulators still document toxic waste and groundwater contamination around the abandoned site.',
      hero: 'A night of gas. Four decades of poisoned water.',
      retrieved_at: '2026-09-21',
    },
    nodes: [
      { id: 'leak', type: 'hazard', title: 'MIC gas flooded neighbourhoods overnight', description: 'Methyl isocyanate escaped the UCIL plant, killing and injuring thousands within hours.' },
      { id: 'acute', type: 'human_system', title: 'Mass death and lifelong disability', description: 'Immediate deaths and chronic illness among survivors define the first catastrophe.' },
      { id: 'dumping', type: 'hazard', title: 'The plant had already been poisoning soil and water', description: 'Routine dumping and spills before 1984 left chemicals in soil and aquifers — Amnesty’s “second catastrophe”.' },
      { id: 'abandonment', type: 'human_system', title: 'The site was left with toxic stockpiles', description: 'Large chemical wastes remained without adequate clean-up after operations ended.' },
      { id: 'groundwater', type: 'environment', title: 'Groundwater contamination persists into the 2020s', description: 'CGWA sampling for NGT (2023–24) found multiple parameters above BIS/WHO limits near the plant.' },
      { id: 'drinking', type: 'human_system', title: 'Communities still face unsafe water risk', description: 'Contaminated wells compound the health burden of gas-exposed families.' },
      { id: 'justice', type: 'human_system', title: 'Accountability and remediation lagged for decades', description: 'Amnesty’s 40-year review documents unfinished clean-up and incomplete justice.' },
      { id: 'today', type: 'human_system', title: '2024: regulators are still sampling the plume', description: 'NGT suo motu action forced fresh CGWA investigations — the ripple is not historical only.' },
      { id: 'future', type: 'economy', title: 'Full remediation cost remains open', description: 'Emerging: clean-up and compensation tallies keep shifting as new contamination data appears.' },
    ],
    edges: [
      { from: 'leak', to: 'acute', relationship: 'causes', relationship_label: 'causes', evidence_level: 'observed', claim_ids: ['b1'] },
      { from: 'dumping', to: 'groundwater', relationship: 'contaminates', relationship_label: 'contaminates', evidence_level: 'observed', claim_ids: ['b2'] },
      { from: 'abandonment', to: 'groundwater', relationship: 'perpetuates', relationship_label: 'perpetuates', evidence_level: 'observed', claim_ids: ['b3'] },
      { from: 'groundwater', to: 'drinking', relationship: 'threatens', relationship_label: 'threatens', evidence_level: 'observed', claim_ids: ['b4'] },
      { from: 'acute', to: 'justice', relationship: 'demands', relationship_label: 'demands', evidence_level: 'observed', claim_ids: ['b5'] },
      { from: 'groundwater', to: 'today', relationship: 'triggers', relationship_label: 'triggers', evidence_level: 'observed', claim_ids: ['b6'] },
      { from: 'drinking', to: 'future', relationship: 'extends_into', relationship_label: 'extends into', evidence_level: 'emerging', claim_ids: ['b7'] },
      { from: 'leak', to: 'dumping', relationship: 'compounded_by', relationship_label: 'compounded by prior', evidence_level: 'observed', claim_ids: ['b2'] },
    ],
    claims: [
      { id: 'b1', text: 'Amnesty International (2024): the December 1984 MIC leak in Bhopal was one of the worst industrial catastrophes and corporate negligence cases in living memory.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_amnesty_bhopal'], geographic_scope: 'Bhopal', temporal_scope: '2–3 Dec 1984', last_verified: '2026-09-21', caveat: null },
      { id: 'b2', text: 'Amnesty: during plant operation, spillages, accidents, and dumping released dangerous chemicals into air, soil, and groundwater.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_amnesty_bhopal'], geographic_scope: 'UCIL site and surroundings', temporal_scope: 'pre-1984 operations', last_verified: '2026-09-21', caveat: null },
      { id: 'b3', text: 'Amnesty: after the site was abandoned without adequate disposal, thousands of tonnes of toxic waste remained buried in and around the plant.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_amnesty_bhopal'], geographic_scope: 'UCIL premises', temporal_scope: 'abandonment onward', last_verified: '2026-09-21', caveat: null },
      { id: 'b4', text: 'CGWA investigation for NGT (OA 03/2024): 72 groundwater samples within 5 km; nitrate exceeded BIS at 7 sites, iron at 11, manganese at 3; other WHO/BIS exceedances for phosphate/sodium/potassium/hardness; most tested heavy metals within limits.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_cgwa_ngt', 'src_outlook_cgwa'], geographic_scope: '5 km radius of UCIL', temporal_scope: '2023–2024', last_verified: '2026-09-21', caveat: 'Parameter-specific — not all metals elevated.' },
      { id: 'b5', text: 'Amnesty 40-year review: survivors still face incomplete remediation and justice gaps decades after the leak.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_amnesty_bhopal'], geographic_scope: 'Bhopal survivor communities', temporal_scope: '1984–2024', last_verified: '2026-09-21', caveat: null },
      { id: 'b6', text: 'NGT took suo motu cognizance after Dec 2023 reporting on toxic waste and water risk, prompting the fresh CGWA study.', claim_type: 'observation', evidence_level: 'observed', sources: ['src_cgwa_ngt', 'src_outlook_cgwa'], geographic_scope: 'Bhopal', temporal_scope: '2023–2024', last_verified: '2026-09-21', caveat: null },
      { id: 'b7', text: 'Until permanent waste removal and water remediation finish, exposure pathways remain an emerging multi-decade cost.', claim_type: 'prediction', evidence_level: 'emerging', sources: ['src_amnesty_bhopal', 'src_cgwa_ngt'], geographic_scope: 'Bhopal', temporal_scope: '2020s onward', methodology_status: 'institutional trajectory', last_verified: '2026-09-21', caveat: 'No single audited cost total used here.' },
    ],
    predictions: [
      { id: 'pred_water', node_id: 'groundwater', title: 'Contamination remains locally detectable 40 years on', method: 'Treat CGWA exceedance counts as the verified present-day bound.', result_low: 7, result_high: 11, unit: 'sites', verified_against: ['CGWA NGT report 2024'], source_ids: ['src_cgwa_ngt'], confidence: 'medium', evidence_level: 'emerging', caveat: 'Spatial pattern can change with monsoon and pumping.' },
    ],
    sources: [
      { id: 'src_amnesty_bhopal', organization: 'Amnesty International', title: 'Bhopal: 40 Years of Injustice', url: 'https://www.amnesty.org/en/documents/asa20/7817/2024/en/', publication_date: '2024-03', source_type: 'human_rights_investigation', credibility_class: 'tier_2', retrieved_at: '2026-09-21' },
      { id: 'src_cgwa_ngt', organization: 'CGWA / National Green Tribunal', title: 'Groundwater investigation report in O.A. 03/2024', url: 'https://www.greentribunal.gov.in/sites/default/files/news_updates/REPORT%20IN%20O.A.03-2024.pdf', publication_date: '2024', source_type: 'government_assessment', credibility_class: 'tier_1', retrieved_at: '2026-09-21' },
      { id: 'src_outlook_cgwa', organization: 'Outlook India', title: 'New govt study shows high groundwater contamination in some areas', url: 'https://www.outlookindia.com/national/bhopal-gas-tragedy-new-govt-study-shows-high-groundwater-contamination-in-some-areas', publication_date: '2024-03-15', source_type: 'reputable_journalism', credibility_class: 'tier_3', retrieved_at: '2026-09-21' },
    ],
    impacts: [
      { id: 'i_nitrate', category: 'water', metric: 'sites_nitrate_above_bis', value: 7, unit: 'sites', location: 'within 5 km of UCIL', date: '2024', source_id: 'src_cgwa_ngt', status: 'measured' },
      { id: 'i_iron', category: 'water', metric: 'sites_iron_above_bis', value: 11, unit: 'sites', location: 'within 5 km of UCIL', date: '2024', source_id: 'src_cgwa_ngt', status: 'measured' },
      { id: 'i_years', category: 'temporal', metric: 'years_since_disaster', value: 40, unit: 'years', location: 'Bhopal', date: '2024', source_id: 'src_amnesty_bhopal', status: 'observed' },
    ],
    timeline: [
      { id: 't0', bucket: 'DAY 0', label: 'Gas leak', detail: '2–3 Dec 1984 — MIC release over Bhopal neighbourhoods.', evidence_level: 'observed', claim_ids: ['b1'] },
      { id: 't1', bucket: 'YEARS', label: 'Site abandoned with waste', detail: 'Toxic stockpiles remain; groundwater pathway continues.', evidence_level: 'observed', claim_ids: ['b3'] },
      { id: 't2', bucket: 'TODAY', label: '40 years of injustice', detail: 'Amnesty 2024 + CGWA/NGT sampling still find contamination.', evidence_level: 'observed', claim_ids: ['b4', 'b5'] },
      { id: 't3', bucket: 'AHEAD', label: 'Remediation unfinished', detail: 'Clean-up and safe water remain open obligations.', evidence_level: 'emerging', claim_ids: ['b7'] },
    ],
    knowledge_summary: {
      what_we_know: [
        'The 1984 MIC disaster is documented as one of the worst industrial catastrophes (observed).',
        'Toxic waste and groundwater contamination around the plant persist into the 2020s (observed).',
        'Justice and full remediation remain incomplete after 40 years (observed).',
      ],
      what_remains_uncertain: [
        'Full spatial extent of the contamination plume over time.',
        'Complete health and economic cost ledger for second-generation exposure.',
      ],
    },
    evidence_legend: legend,
    media: [
      {
        id: 'hero',
        commons_file: 'Bhopal_memorial_for_those_killed_and_disabled_by_the_1984_toxic_gas_leak.jpg',
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bhopal_memorial_for_those_killed_and_disabled_by_the_1984_toxic_gas_leak.jpg?width=1280',
        credit: 'Wikimedia Commons',
        credit_url: 'https://commons.wikimedia.org/wiki/File:Bhopal_memorial_for_those_killed_and_disabled_by_the_1984_toxic_gas_leak.jpg',
        caption: 'Bhopal memorial for those killed and disabled by the 1984 gas leak — a reminder the story never closed.',
        alt: 'Memorial sculpture in Bhopal for gas tragedy victims',
        placement: 'hero',
        imagery_type: 'location_context',
        note: 'Memorial photograph — not gas-night imagery.',
      },
    ],
    chart: {
      impact_bars: [
        { id: 'y', label: 'Years still unresolved', value: 40, unit: 'years', source_id: 'src_amnesty_bhopal' },
        { id: 'n', label: 'Nitrate-exceedance sites', value: 7, unit: 'sites', source_id: 'src_cgwa_ngt' },
        { id: 'fe', label: 'Iron-exceedance sites', value: 11, unit: 'sites', source_id: 'src_cgwa_ngt' },
      ],
      evidence_mix: [
        { level: 'observed', count: 6 },
        { level: 'emerging', count: 1 },
      ],
    },
  },
  {
    id: 'bhopal_1984',
    data_file: '/data/bhopal_1984.json',
    date: '1984-12-03',
    headline: 'Bhopal 1984: the gas cleared, the groundwater didn’t',
    subheading: '40 years later Amnesty and CGWA/NGT still document toxic waste and contaminated wells.',
    location: 'Bhopal, India',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bhopal_memorial_for_those_killed_and_disabled_by_the_1984_toxic_gas_leak.jpg?width=640',
    image_alt: 'Bhopal gas tragedy memorial',
  },
)
