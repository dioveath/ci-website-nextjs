'use client';

import { siteSettingsQuery } from './queries';
import { siteSettingsFallback } from './fallbacks';
import { useSanitySingleton } from './useSanitySingleton';

/** Organisation details and link lists for the global <Footer>. */
export function useSiteSettings() {
  return useSanitySingleton(siteSettingsQuery, siteSettingsFallback, 'useSiteSettings');
}
