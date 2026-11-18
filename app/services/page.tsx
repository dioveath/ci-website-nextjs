import type { Metadata } from 'next';

import CardGrid from '../../components/layout/CardGrid';
import PageShell from '../../components/layout/PageShell';
import Section from '../../components/layout/Section';
import SectionHeading from '../../components/layout/SectionHeading';
import ServiceCard from '../../components/services/ServiceCard';
import { getServices } from '../../lib/sanity/fetchers';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Training courses, certification exam prep, computer repair, network and security consulting, web design and data recovery.'
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <PageShell>
      <Section tone="brand" space="sm" as="div">
        <SectionHeading
          level={1}
          tone="brand"
          eyebrow="Services"
          title="What we can help you with"
          description="Our team covers training, certification, repairs and consulting — so you can bring us a problem rather than a product."
        />
      </Section>

      <Section>
        <CardGrid>
          {services.map((service) => (
            <ServiceCard key={service.title} title={service.title} headingLevel={2}>
              {service.description}
            </ServiceCard>
          ))}
        </CardGrid>
      </Section>
    </PageShell>
  );
}
