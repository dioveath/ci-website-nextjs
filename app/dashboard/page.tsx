import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your courses, articles and resources.',
  // Signed-in or per-visitor: nothing here belongs in an index.
  robots: { index: false, follow: false }
};

import DashboardContent from './DashboardContent';

export default function Page() {
  return <DashboardContent />;
}
