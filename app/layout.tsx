import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Raleway, Montserrat } from 'next/font/google';

import '../styles/globals.css';
import Providers from './providers';

// Self-hosted at build time, so the visitor's browser makes no request to
// Google. Exposed as CSS variables that styles/globals.css maps onto the
// --font-sans / --font-heading tokens.
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
    // suppressHydrationWarning: next-themes writes the theme class onto <html>
    // from a blocking inline script before React hydrates, so the server's
    // markup and the browser's deliberately differ on this one element.
    <html
      lang="en"
      className={`${raleway.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
