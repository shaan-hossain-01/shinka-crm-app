"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onUpdate: () => void;
}

export default function PostActions({
  postId,
  likesCount,
  commentsCount,
  isLiked,
  onUpdate,
}: PostActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      if (isLiked) {
        await api.delete(`/api/posts/${postId}/unlike`);
      } else {
        await api.post(`/api/posts/${postId}/like`);
      }
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
        <span className="text-sm">{likesCount}</span>
      </Button>

      <Button variant="ghost" size="sm" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm">{commentsCount}</span>
      </Button>
    </div>
  );
}
