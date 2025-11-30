import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { PostWithAuthor } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useFeed() {
  const { data, error, mutate } = useSWR<PostWithAuthor[]>(
    `${API_URL}/api/posts/feed`,
    fetcher
  );

  return {
    posts: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
