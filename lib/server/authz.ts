import 'server-only';

import type { DecodedIdToken } from 'firebase-admin/auth';

import { adminAuth } from './firebaseAdmin';
import { ActionFailure, fail } from './actions';
import type { Uid } from '../../types/courses';

/*
 * Every server action receives the caller's Firebase ID token as its first
 * argument (sign-in happens in the browser) and resolves it here. Server
 * actions are public POST endpoints, so each one checks for itself; hiding a
 * button is never the security boundary.
 */

export interface Caller {
  uid: Uid;
  email: string | null;
  name: string;
  isAdmin: boolean;
}

function toCaller(token: DecodedIdToken): Caller {
  const email = token.email ?? null;
  return {
    uid: token.uid,
    email,
    name: (token.name as string | undefined)?.trim() || email?.split('@')[0] || 'Student',
    isAdmin: token.admin === true,
  };
}

async function verify(idToken: string, checkRevoked: boolean): Promise<Caller | null> {
  try {
    return toCaller(await adminAuth().verifyIdToken(idToken, checkRevoked));
  } catch (error) {
    // A missing Admin SDK is a server problem, not a bad token.
    if (error instanceof ActionFailure) throw error;
    return null;
  }
}

/**
 * The signed-in caller, or an `unauthenticated` failure. `checkRevoked` costs
 * an extra lookup; use it where a revoked session must stop working at once
 * (admin actions).
 */
export async function requireCaller(idToken: unknown, { checkRevoked = false } = {}): Promise<Caller> {
  if (typeof idToken !== 'string' || idToken.length === 0) fail('unauthenticated', 'Please sign in first.');
  const caller = await verify(idToken, checkRevoked);
  if (!caller) fail('unauthenticated', 'Your session has expired. Please sign in again.');
  return caller;
}

/** The caller when a valid token is given, otherwise anonymous (null). */
export async function optionalCaller(idToken: unknown): Promise<Caller | null> {
  if (typeof idToken !== 'string' || idToken.length === 0) return null;
  return verify(idToken, false);
}

export async function requireAdmin(idToken: unknown): Promise<Caller> {
  const caller = await requireCaller(idToken, { checkRevoked: true });
  if (!caller.isAdmin) fail('forbidden', 'Only administrators can do that.');
  return caller;
}
