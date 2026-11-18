import 'server-only';

import { ActionFailure } from './errors';
import type { ActionResult } from '../../types/courses';

export { ActionFailure, fail } from './errors';

/**
 * Next.js signals redirect(), notFound() and dynamic-rendering bailouts by
 * throwing errors that carry a string `digest`; those must propagate. (This is
 * what unstable_rethrow checks. Importing it would pull the Next runtime into
 * every server module, which breaks running them in tests and scripts.)
 */
function isFrameworkSignal(error: unknown): boolean {
  return typeof (error as { digest?: unknown } | null)?.digest === 'string';
}

/**
 * Wraps the body of every server action. Expected failures come back as
 * `{ ok: false, error, message }`; anything else is logged and reported as a
 * generic error, so internals never reach the browser.
 */
export async function runAction<T>(label: string, body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (error) {
    if (isFrameworkSignal(error)) throw error;
    if (error instanceof ActionFailure) {
      return { ok: false, error: error.code, message: error.message };
    }
    console.error(`[action] ${label} failed:`, error);
    return { ok: false, error: 'internal', message: 'Something went wrong. Please try again.' };
  }
}
