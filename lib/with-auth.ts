import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/api-auth";

type AuthenticatedHandler = (
  req: NextRequest,
  context: { userId: string },
) => Promise<NextResponse>;

type AuthenticatedRouteHandler<RouteContext> = (
  req: NextRequest,
  context: { userId: string },
  routeContext: RouteContext,
) => Promise<NextResponse>;

export function withAuth(
  handler: AuthenticatedHandler,
): (req: NextRequest) => Promise<NextResponse>;
export function withAuth<RouteContext>(
  handler: AuthenticatedRouteHandler<RouteContext>,
): (req: NextRequest, routeContext: RouteContext) => Promise<NextResponse>;
export function withAuth(
  handler: (
    req: NextRequest,
    context: { userId: string },
    routeContext?: unknown,
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, routeContext?: unknown) => {
    try {
      await connectDB();

      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing token" },
          { status: 401 },
        );
      }

      return await handler(req, { userId }, routeContext);
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
