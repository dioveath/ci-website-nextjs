import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import CardGrid from '../layout/CardGrid';
import Section from '../layout/Section';
import SectionHeading from '../layout/SectionHeading';
import ServiceCard from '../services/ServiceCard';
import { Button } from '../ui/button';

interface Service {
  title: string;
  description: string;
}

export default function ServicesTeaser({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="What we do"
        title="More than a classroom"
        description="Training, certification prep, repairs and consulting — run by the same team, in the same building."
      />

      <CardGrid className="mt-10">
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.title} title={service.title}>
            {service.description}
          </ServiceCard>
        ))}
      </CardGrid>

      <Button asChild variant="link" size="inline" className="mt-6">
        <Link href="/services">
          All services
          <ArrowRight />
        </Link>
      </Button>
    </Section>
  );
}
