'use client'; // Error boundaries must be Client Components.

import { useEffect } from 'react';

import PageShell from '../components/layout/PageShell';
import Section from '../components/layout/Section';
import { Button } from '../components/ui/button';

export default function Error({
  error,
  // Next 16 renamed this from `reset`; it re-fetches and re-renders the segment.
  retry
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <Section space="lg">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-sm font-semibold tracking-widest text-destructive uppercase">
            Something went wrong
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            We hit a problem loading this page
          </h1>
          <p className="max-w-md text-muted-foreground">
            It is probably temporary. Try again, and let us know if it keeps happening.
          </p>
          <Button size="xl" onClick={() => retry()}>
            Try again
          </Button>
        </div>
      </Section>
    </PageShell>
  );
}
