import Section from '../layout/Section';
import VideoEmbed from '../media/VideoEmbed';
import { homePageFallback } from '../../lib/sanity/fallbacks';

type Story = (typeof homePageFallback.stories)[number];

export default function Stories({ stories = homePageFallback.stories }: { stories?: Story[] }) {
  if (!stories.length) return null;

  return (
    <>
      {stories.map((story, index) => {
        // Alternate the video side, and alternate the surface with it so the
        // rhythm is visible rather than one long undifferentiated column.
        const flipped = index % 2 === 1;

        return (
          <Section key={story.title} tone={flipped ? 'muted' : 'default'}>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className={flipped ? 'lg:order-2' : undefined}>
                <VideoEmbed url={story.videoUrl} title={story.title} />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {story.title}
                </h2>
                <p className="text-base text-muted-foreground">{story.body}</p>
              </div>
            </div>
          </Section>
        );
      })}
    </>
  );
}
