import PageShell from '../components/layout/PageShell';
import Hero from '../components/home/Hero';
import ServicesTeaser from '../components/home/ServicesTeaser';
import FeaturedCourses from '../components/home/FeaturedCourses';
import VideoFeature from '../components/home/VideoFeature';
import Stories from '../components/home/Stories';
import AppPromo from '../components/home/AppPromo';
import FinalCta from '../components/home/FinalCta';

import { getHomePage, getServices } from '../lib/sanity/fetchers';

export const revalidate = 60;

export default async function HomePage() {
  const [home, services] = await Promise.all([getHomePage(), getServices()]);

  return (
    <PageShell>
      <Hero hero={home.hero} stats={home.stats} />
      <ServicesTeaser services={services} />
      <FeaturedCourses courses={home.featuredCourses} />
      <VideoFeature url={home.featureVideoUrl} />
      <Stories stories={home.stories} />
      <AppPromo appPromo={home.appPromo} />
      <FinalCta />
    </PageShell>
  );
}
