'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import LoadingScreen from '../LoadingScreen';
import SideMenu, { type ConsolePage } from '../SideMenu';
import useAuth from '@/lib/auth';
import useIsClient from '@/lib/hooks/useIsClient';

/**
 * The signed-in console shell, shared by /dashboard and /admin.
 *
 * Both routes previously carried their own copy of this: the same auth gate,
 * the same side menu wired to the same page index state, differing only in
 * which pages they listed and who was allowed in. That duplication is the
 * `guard` prop and the `pages` prop now. (React Query is provided app-wide in
 * app/providers.tsx.)
 */
export default function ConsoleShell({
  pages,
  guard
}: {
  pages: ConsolePage[];
  /** Returns a path to send the visitor to, or null to let them through. */
  guard?: (auth: ReturnType<typeof useAuth>) => string | null;
}) {
  const auth = useAuth();
  const router = useRouter();
  const isClient = useIsClient();
  const [page, setPage] = useState(0);

  const ready = isClient && !auth.loading;
  const redirectTo = !ready ? null : !auth.isLoggedIn ? '/' : (guard?.(auth) ?? null);

  // Navigation is a side effect, so it runs after render rather than during it.
  useEffect(() => {
    if (redirectTo) router.push(redirectTo);
  }, [redirectTo, router]);

  if (!ready || redirectTo) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen bg-muted">
      <SideMenu pages={pages} currentPage={page} setPage={setPage} />
      <div className="h-screen w-full overflow-y-auto px-4 py-6 md:px-8">
        {pages[page]?.element}
      </div>
    </div>
  );
}

export function UnderConstruction({ pageName }: { pageName: string }): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase">
        Under construction
      </h1>
      <p className="text-muted-foreground">
        &lsquo;{pageName}&rsquo; is on the way — check back shortly.
      </p>
    </div>
  );
}
