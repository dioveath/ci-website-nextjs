import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Section from '../layout/Section';
import { Button } from '../ui/button';

export default function FinalCta() {
  return (
    <Section tone="muted" space="sm" as="div">
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Ready to start?
        </h2>
        <p className="max-w-xl text-base text-muted-foreground">
          Visit us in Belbari, or send a message and we will walk you through the
          course that fits where you are now.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/courses">
              Find a course
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/contact">Talk to us</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
