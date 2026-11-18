'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import ThemeProvider from '@/components/theme/ThemeProvider';

// Auth and theme are both client state, so they cannot live in the server root
// layout directly. This is the boundary between the two.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
