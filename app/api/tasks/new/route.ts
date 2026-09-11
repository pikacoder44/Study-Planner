import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id: string } | null;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
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
        { status: 400 }
      );
    }

    const savedTask = await Task.create({
      userId: decoded.id,
      title,
      description,
      subject,
      taskType,
      dueDate,
      priority,
      status: "pending",
      createdAt: new Date(),
      uploadedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Task created successfully", task: savedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}