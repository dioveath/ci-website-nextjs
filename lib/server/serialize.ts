import 'server-only';

import type { Serialized } from '../../types/courses';

function isTimestamp(value: unknown): value is { toMillis(): number } {
  return typeof value === 'object' && value !== null && typeof (value as { toMillis?: unknown }).toMillis === 'function';
}

function convert(value: unknown): unknown {
  if (isTimestamp(value)) return value.toMillis();
  if (Array.isArray(value)) return value.map(convert);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convert(item)]));
  }
  return value;
}

/**
 * A Firestore document as plain JSON for the browser: every Timestamp, at any
 * depth, becomes epoch milliseconds (class instances cannot be passed from a
 * server action to a client component).
 */
export function serialize<T extends object, Id extends string>(id: Id, doc: T): Serialized<T> & { id: Id } {
  return { ...(convert(doc) as Serialized<T>), id };
}
