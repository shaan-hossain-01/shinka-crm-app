import { z } from 'zod';

export const FollowSchema = z.object({
  followerId: z.string(),
  followingId: z.string(),
  createdAt: z.date(),
});

export const FollowActionSchema = z.object({
  userId: z.string(),
});

export type Follow = z.infer<typeof FollowSchema>;
export type FollowAction = z.infer<typeof FollowActionSchema>;
