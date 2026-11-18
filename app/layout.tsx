import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Raleway, Montserrat } from 'next/font/google';

import '../styles/globals.css';
import Providers from './providers';

// Self-hosted at build time (no request to Google from the visitor's browser).
// Exposed as CSS variables, used by globals.css (body) and the CSS modules
// that set Montserrat.
const raleway = Raleway({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-raleway',
  display: 'swap'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat-loaded',
  display: 'swap'
});

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
    <html lang="en" className={`${raleway.variable} ${montserrat.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
