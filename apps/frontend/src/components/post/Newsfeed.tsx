"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NewPost from "./NewPost";
import PostList from "./PostList";
import { useAuth } from "@/hooks/useAuth";
import { listNewsFeed } from "@/lib/api-post";

export default function Newsfeed() {
  const { jwt } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (jwt?.user?._id) {
      listNewsFeed({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
        (data: any) => {
          if (data?.error) {
            console.error(data.error);
          } else {
            setPosts(data || []);
          }
          setLoading(false);
        }
      );
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [jwt]);

  const addPost = (post: any) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post: any) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.findIndex((p) => p._id === post._id);
    if (index !== -1) {
      updatedPosts.splice(index, 1);
      setPosts(updatedPosts);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Newsfeed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <NewPost addUpdate={addPost} />
          <Separator />
          {posts.length > 0 ? (
            <PostList removeUpdate={removePost} posts={posts} />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No posts yet. Follow people or create your first post!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
