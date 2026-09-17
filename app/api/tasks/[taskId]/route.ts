import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withAuth } from "@/lib/with-auth";
import Task from "@/models/Task";

type Context = {
  params: Promise<{ taskId: string }>;
};

const editableFields = [
  "title",
  "description",
  "subjectId",
  "type",
  "dueDate",
  "priority",
] as const;

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

// Get a task by ID for authenticated user
export const GET = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { taskId } = await params;

      if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return NextResponse.json(
          { error: "A valid task ID is required." },
          { status: 400 },
        );
      }

      const task = await Task.findOne({ _id: taskId, userId });
      if (!task) {
        return NextResponse.json({ error: "Task not found." }, { status: 404 });
      }

      return NextResponse.json({ task });
    } catch (error) {
      console.error("Error fetching task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);

// Update a task by ID for authenticated user
export const PUT = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { taskId } = await params;
      if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return NextResponse.json(
          { error: "Missing or invalid taskId parameter" },
          { status: 400 },
        );
      }
      let body: Record<string, unknown>;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        );
      }

      // Extract only defined allowed fields
      const safeUpdates: Record<string, unknown> = {};
      for (const field of editableFields) {
        if (body[field] !== undefined) {
          if (field === "dueDate" && body.dueDate !== null) {
            if (!isValidDateOnly(body.dueDate)) {
              return NextResponse.json(
                { error: "dueDate must be formatted as YYYY-MM-DD." },
                { status: 400 },
              );
            }
          }
          safeUpdates[field] = body[field];
        }
      }
      // If no valid fields are provided for update, return an error
      if (Object.keys(safeUpdates).length === 0) {
        return NextResponse.json(
          { error: "No valid fields provided for update." },
          { status: 400 },
        );
      }

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { $set: safeUpdates },
        { new: true, runValidators: true },
      );
      if (!updatedTask) {
        return NextResponse.json({ error: "Task not found." }, { status: 404 });
      }

      return NextResponse.json({
        message: "Task updated successfully",
        task: updatedTask,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);

// Delete a task by ID for authenticated user
export const DELETE = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { taskId } = await params;
      if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return NextResponse.json(
          { error: "A valid task ID is required." },
          { status: 400 },
        );
      }

      // Delete task only if it belongs to the authenticated user
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

      if (!deletedTask) {
        return NextResponse.json({ error: "Task not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Task deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);
