import { eq, and } from "drizzle-orm";
import db from "../client";
import {
  userFollow,
  type UserFollow,
  type NewUserFollow,
} from "../schema/userFollow";

/**
 * Add a follow relationship
 */
export async function addFollow(
  followerId: string,
  followedId: string,
): Promise<UserFollow> {
  const [follow] = await db
    .insert(userFollow)
    .values({
      follower_id: followerId,
      followed_id: followedId,
      created: new Date(),
    })
    .returning();
  return follow;
}

/**
 * Remove a follow relationship
 */
export async function removeFollow(
  followerId: string,
  followedId: string,
): Promise<boolean> {
  const result = await db
    .delete(userFollow)
    .where(
      and(
        eq(userFollow.follower_id, followerId),
        eq(userFollow.followed_id, followedId),
      ),
    )
    .returning();
  return result.length > 0;
}

/**
 * Get all users that a user is following
 */
export async function getFollowing(userId: string) {
  const following = await db
    .select({
      id: userFollow.followed_id,
    })
    .from(userFollow)
    .where(eq(userFollow.follower_id, userId));
  return following.map((f) => f.id);
}

/**
 * Get all followers of a user
 */
export async function getFollowers(userId: string) {
  const followers = await db
    .select({
      id: userFollow.follower_id,
    })
    .from(userFollow)
    .where(eq(userFollow.followed_id, userId));
  return followers.map((f) => f.id);
}

/**
 * Check if user1 follows user2
 */
export async function isFollowing(
  followerId: string,
  followedId: string,
): Promise<boolean> {
  const [result] = await db
    .select()
    .from(userFollow)
    .where(
      and(
        eq(userFollow.follower_id, followerId),
        eq(userFollow.followed_id, followedId),
      ),
    )
    .limit(1);
  return !!result;
}

/**
 * Get follow counts for a user
 */
export async function getFollowCounts(userId: string) {
  const followingCount = await db
    .select()
    .from(userFollow)
    .where(eq(userFollow.follower_id, userId));

  const followersCount = await db
    .select()
    .from(userFollow)
    .where(eq(userFollow.followed_id, userId));

  return {
    following: followingCount.length,
    followers: followersCount.length,
  };
}
