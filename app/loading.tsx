import Section from '../components/layout/Section';
import CardGrid from '../components/layout/CardGrid';
import { Skeleton } from '../components/ui/skeleton';

/**
 * The instant loading state for the whole app. Mirrors the shape of a listing
 * page -- a heading band and a card grid -- so the swap to real content does
 * not move the layout under the reader.
 */
export default function Loading() {
  return (
    <Section>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <CardGrid className="mt-10">
        {[0, 1, 2].map((key) => (
          <div key={key} className="flex flex-col gap-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </CardGrid>
    </Section>
  );
}
