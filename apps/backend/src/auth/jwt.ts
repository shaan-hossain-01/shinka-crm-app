import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signAccess(userId: string, username: string) {
  return jwt.sign({ sub: userId, username }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string; username: string; iat: number; exp: number };
}