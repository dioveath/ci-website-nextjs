'use client';

import { navigationQuery } from './queries';
import { navigationFallback } from './fallbacks';
import { useSanitySingleton } from './useSanitySingleton';

/** Header links for the global <Navbar>. */
export function useNavigation() {
  return useSanitySingleton(navigationQuery, navigationFallback, 'useNavigation');
}
