import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const TokenPayloadSchema = z.object({
  _id: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
