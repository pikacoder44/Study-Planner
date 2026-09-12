import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import Task from "@/models/Task";

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

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId } = body;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: "A valid task ID is required." },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};
    for (const field of editableFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No task fields were provided." },
        { status: 400 },
      );
    }

    for (const field of [
      "title",
      "description",
      "subjectId",
      "type",
      "priority",
    ] as const) {
      if (field in updates && typeof updates[field] !== "string") {
        return NextResponse.json(
          { error: `${field} must be a string.` },
          { status: 400 },
        );
      }
    }

    if ("dueDate" in updates) {
      if (!isValidDateOnly(updates.dueDate)) {
        return NextResponse.json(
          { error: "Due date must be a valid date." },
          { status: 400 },
        );
      }

      if (updates.dueDate < new Date().toISOString().slice(0, 10)) {
        return NextResponse.json(
          { error: "Due date cannot be in the past." },
          { status: 400 },
        );
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
