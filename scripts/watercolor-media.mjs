/**
 * Shared watercolor style for ALL Ripple imagery (home cards + every detail section).
 *
 * Rules (also in rules.md):
 * 1. Same watercolor style + slight film grain on every image.
 * 2. Source/Commons photos must be converted into this watercolor style (not shown as raw photos).
 * 3. Subject must match the section/card content exactly — no decorative mismatches.
 * 4. UI shows “This image is AI generated” on every detail/home image.
 * 5. Every section and every home card must have an image.
 *
 * Generation: use Cursor GenerateImage, aspect_ratio "16:9", then copy into public/media/.
 * Filenames: wc-<storyShort>-<slot>.png  (slot = cover|hero|reach|timeline|predictions|knowledge|sources|<nodeId>)
 */
export const WATERCOLOR_STYLE = `Unified documentary watercolor on cold-press paper: soft wet-on-wet washes, muted natural pigments, gentle pigment blooms at edges, visible paper tooth, and a light film-grain overlay across the whole image. Looks nearly photographic but clearly watercolor, not a digital photo. Consistent soft lighting. No sharp HDR photo look. No people close-ups, no readable text, no logos, no watermarks, no frames, no UI. Wide cinematic 16:9.`

export function watercolorPrompt(place, subject) {
  return `${WATERCOLOR_STYLE} Place-correct setting: ${place}. Exact subject for this panel: ${subject}. Do not invent unrelated scenery.`
}

export const WATERCOLOR_CREDIT = 'Ripple watercolor illustration (AI-generated)'
export const WATERCOLOR_NOTE =
  'AI-generated watercolor with grain. Converted or created for this section; not a raw event-day photograph.'
