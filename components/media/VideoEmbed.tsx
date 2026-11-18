'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';

import { cn } from '../../lib/utils';
import { youTubeId, youTubeThumbnail } from '../../lib/media/youtube';

/**
 * A click-to-load YouTube facade.
 *
 * The landing page mounted three <ReactPlayer> instances, so every visitor
 * downloaded the player and three YouTube iframes before deciding to watch
 * anything. This ships a thumbnail and a button; the iframe is created on the
 * first click.
 */

export default function VideoEmbed({
  url,
  title,
  className
}: {
  url?: string | null;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youTubeId(url);

  if (!id) return null;

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-card',
        className
      )}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={youTubeThumbnail(id)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <span
            className="absolute inset-0 flex items-center justify-center bg-brand-to/40 transition-colors group-hover:bg-brand-to/55"
            aria-hidden
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-pop transition-transform group-hover:scale-110">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
