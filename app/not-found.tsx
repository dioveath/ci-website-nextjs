import Link from 'next/link';

import PageShell from '../components/layout/PageShell';
import Section from '../components/layout/Section';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <PageShell>
      <Section space="lg">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Error 404
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            That page isn&apos;t here
          </h1>
          <p className="max-w-md text-muted-foreground">
            The link may be out of date, or the page may have moved.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="xl">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
