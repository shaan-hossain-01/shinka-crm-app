import { eq } from "drizzle-orm";
import db from "../client";
import {
  userProfiles,
  type UserProfile,
  type NewUserProfile,
} from "../schema/userProfiles";

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  profileData: Partial<NewUserProfile>,
): Promise<UserProfile> {
  const existing = await findUserProfileByUserId(userId);

  if (existing) {
    const [updated] = await db
      .update(userProfiles)
      .set({
        ...profileData,
        updated: new Date(),
      })
      .where(eq(userProfiles.user_id, userId))
      .returning();
    return updated;
  } else {
    const [newProfile] = await db
      .insert(userProfiles)
      .values({
        user_id: userId,
        ...profileData,
        created: new Date(),
        updated: new Date(),
      })
      .returning();
    return newProfile;
  }
}

/**
 * Find user profile by user ID
 */
export async function findUserProfileByUserId(
  userId: string,
): Promise<UserProfile | undefined> {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.user_id, userId))
    .limit(1);
  return profile;
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(userId: string): Promise<boolean> {
  const result = await db
    .delete(userProfiles)
    .where(eq(userProfiles.user_id, userId))
    .returning();
  return result.length > 0;
}
