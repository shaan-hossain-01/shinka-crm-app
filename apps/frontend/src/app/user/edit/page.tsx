"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    photo: null as File | null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?._id) {
        try {
          const response = await api.get(`/api/users/${user._id}`);
          setValues({
            name: response.data.name || "",
            email: response.data.email || "",
            password: "",
            about: response.data.about || "",
            photo: null,
          });
          
          // Set existing photo preview
          const photoUrl = `/api/users/${user._id}/photo`;
          setPhotoPreview(photoUrl);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (name === "photo" && event.target instanceof HTMLInputElement && event.target.files) {
      const file = event.target.files[0];
      setValues({ ...values, photo: file });
      
      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (values.name) formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.password) formData.append("password", values.password);
      if (values.about) formData.append("about", values.about);
      if (values.photo) formData.append("photo", values.photo);

      const token = localStorage.getItem("jwt");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/users/${user?._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      router.push(`/profile/${user?.name}`);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information and photo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoPreview || undefined} alt={values.name} />
                <AvatarFallback className="text-2xl">
                  {values.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleChange("photo")}
                  style={{ display: "none" }}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button variant="outline" size="sm" type="button" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </label>
                {values.photo && (
                  <span className="text-sm text-muted-foreground">
                    {values.photo.name}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={values.about}
                onChange={handleChange("about")}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (leave blank to keep current)</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange("password")}
                minLength={6}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
