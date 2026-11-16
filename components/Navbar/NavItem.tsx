'use client';

import Link from "next/link";

export default function NavItem({ path, to, label }: { path?: string; to: string; label: React.ReactNode }){
  return (
    <Link
      href={to}
      className={`text-white hover:text-brightaqua px-6 duration-300 ${path === to ? 'text-white border-b-2' : ''}`}
    >
      { label }
    </Link>
  );
}
