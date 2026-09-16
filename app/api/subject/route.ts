import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getAuthenticatedUserId } from "@/lib/api-auth";

// Create a new subject
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body safely
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { name, code, color, description } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: "Subject name and code are required." },
        { status: 400 }
      );
    }

    // Check for existing subject with the same code for this user
    const existingSubject = await Subject.findOne({ userId, code });
    if (existingSubject) {
      return NextResponse.json(
        { error: "A subject with this code already exists." },
        { status: 409 }
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/subject:", error);

    // Handle Mongoose duplicate key error fallback
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A subject with this code already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}

// Fetch all subjects for authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/subject:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subjects" },
      { status: 500 }
    );
  }
}