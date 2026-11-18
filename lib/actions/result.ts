import type { ActionError, ActionResult } from '../../types/courses';

/** An `{ ok: false }` ActionResult, thrown so react-query and try/catch see it. */
export class ActionResultError extends Error {
  readonly code: ActionError;

  constructor(code: ActionError, message: string) {
    super(message);
    this.name = 'ActionResultError';
    this.code = code;
  }
}

/** The data of a successful result; throws ActionResultError otherwise. */
export function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new ActionResultError(result.error, result.message);
  return result.data;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
