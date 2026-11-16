'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during server rendering and hydration, true afterwards.
 *
 * Replaces the `useState(true)` + `useEffect(() => setOnServer(false))` guard:
 * same output, but without the extra render that setting state in an effect
 * costs (react-hooks/set-state-in-effect).
 */
export default function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
