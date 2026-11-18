import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Raleway, Montserrat } from 'next/font/google';

import '../styles/globals.css';
import Providers from './providers';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '../lib/site';
import { siteSettingsFallback } from '../lib/sanity/fallbacks';

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
  metadataBase: new URL(SITE_URL),
  title: {
    // Every page used to emit the literal title "Charicha Institute", so a tab
    // strip and a search result page were indistinguishable. A page now sets
    // its own name and this appends the brand.
    template: `%s · ${SITE_NAME}`,
    default: `${SITE_NAME} — Computer training in Belbari, Morang`
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    url: SITE_URL
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true }
};

/** Tells search engines what this organisation is, not just what the page says. */
const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: absoluteUrl('/ci_logo_full.png'),
  email: siteSettingsFallback.contact.email,
  telephone: siteSettingsFallback.contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteSettingsFallback.contact.address,
    addressRegion: 'Morang',
    addressCountry: 'NP'
  }
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
        <script
          type="application/ld+json"
          // Escaping `<` is what keeps a stray tag in CMS copy from closing
          // this script element early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organisationJsonLd).replace(/</g, '\\u003c')
          }}
        />
      </body>
    </html>
  );
}
