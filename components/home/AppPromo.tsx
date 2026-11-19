import Image from 'next/image';
import Link from 'next/link';

import Section from '../layout/Section';
import { Button } from '../ui/button';
import { homePageFallback, siteSettingsFallback } from '../../lib/sanity/fallbacks';

type AppPromo = typeof homePageFallback.appPromo;

export default function AppPromo({
  appPromo = homePageFallback.appPromo
}: {
  appPromo?: AppPromo;
}) {
  const storeLink = appPromo.badgeLink || siteSettingsFallback.playStoreLink;

  return (
    <Section tone="brand" as="div">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Image
          src="/app.png"
          alt="The Charicha Institute app running on a phone"
          width={420}
          height={720}
          sizes="(max-width: 1024px) 60vw, 420px"
          className="mx-auto h-auto w-full max-w-xs"
        />

        <div className="flex flex-col items-start gap-5">
          <h2 className="text-3xl font-semibold tracking-tight text-on-brand md:text-4xl">
            {appPromo.title}
          </h2>
          <p className="max-w-md text-base text-on-brand-muted">{appPromo.subtitle}</p>

          {/*
            There used to be an email field here whose submit handler only
            logged to the console, so every address typed into it was
            discarded. Until there is somewhere to store them, this links
            straight to the listing instead of pretending to collect them.
          */}
          <Button asChild size="xl" variant="highlight">
            <Link href={storeLink} target="_blank" rel="noopener noreferrer">
              Get it on Google Play
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
