'use client';

import { useEffect, useState } from 'react';
import { sanityClient } from './client';
import { navigationQuery } from './queries';
import { navigationFallback } from './fallbacks';

// Client hook for the global <Navbar>, which is rendered on every page and so
// can't use getStaticProps. It returns the hardcoded fallback on the server and
// the first client render (identical markup -> no hydration mismatch), then
// swaps in CMS data after mount when Sanity is configured.
export function useNavigation() {
  const [navigation, setNavigation] = useState(navigationFallback);

  useEffect(() => {
    if (!sanityClient) return undefined;
    let active = true;
    sanityClient
      .fetch(navigationQuery)
      .then((data: Record<string, unknown> | null) => {
        // Skip null/undefined values (GROQ returns missing fields as null) so an
        // unset CMS field falls back instead of blanking the nav.
        if (active && data) {
          const merged: Record<string, unknown> = { ...navigationFallback };
          for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) merged[key] = value;
          }
          setNavigation(merged as typeof navigationFallback);
        }
      })
      .catch((err: unknown) => {
         
        console.warn('[sanity] useNavigation failed, keeping fallback:', (err instanceof Error ? err.message : String(err)));
      });
    return () => {
      active = false;
    };
  }, []);

  return navigation;
}
