import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/api-auth";

// Dynamic route params remain separate from the authenticated user context.
type AuthenticatedHandler<T = Record<string, unknown>> = (
  req: NextRequest,
  authContext: { userId: string },
  routeContext: T,
) => Promise<NextResponse>;

export function withAuth<T = Record<string, unknown>>(
  handler: AuthenticatedHandler<T>,
) {
  return async (req: NextRequest, routeContext?: T) => {
    try {
      await connectDB();

      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing token" },
          { status: 401 },
        );
      }

      return await handler(req, { userId }, routeContext as T);
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
