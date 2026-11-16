import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Contact'
};

import { getContactPage } from '../../lib/sanity/fetchers';
import ContactContent from './ContactContent';

export const revalidate = 60;

export default async function ContactPage() {
  const page = await getContactPage();
  return <ContactContent page={page} />;
}
