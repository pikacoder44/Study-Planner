import { NextRequest, NextResponse } from "next/server";
import Exam from "@/models/Exam";
import { withAuth } from "@/lib/with-auth";
import { connectDB } from "@/lib/db"; // Ensure your DB connection helper is called

// Get all exams for the authenticated user
export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    await connectDB();
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
    await connectDB();
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const title = typeof body.title === "string" ? body.title : undefined;
    const examDate =
      typeof body.examDate === "string" ? body.examDate : undefined;
    const subjectName =
      typeof body.subjectName === "string" ? body.subjectName : "";
    const subjectId =
      typeof body.subjectId === "string" ? body.subjectId : undefined;
    const startTime = typeof body.startTime === "string" ? body.startTime : "";
    const endTime = typeof body.endTime === "string" ? body.endTime : "";
    const location = typeof body.location === "string" ? body.location : "";
    const description =
      typeof body.description === "string" ? body.description : "";

    const status =
      body.status === "upcoming" ||
      body.status === "completed" ||
      body.status === "cancelled"
        ? body.status
        : "upcoming";

    const priority =
      body.priority === "low" ||
      body.priority === "medium" ||
      body.priority === "high"
        ? body.priority
        : "medium";

    if (!title || !examDate) {
      return NextResponse.json(
        { error: "Title and date are required fields." },
        { status: 400 },
      );
    }

    const newExam = await Exam.create({
      userId,
      title,
      examDate: new Date(examDate),
      subjectName,
      subjectId,
      startTime,
      endTime,
      location,
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
