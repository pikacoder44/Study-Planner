import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getAuthenticatedUserId } from "@/lib/api-auth";

type Context = {
  params: Promise<{ taskId: string }>;
};

// PATCH route to mark a task as complete for authenticated user
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await async params (Next.js 15+)
    const { taskId } = await params;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: "A valid task ID is required." },
        { status: 400 },
      );
    }

    // Use findOneAndUpdate to avoid triggering pre-existing dueDate validation
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: { status: "completed" } },
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task marked as complete.", task: updatedTask },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking task as complete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}