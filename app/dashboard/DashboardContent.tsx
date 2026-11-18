'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import {
  Files,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

import ConsoleShell, { UnderConstruction } from '../../components/layout/ConsoleShell';
import LoadingScreen from '../../components/LoadingScreen';
import type { ConsolePage } from '../../components/SideMenu';

import ArticleContainer from '../../containers/article';
import MediaContainer from '../../containers/media';
import useAuth from '../../lib/hooks/Auth';

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
  const { userData } = useAuth();
  const isManager = Boolean(userData?.roles?.manager);

  const pages = useMemo<ConsolePage[]>(() => {
    const base: ConsolePage[] = [
      { label: 'Performance', icon: <TrendingUp className="size-4" />, element: <UnderConstruction pageName="Performance" /> },
      { label: 'Courses', icon: <LayoutDashboard className="size-4" />, element: <UnderConstruction pageName="Courses" /> },
      { label: 'Articles', icon: <Newspaper className="size-4" />, element: <ArticleContainer /> },
      { label: 'Resources', icon: <Files className="size-4" />, element: <MediaContainer /> },
      { label: 'Settings', icon: <Settings className="size-4" />, element: <UnderConstruction pageName="Settings" /> },
      { label: 'Logout', icon: <LogOut className="size-4" />, element: <Logout /> }
    ];

    if (isManager) {
      base.push({
        label: 'Admin dashboard',
        icon: <ShieldCheck className="size-4" />,
        element: <ToAdmin />
      });
    }

    return base;
  }, [isManager]);

  return <ConsoleShell pages={pages} />;
}
