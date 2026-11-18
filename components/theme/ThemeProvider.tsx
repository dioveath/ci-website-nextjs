'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Applies `.dark` to <html>, which is the selector the `dark:` variant is
 * declared against in styles/globals.css.
 *
 * `defaultTheme="system"` means the OS preference is honoured before any
 * explicit choice is made, and next-themes writes the class from a blocking
 * inline script, so the correct theme is in place before first paint rather
 * than flashing light and correcting afterwards.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
