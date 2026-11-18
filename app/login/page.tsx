import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Charicha Institute with your Google account.',
  // Signed-in or per-visitor: nothing here belongs in an index.
  robots: { index: false, follow: false }
};

import LoginContent from './LoginContent';

export default function Page() {
  return <LoginContent />;
}
