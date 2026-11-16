import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute - Register'
};

import RegisterContent from './RegisterContent';

export default function Page() {
  return <RegisterContent />;
}
