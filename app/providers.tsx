'use client';

import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import ThemeProvider from '@/components/theme/ThemeProvider';

// Theme, the query cache and auth are all client state, so they cannot live in
// the server root layout directly. This is the boundary between the two. The
// query cache is app-wide because course pages (enrol box, curriculum, My
// Courses) use it outside the signed-in console.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
