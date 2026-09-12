import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/jwt";

// Helper function to authenticate requests
async function authenticateUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return null;

  const decoded = verifyToken(token) as { id: string } | null;
  return decoded?.id || null;
}

// POST route to create a new task
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await authenticateUser(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, subject, taskType, dueDate, priority } = body;

    if (
      !title ||
      !description ||
      !subject ||
      !taskType ||
      !dueDate ||
      !priority
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const savedTask = await Task.create({
      userId,
      title,
      description,
      subject,
      taskType,
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

    const userId = await authenticateUser(req);
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
