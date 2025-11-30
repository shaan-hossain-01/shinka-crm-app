import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function signAccess(userId: string, username: string) {
  // Using simpler signature without expiresIn for now
  return jwt.sign({ sub: userId, username }, env.JWT_SECRET);
}

export function verifyAccess(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as {
    sub: string;
    username: string;
    iat: number;
    exp: number;
  };
}
