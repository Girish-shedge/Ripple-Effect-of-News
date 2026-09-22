export type HeroVideo = {
  youtubeId: string
  title: string
  publisher: string
  /** Stop playback here so the hero stays a short clip. */
  endSeconds?: number
  portrait?: boolean
}

/**
 * Editorially chosen YouTube clips for the story hero.
 * Only named wire / public-broadcaster / institutional channels.
 * Prefer reports under ~90 seconds; longer uploads are clipped with `endSeconds`.
 */
export const STORY_HERO_VIDEOS: Record<string, HeroVideo> = {
  nepal_flood_2026: {
    youtubeId: 'yQAH4Crser8',
    title: "Did a glacier collapse trigger Nepal's deadly floods?",
    publisher: 'BBC News',
    endSeconds: 70,
  },
  south_asia_heat_2026: {
    youtubeId: '0SwQGaSTTkw',
    title: 'Extreme heatwaves: Indians struggle and suffer from water shortages',
    publisher: 'FRANCE 24 English',
    endSeconds: 70,
  },
  europe_heatwave_2026: {
    youtubeId: 'RWoiWS7G7mo',
    title: "Europe's punishing record-breaking heatwave shifts east",
    publisher: 'BBC News',
    portrait: true,
  },
  iberia_wildfires_2025: {
    youtubeId: 'ohwjoPXMzJM',
    title: "Wildfires sweep through Spain's Cadiz as beachgoers watch on",
    publisher: 'Reuters',
  },
  reliance_ai_datacentre_2026: {
    youtubeId: 'o-NfVvP6K6k',
    title: "Meta's Zuckerberg bets hundreds of billions on AI data centers",
    publisher: 'Reuters',
    endSeconds: 55,
  },
  global_inflation_2022: {
    youtubeId: 'JjyaD7cLjik',
    title: 'How the Ukraine War is impacting global grain supplies',
    publisher: 'DW News',
    endSeconds: 70,
  },
  bhopal_1984: {
    youtubeId: 'sRuz9bzBrtY',
    title: 'CSB Safety Video: Reactive Hazards',
    publisher: 'US Chemical Safety Board',
    endSeconds: 65,
  },
  deepwater_horizon_2010: {
    youtubeId: 'HoDV9124K14',
    title: "From AP archives: BP's Deepwater Horizon oil spill in 2010",
    publisher: 'Associated Press',
  },
  aral_sea_desiccation: {
    youtubeId: 'xSEXIxDVMBg',
    title: 'Aral Sea: UNEP and Google Earth highlights environmental change',
    publisher: 'UNEP / Google Earth',
    endSeconds: 80,
  },
}

export function heroVideoForStory(storyId: string): HeroVideo | undefined {
  return STORY_HERO_VIDEOS[storyId]
}
