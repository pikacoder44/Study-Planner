import { NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (request, { userId }) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/userprofile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});

const ALLOWED_FIELDS = ["username"];

export const PATCH = withAuth(async (request, { userId }) => {
  try {
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
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Handle Mongoose duplicate key error (e.g., username already taken)
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update user profile." },
      { status: 500 },
    );
  }
});

export const PUT = PATCH;
