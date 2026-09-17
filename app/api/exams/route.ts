import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/Exam";
import { withAuth } from "@/lib/with-auth";

// Get all exams for the authenticated user
export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Filter exams by the authenticated user's ID
    const exams = await Exam.find({ userId }).sort({ examDate: 1 });
    return NextResponse.json(exams, { status: 200 });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams." },
      { status: 500 },
    );
  }
});

// Create a new exam attached to the authenticated user
export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const { subjectName, title, examDate, description } = body;

    if (!title || !examDate) {
      return NextResponse.json(
        { error: "Title and date are required fields." },
        { status: 400 },
      );
    }

    // Attach userId to ensure ownership
    const newExam = await Exam.create({
      userId,
      subjectName,
      title,
      examDate,
      description,
    });

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "Failed to create exam." },
      { status: 500 },
    );
  }
});
