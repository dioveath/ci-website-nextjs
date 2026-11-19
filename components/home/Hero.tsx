import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Section from '../layout/Section';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { homePageFallback } from '../../lib/sanity/fallbacks';

type Hero = typeof homePageFallback.hero;
type Stat = (typeof homePageFallback.stats)[number];

export default function Hero({
  hero = homePageFallback.hero,
  stats = homePageFallback.stats
}: {
  hero?: Hero;
  stats?: Stat[];
}) {
  return (
    <Section tone="brand" space="lg" as="div">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="on-brand">Belbari, Morang &middot; since 2015</Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-on-brand md:text-5xl xl:text-6xl">
            {hero.title}
          </h1>

          <p className="max-w-xl text-base text-on-brand-muted md:text-lg">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            {/*
              The call to action is a link, not a bare <button>. It rendered as
              an inert button for the life of the old page while the CMS field
              that says where it goes sat unused.
            */}
            <Button asChild size="xl">
              <Link href={hero.ctaLink || '/login'}>
                {hero.ctaLabel}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="on-brand">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/ci_pc.svg"
            alt="A desktop computer in the Charicha Institute lab"
            width={700}
            height={500}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>

      {stats.length ? (
        <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-on-brand/20 pt-10 md:grid-cols-4">
          {stats.map((stat) => (
            // flex-col-reverse: the term has to precede the definition in the
            // DOM, while the figure reads better above its label.
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-on-brand-muted">{stat.label}</dt>
              <dd className="text-3xl font-semibold text-on-brand md:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  );
}
