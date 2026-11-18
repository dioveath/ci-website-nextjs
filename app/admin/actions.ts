'use server';

import { requireAdmin } from '../../lib/server/authz';
import { fail, runAction } from '../../lib/server/actions';
import { listAllUsers, setAdminRole } from '../../lib/server/roles';
import { isUid } from '../../lib/courses/ids';
import type { ActionResult, AdminUserRow } from '../../types/courses';

/*
 * Admin panel server actions. Each one re-checks the caller's `admin` claim
 * (with revocation), whatever the UI shows. Course and order management are
 * in app/admin/courseActions.ts.
 */

export async function listUsers(idToken: string): Promise<ActionResult<AdminUserRow[]>> {
  return runAction('listUsers', async () => {
    await requireAdmin(idToken);
    return listAllUsers();
  });
}

export async function setAdmin(
  idToken: string,
  input: { uid: string; grant: boolean }
): Promise<ActionResult> {
  return runAction('setAdmin', async () => {
    const caller = await requireAdmin(idToken);
    if (!isUid(input?.uid) || typeof input.grant !== 'boolean') fail('invalid', 'Invalid request.');
    if (input.uid === caller.uid && !input.grant) {
      fail('invalid', 'You cannot remove your own admin role. Ask another admin.');
    }
    await setAdminRole(input.uid, input.grant);
  });
}
