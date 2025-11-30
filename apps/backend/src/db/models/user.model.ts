import { eq } from "drizzle-orm";
import db from "../client";
import { users, type User, type NewUser } from "../schema/users";
import { encryptPassword, makeSalt, authenticate } from "../../auth/hash";
import {
  upsertUserProfile,
  findUserProfileByUserId,
} from "./userProfile.model";

export class UserValidationError extends Error {
  public errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super("User validation failed");
    this.name = "UserValidationError";
    this.errors = errors;
  }
}

/**
 * Validate password:
 * - Password is required for new users
 * - Password must be at least 6 characters
 */
function validatePassword(
  password: string | undefined,
  isNew: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (isNew && !password) {
    errors.password = "Password is required";
  }

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export interface UserWithPassword
  extends Omit<NewUser, "hashed_password" | "salt"> {
  password: string;
  about?: string;
  photo?: string | null;
  photoContentType?: string | null;
}

export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Create a new user with encrypted password
 * The password is handled as a virtual field - it's not stored directly
 * Instead, we generate a salt and hashed_password
 * @throws {UserValidationError} If password validation fails
 */
export async function createUser(userData: UserWithPassword): Promise<User> {
  // Validate password (isNew = true)
  const validationErrors = validatePassword(userData.password, true);
  if (Object.keys(validationErrors).length > 0) {
    throw new UserValidationError(validationErrors);
  }

  const salt = makeSalt();
  const hashedPassword = encryptPassword(userData.password, salt);

  const [newUser] = await db
    .insert(users)
    .values({
      name: userData.name,
      email: userData.email,
      hashed_password: hashedPassword,
      salt: salt,
      created: new Date(),
      updated: new Date(),
    })
    .returning();

  return newUser;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

/**
 * Find user by email
 */
export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}

/**
 * Update user information
 * If password is provided, it will be encrypted with a new salt
 * @throws {UserValidationError} If password validation fails
 */
export async function updateUser(
  id: string,
  updates: Partial<UserWithPassword>,
): Promise<User | undefined> {
  // Validate password if it's being updated (isNew = false)
  if (updates.password) {
    const validationErrors = validatePassword(updates.password, false);
    if (Object.keys(validationErrors).length > 0) {
      throw new UserValidationError(validationErrors);
    }
  }

  const updateData: any = {
    updated: new Date(),
  };

  if (updates.name) updateData.name = updates.name;
  if (updates.email) updateData.email = updates.email;

  // Handle password update with new salt and hash
  if (updates.password) {
    updateData.salt = makeSalt();
    updateData.hashed_password = encryptPassword(
      updates.password,
      updateData.salt,
    );
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning();

  // Update or create user profile if about or photo data is provided
  if (
    updates.about !== undefined ||
    updates.photo !== undefined ||
    updates.photoContentType !== undefined
  ) {
    await upsertUserProfile(id, {
      about: updates.about,
      photo: updates.photo,
      photo_content_type: updates.photoContentType,
    });
  }

  return updatedUser;
}

/**
 * Delete user by ID
 */
export async function deleteUser(id: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result.length > 0;
}

/**
 * Authenticate user - verify sign-in attempts
 * Matches the user-provided password with the stored hashed_password
 */
export async function authenticateUser(
  credentials: UserCredentials,
): Promise<User | null> {
  const user = await findUserByEmail(credentials.email);

  if (!user) {
    return null;
  }

  const isValid = authenticate(
    credentials.password,
    user.hashed_password,
    user.salt,
  );

  return isValid ? user : null;
}

/**
 * List all users (useful for admin purposes)
 */
export async function listUsers(): Promise<User[]> {
  return db.select().from(users);
}
