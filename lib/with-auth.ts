import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/api-auth";

type AuthenticatedHandler = (
  req: NextRequest,
  context: { userId: string }
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    try {
      await connectDB();

      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing token" },
          { status: 401 }
        );
      }

      return await handler(req, { userId });
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}