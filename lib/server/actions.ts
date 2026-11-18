import 'server-only';

import { unstable_rethrow } from 'next/navigation';

import type { ActionError, ActionResult } from '../../types/courses';

/**
 * Thrown inside server-side course code to end an action with a specific,
 * user-presentable error. runAction turns it into an ActionResult.
 */
export class ActionFailure extends Error {
  readonly code: ActionError;

  constructor(code: ActionError, message: string) {
    super(message);
    this.name = 'ActionFailure';
    this.code = code;
  }
}

export function fail(code: ActionError, message: string): never {
  throw new ActionFailure(code, message);
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
    unstable_rethrow(error);
    if (error instanceof ActionFailure) {
      return { ok: false, error: error.code, message: error.message };
    }
    console.error(`[action] ${label} failed:`, error);
    return { ok: false, error: 'internal', message: 'Something went wrong. Please try again.' };
  }
}
