/**
 * Shallow-merge a fetched document over its static fallback, skipping values
 * the CMS left unset.
 *
 * A GROQ projection returns a missing attribute as an explicit `null`, so a
 * plain spread would blank a field the UI depends on. Skipping null and
 * undefined lets the fallback fill those gaps instead.
 *
 * Shared by the server fetchers and the client hooks, which previously each
 * carried their own copy of this loop.
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
