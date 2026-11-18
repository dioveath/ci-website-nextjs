'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import useAuth from '@/lib/auth';
import useIsClient from '@/lib/hooks/useIsClient';
import queryClient from '@/lib/queryClient';
import styles from '../styles/dashboard/index.module.css';
import LoadingScreen from './LoadingScreen';
import SideMenu, { type SideMenuPage } from './SideMenu';

export interface DashboardPage extends SideMenuPage {
  /** Shown only to users with the manager role. */
  managerOnly?: boolean;
}

/** A menu entry that signs the user out when opened. */
export function Logout() {
  const { logout } = useAuth();
  useEffect(() => { logout(); }, [logout]);
  return <LoadingScreen/>;
}

/** A menu entry that navigates elsewhere when opened. */
export function GoTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => { router.push(href); }, [router, href]);
  return <LoadingScreen/>;
}

/*
 * The signed-in shell shared by /dashboard and /admin: auth gate, query
 * client, side menu and the selected page. With managersOnly, non-managers
 * are sent to /dashboard.
 */
export default function DashboardShell({ pages, managersOnly = false }: { pages: DashboardPage[]; managersOnly?: boolean }) {
  const { userData, isLoggedIn, loading } = useAuth();
  const [page, setPage] = useState(0);
  const isClient = useIsClient();
  const router = useRouter();

  const isManager = !!userData?.roles?.manager;
  const ready = isClient && !loading;
  const redirectTo = !ready ? null
    : !isLoggedIn ? '/'
    : managersOnly && !isManager ? '/dashboard'
    : null;

  // Navigation is a side effect, so it runs after render rather than during it.
  useEffect(() => {
    if (redirectTo) router.push(redirectTo);
  }, [redirectTo, router]);

  if (!ready || redirectTo) return <LoadingScreen/>;

  const visible = pages.filter((p) => !p.managerOnly || isManager);

  return (
    <div className={styles.container}>
      <QueryClientProvider client={queryClient}>
        <main className='bg-slategray'>
          <div className="flex">
            <SideMenu pages={visible} currentPage={page} setPage={setPage}/>
            <div className='w-full h-screen overflow-y-scroll pb-96 px-0 md:px-4'>
              { visible[page].element }
            </div>
          </div>
        </main>
      </QueryClientProvider>
    </div>
  );
}
