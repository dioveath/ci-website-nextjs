'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import queryClient from '@/lib/queryClient';
import useAuth from '@/lib/auth';
import { addMedia, getUser, removeMedia } from '@/lib/users';
import type { Media } from '@/types';

/** The signed-in user's uploaded media, shared by the media page and the picker modal. */
export default function useMedia() {
  const { isLoggedIn, userData } = useAuth();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['medias'] });

  const { data: medias, isFetching, isLoading } = useQuery({
    queryKey: ['medias'],
    queryFn: async () => (await getUser(userData!.id))?.medias ?? [],
    enabled: isLoggedIn,
  });

  const upload = useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      addMedia(userData!.id, file, onProgress),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (media: Media) => removeMedia(userData!.id, media),
    onSuccess: invalidate,
  });

  return { medias, isFetching, isLoading, upload, remove };
}
