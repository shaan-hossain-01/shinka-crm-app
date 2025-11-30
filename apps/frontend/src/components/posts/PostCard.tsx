"use client";

import { formatDistanceToNow } from "date-fns";
import type { PostWithAuthor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostActions from "./PostActions";

interface PostCardProps {
  post: PostWithAuthor;
  onUpdate: () => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={post.author.photo} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{post.author.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-2 text-foreground">{post.text}</p>
            </div>

            {post.photo && (
              <img
                src={post.photo}
                alt="Post"
                className="rounded-lg max-w-full"
              />
            )}

            <PostActions
              postId={post.id}
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              isLiked={post.isLiked || false}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
