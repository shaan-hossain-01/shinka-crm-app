import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  text: z.string(),
  photo: z.string().optional(),
  postedBy: z.string(),
  created: z.date(),
  updated: z.date(),
});

export const CreatePostSchema = z.object({
  text: z.string().min(1, 'Post content is required').max(500),
  photo: z.string().optional(),
});

export const UpdatePostSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  photo: z.string().optional(),
});

export const PostWithAuthorSchema = PostSchema.extend({
  author: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string().optional(),
  }),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  isLiked: z.boolean().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;
