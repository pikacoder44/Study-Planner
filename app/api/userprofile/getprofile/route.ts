import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
export async function GET(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Extract the token from the cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { errors: ["No token provided."] },
        { status: 401 },
      );
    }

    // Verify the token and extract the payload
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { errors: ["Invalid or expired token."] },
        { status: 401 },
      );
    }

    // Find the user in the database using the userId from the token payload
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { errors: ["User not found."] },
        { status: 404 },
      );
    }

    // Return the user profile
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/userprofile:", error);
    return NextResponse.json(
      { errors: "Internal Server Error" },
      { status: 500 },
    );
  }
}
