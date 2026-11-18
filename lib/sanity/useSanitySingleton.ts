'use client';

import { useEffect, useState } from 'react';
import { sanityClient } from './client';
import { mergeDefined } from './merge';

/**
 * Reads a Sanity singleton from a component that renders on every page and so
 * cannot be a server component.
 *
 * Returns the static fallback on the server and on the first client render --
 * identical markup, so no hydration mismatch -- then swaps in CMS data after
 * mount when Sanity is configured.
 *
 * <Navbar> and <Footer> each had their own copy of this; this is the shared one.
 */
export function useSanitySingleton<T extends object>(
  query: string,
  fallback: T,
  label: string
): T {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    if (!sanityClient) return undefined;

    let active = true;
    sanityClient
      .fetch(query)
      .then((data: Record<string, unknown> | null) => {
        if (active) setValue(mergeDefined(fallback, data));
      })
      .catch((err: unknown) => {
        console.warn(
          `[sanity] ${label} failed, keeping fallback:`,
          err instanceof Error ? err.message : String(err)
        );
      });

    return () => {
      active = false;
    };
    // `fallback` is a module-level constant at every call site, so it is stable
    // across renders and does not belong in the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, label]);

  return value;
}
