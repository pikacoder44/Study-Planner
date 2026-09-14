import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getAuthenticatedUserId } from "@/lib/api-auth";

type Context = {
  params: Promise<{ subjectId: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId } = await params;
    if (!subjectId) {
      return NextResponse.json(
        { error: "Missing subjectId parameter" },
        { status: 400 },
      );
    }

    const deletedSubject = await Subject.findOneAndDelete({
      _id: subjectId,
      userId,
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
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      { new: true , runValidators: true },
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
}