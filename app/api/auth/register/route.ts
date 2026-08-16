import { NextResponse } from "next/server";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
export async function POST(request: Request) {
  try {
    // Extract userData from the incoming request body
    const userData = await request.json();

    const { username, password, confirmPassword } = userData;
    const validationErrors: string[] = [];

    if (!username || username.trim().length < 3) {
      validationErrors.push("Username must be at least 3 characters long.");
    }

    if (!password || password.trim().length < 8) {
      validationErrors.push("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match.");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Check if user already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { errors: ["Username already exists."] },
        { status: 400 },
      );
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "student", // Default role for new users
    });
    await newUser.save();

    // Generate a JWT token
    const token = signToken({
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role,
    });

    // return a success response
    const response = NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 },
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
    console.error("Error in POST /api/auth/register:", error);
    return NextResponse.json(
      { errors: "Internal Server Error" },
      { status: 500 },
    );
  }
}
