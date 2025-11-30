import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { PostWithAuthor } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function usePost(postId: string | undefined) {
  const { data, error, mutate } = useSWR<PostWithAuthor>(
    postId ? `${API_URL}/api/posts/${postId}` : null,
    fetcher
  );

  return {
    post: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
