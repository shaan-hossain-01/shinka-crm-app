import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  about: z.string().optional(),
  photo: z.string().optional(),
  created: z.date(),
  updated: z.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  about: z.string().optional(),
  photo: z.string().optional(),
});

export const UserProfileSchema = UserSchema.extend({
  followersCount: z.number().default(0),
  followingCount: z.number().default(0),
  isFollowing: z.boolean().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
