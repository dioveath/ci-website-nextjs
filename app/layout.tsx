import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Official Website. Student profiles, blogs and courses.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
