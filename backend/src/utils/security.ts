import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Precomputed bcrypt hash used to neutralize timing attacks when email lookup fails
const DUMMY_BCRYPT_HASH = '$2a$12$e8f.P3s1aK6nK9y9dJ4mU.lV5qgG8P7O4n4Q9z1c7e9R8p0w2v1t2';

/**
 * Generate cryptographically secure random token (256 bits of entropy)
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Compute SHA-256 hash of a plaintext token for zero-knowledge storage in database
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Hash password with bcrypt work factor of 12
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Constant-time dummy comparison to prevent user enumeration via response timing differences
 */
export async function performDummyBcryptCompare(password: string): Promise<void> {
  await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
}

/**
 * Sanitize and normalize email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Generate cryptographically secure numeric OTP (e.g. 6-digit code)
 */
export function generateNumericOtp(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}
