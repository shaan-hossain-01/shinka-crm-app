"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { follow, unfollow } from "@/lib/api-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, Mail, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  about?: string;
  created: string;
  updated: string;
  followers?: any[];
  following?: any[];
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser, jwt } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState("");

  const username = params?.username as string;

  // Check if current user follows this profile user
  const checkFollow = (user: UserProfile) => {
    if (!jwt?.user?._id || !user.followers) return false;
    const match = user.followers.some((follower: any) => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, you'd fetch by username. For now, we'll use the current user
        const response = await api.get(`/api/users/${currentUser?._id}`);
        const userData = response.data;
        const isFollowing = checkFollow(userData);
        setUser(userData);
        setFollowing(isFollowing);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUser();
    }
  }, [currentUser, username]);

  const clickFollowButton = (callApi: any) => {
    if (!jwt?.user?._id || !user) return;

    callApi({ userId: jwt.user._id }, { t: jwt.token }, user._id).then(
      (data: any) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setUser(data);
          setFollowing(!following);
        }
      }
    );
  };

  const handleFollowToggle = () => {
    if (following) {
      clickFollowButton(unfollow);
    } else {
      clickFollowButton(follow);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;
  const photoUrl = user._id ? `/api/users/${user._id}/photo` : undefined;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={photoUrl} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>
          {isOwnProfile ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/user/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          ) : (
            <Button
              variant={following ? "outline" : "default"}
              size="sm"
              onClick={handleFollowToggle}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xl font-bold">{user.followers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{user.following?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
          {user.about && (
            <>
              <Separator />
              <div>
                <h2 className="text-sm font-semibold mb-2">About</h2>
                <p className="text-sm text-muted-foreground">{user.about}</p>
              </div>
            </>
          )}
          <Separator />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              Joined{" "}
              {formatDistanceToNow(new Date(user.created), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
