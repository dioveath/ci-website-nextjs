import 'server-only';

import { unstable_rethrow } from 'next/navigation';

import { ActionFailure } from './errors';
import type { ActionResult } from '../../types/courses';

export { ActionFailure, fail } from './errors';

/**
 * Wraps the body of every server action. Expected failures come back as
 * `{ ok: false, error, message }`; anything else is logged and reported as a
 * generic error, so internals never reach the browser.
 */
export async function runAction<T>(label: string, body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ActionFailure) {
      return { ok: false, error: error.code, message: error.message };
    }
    console.error(`[action] ${label} failed:`, error);
    return { ok: false, error: 'internal', message: 'Something went wrong. Please try again.' };
  }
}
