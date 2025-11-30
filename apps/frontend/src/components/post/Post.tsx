"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { remove } from "@/lib/api-post";

interface PostProps {
  post: {
    _id: string;
    text: string;
    photo?: string;
    photo_content_type?: string;
    created: string;
    postedBy: {
      _id: string;
      name: string;
    };
  };
  onRemove?: (post: any) => void;
}

export default function Post({ post, onRemove }: PostProps) {
  const { jwt } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const deletePost = () => {
    if (!jwt) return;

    setDeleting(true);
    remove({ postId: post._id }, { t: jwt.token }).then((data: any) => {
      if (data?.error) {
        console.error(data.error);
      } else {
        if (onRemove) {
          onRemove(post);
        }
      }
      setDeleting(false);
    });
  };

  const photoUrl = post.photo
    ? `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      }/api/posts/photo/${post._id}`
    : undefined;

  const isOwner = jwt?.user?._id === post.postedBy._id;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={`${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
              }/api/users/${post.postedBy._id}/photo`}
              alt={post.postedBy.name}
            />
            <AvatarFallback>
              {post.postedBy.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/profile/${post.postedBy.name}`}
              className="font-semibold hover:underline"
            >
              {post.postedBy.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={deletePost}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{post.text}</p>
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Post"
            className="w-full rounded-md object-cover max-h-96"
          />
        )}
      </CardContent>
    </Card>
  );
}
