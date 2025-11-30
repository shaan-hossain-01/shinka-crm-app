"use client";

import Post from "./Post";

interface PostListProps {
  posts: any[];
  removeUpdate: (post: any) => void;
}

export default function PostList({ posts, removeUpdate }: PostListProps) {
  return (
    <div className="mt-6 space-y-4">
      {posts.map((item, i) => (
        <Post post={item} key={i} onRemove={removeUpdate} />
      ))}
    </div>
  );
}
