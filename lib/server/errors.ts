import type { ActionError } from '../../types/courses';

/**
 * Thrown inside server-side course code to end an action with a specific,
 * user-presentable error. runAction (lib/server/actions.ts) turns it into an
 * ActionResult. Kept free of Next.js imports so CLI scripts can use the
 * server modules too.
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
