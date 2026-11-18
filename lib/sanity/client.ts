import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Exported for lib/server/content.ts, which builds a second client for the
// private course-content dataset with the same project and API version.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// The site works without Sanity configured: when no projectId is set the
// client is null and every read falls back to the bundled static data in
// ./fallbacks.
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion,
      useCdn: true, // fine for published, cacheable content
    })
  : null;

const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** URL for a Sanity image, or null when Sanity isn't configured or the source is empty. */
export function urlFor(source: unknown): string | null {
  if (!imageBuilder || !source) return null;
  return imageBuilder.image(source).url();
}

/*
 * Singletons: shallow-merge the fallback under the fetched doc so a partially
 * filled document never drops a field the UI expects. A GROQ projection
 * returns missing attributes as explicit `null`, so null/undefined values are
 * skipped and the fallback fills those gaps.
 */
export function mergeDefined<T extends object>(
  fallback: T,
  data: Record<string, unknown> | null | undefined
): T {
  if (!data) return fallback;
  const merged: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) merged[key] = value;
  }
  return merged as T;
}
