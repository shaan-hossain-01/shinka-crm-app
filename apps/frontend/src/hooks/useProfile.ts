import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { UserProfile } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useProfile(username: string | undefined) {
  const { data, error, mutate } = useSWR<UserProfile>(
    username ? `${API_URL}/api/users/profile/${username}` : null,
    fetcher
  );

  return {
    profile: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
