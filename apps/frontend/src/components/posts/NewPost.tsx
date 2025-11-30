"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface NewPostProps {
  onPostCreated: () => void;
}

export default function NewPost({ onPostCreated }: NewPostProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await api.post("/api/posts", { text });
      setText("");
      onPostCreated();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {text.length}/500
            </span>
            <Button type="submit" disabled={loading || !text.trim()}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
