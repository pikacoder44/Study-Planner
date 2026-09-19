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

    const subjectName =
      typeof body.subjectName === "string" ? body.subjectName : undefined;
    const subjectId =
      typeof body.subjectId === "string" ? body.subjectId : undefined;
    const title = typeof body.title === "string" ? body.title : undefined;
    const examDate =
      typeof body.examDate === "string" ? body.examDate : undefined;
    const description =
      typeof body.description === "string" ? body.description : undefined;
    const status =
      body.status === "upcoming" ||
      body.status === "completed" ||
      body.status === "cancelled"
        ? body.status
        : undefined;
    const priority =
      body.priority === "low" ||
      body.priority === "medium" ||
      body.priority === "high"
        ? body.priority
        : undefined;

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
      subjectId,
      title,
      examDate,
      description,
      status,
      priority,
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
