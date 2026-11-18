import type { ReactNode } from 'react';

import Navbar from '../Navbar';
import Footer from '../footer/Footer';

/**
 * The page scaffold: header, main landmark, footer.
 *
 * Every route used to repeat this by hand, each wrapping its own
 * `<main className="bg-linear-[-45deg] from-eggblue to-slategray">` and
 * passing the current path to <Navbar> and <Footer> as a prop. Both now read
 * the path themselves, so there is nothing left to keep in sync.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
