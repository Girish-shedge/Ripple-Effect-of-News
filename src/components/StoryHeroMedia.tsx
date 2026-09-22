import type { HeroVideo } from '../lib/heroVideos'

function embedSrc(video: HeroVideo) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: video.youtubeId,
    controls: '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    disablekb: '0',
    cc_load_policy: '0',
  })
  if (video.endSeconds && video.endSeconds > 0) {
    params.set('start', '0')
    params.set('end', String(video.endSeconds))
  }
  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params.toString()}`
}

/** Muted autoplaying YouTube clip for the first story section. */
export function StoryHeroMedia({ video }: { video: HeroVideo }) {
  return (
    <figure className="story-doc-hero-image">
      <div
        className="story-doc-hero-frame story-doc-hero-frame--video"
        data-portrait={video.portrait || undefined}
      >
        <iframe
          className="story-doc-hero-video"
          src={embedSrc(video)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="story-doc-video-badge">{video.publisher}</div>
      </div>
    </figure>
  )
}
