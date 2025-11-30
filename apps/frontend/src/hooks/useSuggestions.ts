import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { UserProfile } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useSuggestions() {
  const { data, error, mutate } = useSWR<UserProfile[]>(
    `${API_URL}/api/users/suggestions`,
    fetcher
  );

  return {
    suggestions: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
