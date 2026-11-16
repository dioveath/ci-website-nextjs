import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute - Admin'
};

import AdminContent from './AdminContent';

export default function Page() {
  return <AdminContent />;
}
