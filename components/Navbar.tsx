'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, User as UserIcon } from 'lucide-react';

import Logo from './brand/Logo';
import ThemeToggle from './theme/ThemeToggle';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';
import { cn } from '../lib/utils';

import useAuth from '../lib/hooks/Auth';
import { useNavigation } from '../lib/sanity/useNavigation';

export interface NavLink {
  href: string;
  label: string;
}

/** Marks the current section, including nested routes such as /blog/<id>. */
function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function NavLinks({
  links,
  pathname,
  onNavigate,
  orientation = 'horizontal'
}: {
  links: NavLink[];
  pathname: string;
  onNavigate?: () => void;
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <ul
      className={cn(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col' : 'items-center'
      )}
    >
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                active ? 'text-primary' : 'text-muted-foreground',
                orientation === 'vertical' && 'text-base'
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function AccountMenu() {
  const { user, userData, logout } = useAuth();

  if (!user) {
    return (
      <Button asChild size="lg">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const name =
    [userData?.first_name, userData?.last_name].filter(Boolean).join(' ') ||
    user.displayName ||
    'Account';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Account menu">
          <Avatar className="size-8">
            {userData?.profile_URL ? (
              <AvatarImage src={userData.profile_URL} alt="" />
            ) : null}
            <AvatarFallback>
              <UserIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.uid}`}>
            <UserIcon />
            {name}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname() ?? '/';
  const { headerLinks } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: NavLink[] = headerLinks ?? [];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 md:px-8">
        <Link href="/" aria-label="Charicha Institute, home" className="shrink-0">
          <Logo className="h-8 md:h-9" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks links={links} pathname={pathname} />
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="hidden lg:block">
            <AccountMenu />
          </div>

          {/*
            Keyed on the path so a route change remounts the sheet closed.
            Resetting it from an effect instead would set state during render
            and cascade an extra render on every navigation.
          */}
          <Sheet key={pathname} open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main" className="px-4">
                <NavLinks
                  links={links}
                  pathname={pathname}
                  orientation="vertical"
                  onNavigate={() => setMenuOpen(false)}
                />
              </nav>
              <div className="mt-auto border-t p-4">
                <SheetClose asChild>
                  <div>
                    <AccountMenu />
                  </div>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
