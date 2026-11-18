'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BookOpen,
  Files,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  UserCog,
  Users
} from 'lucide-react';

import ConsoleShell, { UnderConstruction } from '@/components/layout/ConsoleShell';
import LoadingScreen from '@/components/LoadingScreen';
import type { ConsolePage } from '@/components/SideMenu';
import useAuth from '@/lib/auth';

import ArticleManagementContainer from './ArticleManagement';
import CourseManagementContainer from './CourseManagement';
import UserManagementContainer from './UserManagement';

function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <LoadingScreen label="Signing you out" />;
}

function ToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  return <LoadingScreen label="Opening your dashboard" />;
}

const PAGES: ConsolePage[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="size-4" />, element: <UnderConstruction pageName="Dashboard" /> },
  { label: 'Manage courses', icon: <BookOpen className="size-4" />, element: <CourseManagementContainer /> },
  { label: 'Manage articles', icon: <Newspaper className="size-4" />, element: <ArticleManagementContainer /> },
  { label: 'Manage resources', icon: <Files className="size-4" />, element: <UnderConstruction pageName="Manage resources" /> },
  { label: 'Manage users', icon: <Users className="size-4" />, element: <UserManagementContainer /> },
  { label: 'Settings', icon: <Settings className="size-4" />, element: <UnderConstruction pageName="Settings" /> },
  { label: 'User dashboard', icon: <UserCog className="size-4" />, element: <ToDashboard /> },
  { label: 'Logout', icon: <LogOut className="size-4" />, element: <Logout /> }
];

export default function AdminContent() {
  // Signed in but not an admin: send them to their own dashboard. The
  // signed-out case is handled by ConsoleShell for every console route.
  // isAdmin comes from the server-set `admin` custom claim (never from the
  // user-writable profile); every admin server action re-checks it.
  return (
    <ConsoleShell
      pages={PAGES}
      guard={(auth) => (auth.isAdmin ? null : '/dashboard')}
    />
  );
}
