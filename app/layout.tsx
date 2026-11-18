import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  // Base for URL-valued metadata (Open Graph urls/images), so pages can use
  // relative paths. www.charichainstitute.com.np 301s to this host.
  metadataBase: new URL('https://charichainstitute.com.np'),
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
