import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/api-auth";

// Signature for handlers with or without dynamic route params
type AuthenticatedHandler<T = Record<string, unknown>> = (
  req: NextRequest,
  context: T & { userId: string }
) => Promise<NextResponse>;

export function withAuth<T = Record<string, unknown>>(
  handler: AuthenticatedHandler<T>
) {
  return async (req: NextRequest, routeContext?: T) => {
    try {
      await connectDB();

      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing token" },
          { status: 401 }
        );
      }

      // Merge userId into standard Next.js routeContext
      const mergedContext = {
        ...(routeContext as T),
        userId,
      };

      return await handler(req, mergedContext);
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}