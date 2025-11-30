import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string(),
  text: z.string(),
  postId: z.string(),
  postedBy: z.string(),
  created: z.date(),
  updated: z.date(),
});

export const CreateCommentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(300),
  postId: z.string(),
});

export const CommentWithAuthorSchema = CommentSchema.extend({
  author: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string().optional(),
  }),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;
