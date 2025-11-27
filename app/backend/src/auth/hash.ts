import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, env.BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/**
 * Generate a unique random salt value
 * @returns A unique salt string
 */
export function makeSalt(): string {
  return Math.round(new Date().valueOf() * Math.random()) + '';
}

/**
 * Encrypt password using crypto HMAC with SHA1
 * @param password - Plain text password
 * @param salt - Unique salt value
 * @returns Encrypted password hash
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
}

/**
 * Authenticate user by comparing plain text password with hashed password
 * @param plainText - Plain text password to verify
 * @param hashedPassword - Stored hashed password
 * @param salt - Salt used to create the hash
 * @returns True if passwords match
 */
export function authenticate(plainText: string, hashedPassword: string, salt: string): boolean {
  return encryptPassword(plainText, salt) === hashedPassword;
}