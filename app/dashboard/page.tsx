import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute - Dashboard'
};

import DashboardContent from './DashboardContent';

export default function Page() {
  return <DashboardContent />;
}
