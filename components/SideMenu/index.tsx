'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen, User as UserIcon } from 'lucide-react';

import Logo from '../brand/Logo';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import useAuth from '../../lib/hooks/Auth';

export interface ConsolePage {
  label: string;
  icon?: ReactNode;
  element?: ReactNode;
}

export default function SideMenu({
  pages,
  setPage,
  currentPage
}: {
  pages: ConsolePage[];
  setPage: (index: number) => void;
  currentPage: number;
}) {
  const { userData, fetching } = useAuth();
  const [open, setOpen] = useState(true);

  const name = [userData?.first_name, userData?.last_name].filter(Boolean).join(' ');

  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col gap-4 overflow-y-auto border-r bg-card py-4 transition-all',
        open ? 'w-72' : 'w-16'
      )}
    >
      <div className={cn('flex items-center px-3', open ? 'justify-between' : 'justify-center')}>
        {open ? <Logo className="h-7" /> : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Collapse menu' : 'Expand menu'}
          aria-expanded={open}
        >
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>

      {open ? (
        <div className="flex flex-col items-center gap-2 border-b px-3 pb-4">
          {fetching ? (
            <Skeleton shape="circle" className="size-20" />
          ) : (
            <Image
              src={userData?.profile_URL || '/profile.jpg'}
              alt=""
              width={80}
              height={80}
              className="size-20 rounded-full border-2 border-primary object-cover"
            />
          )}
          {fetching ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <p className="text-sm font-medium text-card-foreground">{name || 'Student'}</p>
          )}
        </div>
      ) : null}

      {/*
        Real <button>s in a list. These were <li onClick> before, so the menu
        could not be reached or operated from the keyboard at all.
      */}
      <nav aria-label="Console">
        <ul className="flex flex-col gap-1 px-2">
          {pages.map((page, index) => (
            <li key={page.label}>
              <button
                type="button"
                onClick={() => setPage(index)}
                aria-current={currentPage === index ? 'page' : undefined}
                title={open ? undefined : page.label}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                  open ? 'justify-start' : 'justify-center',
                  currentPage === index
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="shrink-0" aria-hidden>
                  {page.icon ?? <UserIcon className="size-4" />}
                </span>
                {open ? <span className="truncate">{page.label}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
