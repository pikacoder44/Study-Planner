import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Subject from "@/models/Subject";
import { withAuth } from "@/lib/with-auth";

type Context = {
  params: Promise<{ subjectId: string }>;
};

// Fetch one subject by ID for authenticated user
export const GET = withAuth<Context>(async (req, { userId }, { params }) => {
  try {
    const { subjectId } = await params;
    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId parameter" },
        { status: 400 },
      );
    }

    const subject = await Subject.findOne({ _id: subjectId, userId });
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ subject });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});

// Delete a subject by ID for authenticated user
export const DELETE = withAuth<Context>(async (req, { userId }, { params }) => {
  try {
    const { subjectId } = await params;
    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId parameter" },
        { status: 400 },
      );
    }

    if (!mongoose.isValidObjectId(subjectId)) {
      return NextResponse.json(
        { error: "Invalid subject ID" },
        { status: 400 },
      );
    }

    const deletedSubject = await Subject.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(subjectId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!deletedSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});

// Update a subject by ID for authenticated user
export const PUT = withAuth<Context>(async (req, { userId }, { params }) => {
  try {
    const { subjectId } = await params;
    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId parameter" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, code, color, description } = body;

    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: subjectId, userId },
      { name, code, color, description },
      { returnDocument:"after", runValidators: true },
    );

    if (!updatedSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
