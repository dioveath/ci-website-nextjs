import type { Metadata } from 'next';

import PageShell from '../../components/layout/PageShell';
import Section from '../../components/layout/Section';
import SectionHeading from '../../components/layout/SectionHeading';
import { getContactPage } from '../../lib/sanity/fetchers';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Charicha Institute in Belbari, Morang — by phone, email or in person.'
};

export const revalidate = 60;

export default async function ContactPage() {
  const page = await getContactPage();

  return (
    <PageShell>
      <Section tone="brand" space="sm" as="div">
        <SectionHeading
          level={1}
          tone="brand"
          eyebrow="Contact"
          title={page.title}
          description={page.description}
        />
      </Section>

      <Section>
        <ContactContent page={page} />
      </Section>
    </PageShell>
  );
}
