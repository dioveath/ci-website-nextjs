import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

// The default export is deprecated in favour of this named one.
const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

// urlFor(source) -> string | null. Returns null when Sanity isn't configured
// or the source is empty, so callers can fall back to a local /public asset.
export function urlFor(source: unknown): string | null {
  if (!builder || !source) return null;
  return builder.image(source).url();
}
