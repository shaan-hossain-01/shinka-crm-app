"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Image, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { create } from "@/lib/api-post";

interface NewPostProps {
  addUpdate: (post: any) => void;
}

export default function NewPost({ addUpdate }: NewPostProps) {
  const { jwt } = useAuth();
  const [values, setValues] = useState({
    text: "",
    photo: null as File | null,
    photoPreview: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ ...values, text: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValues({
        ...values,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const removePhoto = () => {
    setValues({ ...values, photo: null, photoPreview: "" });
  };

  const clickPost = () => {
    if (!jwt || !values.text.trim()) {
      setValues({ ...values, error: "Text is required" });
      return;
    }

    const postData = new FormData();
    postData.append("text", values.text);
    if (values.photo) {
      postData.append("photo", values.photo);
    }

    setLoading(true);
    create({ userId: jwt.user._id }, { t: jwt.token }, postData).then(
      (data: any) => {
        if (data?.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ text: "", photo: null, photoPreview: "", error: "" });
          addUpdate(data);
        }
        setLoading(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={values.text}
          onChange={handleChange}
          rows={3}
          className="resize-none"
        />

        {values.photoPreview && (
          <div className="relative">
            <img
              src={values.photoPreview}
              alt="Preview"
              className="w-full rounded-md object-cover max-h-64"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removePhoto}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {values.error && (
          <p className="text-sm text-destructive">{values.error}</p>
        )}

        <div className="flex items-center justify-between">
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Image className="h-4 w-4 mr-2" />
                Add Photo
              </span>
            </Button>
          </label>

          <Button onClick={clickPost} disabled={loading || !values.text.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
