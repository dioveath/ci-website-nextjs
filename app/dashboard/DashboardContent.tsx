'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import {
  BookOpen,
  Files,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

import ConsoleShell, { UnderConstruction } from '@/components/layout/ConsoleShell';
import LoadingScreen from '@/components/LoadingScreen';
import type { ConsolePage } from '@/components/SideMenu';
import useAuth from '@/lib/auth';

import ArticleContainer from './_articles';
import MediaContainer from './_media';
import MyCoursesContainer from './_my-courses';

function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <LoadingScreen label="Signing you out" />;
}

function ToAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin');
  }, [router]);
  return <LoadingScreen label="Opening admin" />;
}

export default function DashboardContent() {
  // From the server-set `admin` custom claim; UI only (the server re-checks).
  const { isAdmin } = useAuth();

  const pages = useMemo<ConsolePage[]>(() => {
    const base: ConsolePage[] = [
      { label: 'My courses', icon: <BookOpen className="size-4" />, element: <MyCoursesContainer /> },
      { label: 'Performance', icon: <TrendingUp className="size-4" />, element: <UnderConstruction pageName="Performance" /> },
      { label: 'Articles', icon: <Newspaper className="size-4" />, element: <ArticleContainer /> },
      { label: 'Resources', icon: <Files className="size-4" />, element: <MediaContainer /> },
      { label: 'Settings', icon: <Settings className="size-4" />, element: <UnderConstruction pageName="Settings" /> },
      { label: 'Logout', icon: <LogOut className="size-4" />, element: <Logout /> }
    ];

    if (isAdmin) {
      base.push({
        label: 'Admin dashboard',
        icon: <ShieldCheck className="size-4" />,
        element: <ToAdmin />
      });
    }

    return base;
  }, [isAdmin]);

  return <ConsoleShell pages={pages} />;
}
