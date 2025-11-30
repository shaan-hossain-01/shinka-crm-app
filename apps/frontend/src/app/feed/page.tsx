"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFeed } from "@/hooks/useFeed";
import Navbar from "@/components/layout/Navbar";
import NewPost from "@/components/posts/NewPost";
import PostCard from "@/components/posts/PostCard";

export default function Feed() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading, mutate } = useFeed();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <NewPost onPostCreated={() => mutate()} />
        <div className="mt-6 space-y-4">
          {loading && <p className="text-center text-muted-foreground">Loading posts...</p>}
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={() => mutate()} />
          ))}
          {!loading && posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No posts yet. Be the first to share something!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
