'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '../lib/hooks/Auth';

// The auth context is client state, so it cannot live in the server root
// layout directly. This is the boundary between the two.
export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
