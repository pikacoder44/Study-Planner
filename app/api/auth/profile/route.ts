import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUserId } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/userprofile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const ALLOWED_FIELDS = ["username", "password"];

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const safeUpdates: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        safeUpdates[field] = body[field];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    // Hash the password if included in update payload
    if (typeof safeUpdates.password === "string") {
      const salt = await bcrypt.genSalt(10);
      safeUpdates.password = await bcrypt.hash(safeUpdates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Handle Mongoose duplicate key error (e.g., username already taken)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user profile." },
      { status: 500 }
    );
  }
}