import { NextResponse } from "next/server";
import Subject from "@/models/Subject";
import { withAuth } from "@/lib/with-auth";

// Create a new subject
export const POST = withAuth(async (req, { userId }) => {
  try {
    // Parse request body safely
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    const { name, code, color, description } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: "Subject name and code are required." },
        { status: 400 },
      );
    }

    // Check for existing subject with the same code for this user
    const existingSubject = await Subject.findOne({ userId, code });
    if (existingSubject) {
      return NextResponse.json(
        { error: "A subject with this code already exists." },
        { status: 409 },
      );
    }

    const subject = await Subject.create({
      userId,
      name,
      code,
      color,
      description,
    });

    return NextResponse.json(
      { message: "Subject created successfully", subject },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/subject:", error);

    // Handle Mongoose duplicate key error fallback
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "A subject with this code already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 },
    );
  }
});

// Fetch all subjects for authenticated user
export const GET = withAuth(async (req, { userId }) => {
  try {
    const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/subject:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subjects" },
      { status: 500 },
    );
  }
});
