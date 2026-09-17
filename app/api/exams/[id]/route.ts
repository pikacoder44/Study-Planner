import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Exam from "@/models/Exam";
import { withAuth } from "@/lib/with-auth";

type Context = {
  params: Promise<{ id: string }>;
};

// fetch single exam
export const GET = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid exam ID is required." },
          { status: 400 },
        );
      }

      const exam = await Exam.findOne({ _id: id, userId });
      if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      return NextResponse.json(exam, { status: 200 });
    } catch (error) {
      console.error("Error fetching exam:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);

// DELETE an exam
export const DELETE = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid exam ID is required." },
          { status: 400 },
        );
      }

      const exam = await Exam.findOneAndDelete({ _id: id, userId });
      if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Exam deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting exam:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);

// Update a single exam
export const PATCH = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid exam ID is required." },
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
        "title",
        "description",
        "subjectName",
        "subjectId",
        "examDate",
        "status",
        "priority",
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

      const exam = await Exam.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      return NextResponse.json(exam, { status: 200 });
    } catch (error) {
      console.error("Error updating exam:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
);