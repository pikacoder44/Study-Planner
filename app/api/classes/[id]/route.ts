import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ClassModel from "@/models/Class";
import { withAuth } from "@/lib/with-auth";

type Context = {
  params: Promise<{ id: string }>;
};

export const GET = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid class ID is required" },
          { status: 400 },
        );
      }

      const classData = await ClassModel.findOne({ _id: id, userId });
      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }

      return NextResponse.json(classData, { status: 200 });
    } catch (error) {
      console.error("Error fetching class:", error);
      return NextResponse.json(
        { error: "Failed to fetch class" },
        { status: 500 },
      );
    }
  },
);

// DELETE a class
export const DELETE = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid class ID is required." },
          { status: 400 },
        );
      }

      const classData = await ClassModel.findOneAndDelete({ _id: id, userId });
      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Class deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting class:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);

// Update a single class
export const PATCH = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid class ID is required." },
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

      // Filter and validate allowed update fields
      const updateData: Record<string, unknown> = {};
      const allowedFields = [
        "subjectId",
        "title",
        "dayOfWeek",
        "startTime",
        "endTime",
        "room",
        "isActive",
      ];

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }

      // Validate subjectId if it is being updated
      if (
        updateData.subjectId &&
        typeof updateData.subjectId === "string" &&
        !mongoose.Types.ObjectId.isValid(updateData.subjectId)
      ) {
        return NextResponse.json(
          { error: "Invalid subject ID format." },
          { status: 400 },
        );
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { error: "No valid fields provided for update" },
          { status: 400 },
        );
      }

      const classData = await ClassModel.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { returnDocument:"after", runValidators: true },
      );

      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }

      return NextResponse.json(classData, { status: 200 });
    } catch (error) {
      console.error("Error updating class:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);
