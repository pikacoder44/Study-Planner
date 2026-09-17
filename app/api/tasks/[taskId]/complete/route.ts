import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task";
import { withAuth } from "@/lib/with-auth";

type Context = {
  params: Promise<{ taskId: string }>;
};

// PATCH route to mark a task as complete for authenticated user
export const PATCH = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
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
  },
);
