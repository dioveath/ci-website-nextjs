import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import VideoEmbed from '../media/VideoEmbed';
import { youTubeId } from '../../lib/media/youtube';

export default function VideoFeature({ url }: { url?: string | null }) {
  if (!youTubeId(url)) return null;

  return (
    <Section width="narrow">
      <SectionHeading
        align="center"
        eyebrow="See us in action"
        title="A look inside the institute"
        className="items-center"
      />
      <div className="mt-10">
        <VideoEmbed url={url} title="A look inside Charicha Institute" />
      </div>
    </Section>
  );
}
