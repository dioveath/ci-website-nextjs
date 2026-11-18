/**
 * Pure URL parsing, kept out of the 'use client' module so server components
 * can call it too -- a function exported from a client module can only be
 * rendered or passed as a prop, never invoked on the server.
 *
 * Accepts watch?v=, youtu.be/, /embed/, /shorts/ and /v/ forms.
 * Returns null for anything it does not recognise.
 */
export function youTubeId(url?: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    if (!parsed.hostname.endsWith('youtube.com')) return null;

    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery) return fromQuery;

    const match = parsed.pathname.match(/\/(?:embed|shorts|v)\/([^/?]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Thumbnail for a video id. 480x360, which covers every card size in use. */
export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
