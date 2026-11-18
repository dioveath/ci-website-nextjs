'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import useAuth from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import { listUsers, setAdmin } from './actions';
import { errorMessage, unwrap } from '@/lib/actions/result';
import type { AdminUserRow } from '@/types/courses';

export default function UserManagementContainer() {
  const { user, getIdToken, refreshClaims } = useAuth();
  const [filter, setFilter] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => unwrap(await listUsers((await getIdToken()) ?? '')),
    enabled: !!user,
  });

  const toggleAdmin = useMutation({
    mutationFn: async (row: AdminUserRow) =>
      unwrap(await setAdmin((await getIdToken()) ?? '', { uid: row.uid, grant: !row.isAdmin })),
    onSuccess: async (_data, row) => {
      if (row.uid === user?.uid) await refreshClaims();
      await queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
  });

  const needle = filter.trim().toLowerCase();
  const visible = (users ?? []).filter(
    (row) => !needle || row.name.toLowerCase().includes(needle) || row.email?.toLowerCase().includes(needle)
  );

  return (
    <div className="text-foreground text-sm flex flex-col gap-4">
      <div className="px-4">
        <p className="uppercase font-light text-3xl">Users</p>
        <p className="font-light">{users ? `${users.length} accounts` : ' '}</p>
      </div>

      <div className="max-w-lg rounded-r-full bg-primary text-primary-foreground py-2 px-4">
        <p className="text-xl font-light">User Management</p>
      </div>

      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Search by name or email"
        className="max-w-sm bg-background text-foreground border border-input rounded-lg px-3 py-2 outline-none focus:border-ring"
      />

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-destructive">{errorMessage(error)}</p>}
      {toggleAdmin.error && <p className="text-destructive">{errorMessage(toggleAdmin.error)}</p>}

      {users && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse">
            <thead>
              <tr className="bg-muted text-left text-foreground">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.uid} className="bg-card text-card-foreground border-b border-border">
                  <td className="px-4 py-2">
                    <a href={`/profile/${row.uid}`} className="hover:text-primary">{row.name}</a>
                  </td>
                  <td className="px-4 py-2">{row.email ?? '—'}</td>
                  <td className="px-4 py-2">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      disabled={toggleAdmin.isPending || (row.uid === user?.uid && row.isAdmin)}
                      title={row.uid === user?.uid ? 'You cannot remove your own admin role' : undefined}
                      onClick={() => toggleAdmin.mutate(row)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-50 ${
                        row.isAdmin ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'bg-muted text-foreground hover:bg-accent'
                      }`}
                    >
                      {row.isAdmin ? 'Admin ✓' : 'Make admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
