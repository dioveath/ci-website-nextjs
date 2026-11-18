'use client';

import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '../lib/hooks/Auth';
import queryClient from '../lib/queryclient';

// The auth context and the query cache are client state, so they cannot live
// in the server root layout directly. This is the boundary between the two.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
