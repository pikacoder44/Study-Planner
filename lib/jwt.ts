import jwt from "jsonwebtoken";

export type UserRole = "student" | "teacher";

// Get the secret key from environment variables (.env.local)
const JWT_SECRET =
  process.env.JWT_SECRET || "your_fallback_secret_key_change_me";

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
}

// Generates a signed JWT token valid for 7 days
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verifies an incoming JWT token. Returns the payload or null if invalid.
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
