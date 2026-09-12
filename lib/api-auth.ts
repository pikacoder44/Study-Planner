import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function getAuthenticatedUserId(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(cookieToken || bearerToken || "");

  return payload?.userId ?? null;
}
