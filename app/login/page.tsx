import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute - Login'
};

import LoginContent from './LoginContent';

export default function Page() {
  return <LoginContent />;
}
