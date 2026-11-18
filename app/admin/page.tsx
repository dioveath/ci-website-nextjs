import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Manage courses, articles, resources and users.',
  // Signed-in or per-visitor: nothing here belongs in an index.
  robots: { index: false, follow: false }
};

import AdminContent from './AdminContent';

export default function Page() {
  return <AdminContent />;
}
