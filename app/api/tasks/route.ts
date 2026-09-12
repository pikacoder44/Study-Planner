import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getAuthenticatedUserId } from "@/lib/api-auth";

function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function getTodayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

// POST route to create a new task
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, subjectId, type, dueDate, priority } = body;

    if (
      !title ||
      !description ||
      !subjectId ||
      !type ||
      !dueDate ||
      !priority
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!isValidDateOnly(dueDate)) {
      return NextResponse.json(
        { error: "Due date must be a valid date." },
        { status: 400 },
      );
    }

    if (dueDate < getTodayDateOnly()) {
      return NextResponse.json(
        { error: "Due date cannot be in the past." },
        { status: 400 },
      );
    }

    const savedTask = await Task.create({
      userId,
      title,
      description,
      subjectId,
      type,
      dueDate,
      priority,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Task created successfully", task: savedTask },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
// Get route to fetch tasks
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIXED: Only fetch tasks belonging to the authenticated user
    const tasks = await Task.find({ userId });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
