'use client';

import { useEffect, useState } from 'react';
import { mergeDefined, sanityClient } from './client';
import { navigationQuery, siteSettingsQuery } from './queries';
import { navigationFallback, siteSettingsFallback } from './fallbacks';

/*
 * Client reads for the global <Navbar> and <Footer>, which every page renders
 * itself. Each returns the fallback on the server and the first client render
 * (identical markup, so no hydration mismatch), then swaps in CMS data after
 * mount when Sanity is configured.
 */
function useSingleton<T extends object>(query: string, fallback: T, label: string): T {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    if (!sanityClient) return undefined;
    let active = true;
    sanityClient
      .fetch(query)
      .then((data: Record<string, unknown> | null) => {
        if (active && data) setValue(mergeDefined(fallback, data));
      })
      .catch((err: unknown) => {
        console.warn(`[sanity] ${label} failed, keeping fallback:`, err instanceof Error ? err.message : String(err));
      });
    return () => { active = false; };
  }, [query, fallback, label]);

  return value;
}

export function useNavigation() {
  return useSingleton(navigationQuery, navigationFallback, 'useNavigation');
}

export function useSiteSettings() {
  return useSingleton(siteSettingsQuery, siteSettingsFallback, 'useSiteSettings');
}
