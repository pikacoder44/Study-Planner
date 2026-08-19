import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    // Extract userData from the incoming request body
    const userData = await request.json();
    const { username, password } = userData;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { errors: ["User not found."] },
        { status: 401 },
      );
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { errors: ["Invalid username or password."] },
        { status: 401 },
      );
    }

    // Generate a JWT token with the minimal auth claims needed for authorization.
    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    // If the credentials are valid, return a success response
    const response = NextResponse.json(
      { message: "Login successful!" },
      { status: 200 },
    );

    // Set token in cookies
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/", // Cookie is accessible throughout the site
    });
    return response;
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json(
      { errors: ["Internal Server Error"] },
      { status: 500 },
    );
  }
}
