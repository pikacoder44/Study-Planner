import mongoose from "mongoose";
import { NextResponse } from "next/server";
import StudySession from "@/models/StudySession";
import { withAuth } from "@/lib/with-auth";
import {
  formatDateOnly,
  formatTimeOnly,
  getDurationMinutes,
  isDateOnly,
  isTimeOnly,
  toDateTime,
} from "@/lib/api-date";

type Context = { params: Promise<{ id: string }> };

function serializeSession(session: typeof StudySession.prototype) {
  return {
    id: session._id,
    title: session.title,
    subjectId: session.subjectId,
    date: formatDateOnly(session.startTime),
    startTime: formatTimeOnly(session.startTime),
    endTime: formatTimeOnly(session.endTime),
    duration: session.duration,
    notes: session.notes ?? "",
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export const GET = withAuth<Context>(
  async (_request, { userId }, { params }) => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "A valid study session ID is required." },
        { status: 400 },
      );
    }
    const session = await StudySession.findOne({ _id: id, userId });
    if (!session)
      return NextResponse.json(
        { error: "Study session not found." },
        { status: 404 },
      );
    return NextResponse.json({ session: serializeSession(session) });
  },
);

export const PATCH = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "A valid study session ID is required." },
          { status: 400 },
        );
      }
      let body: Record<string, unknown>;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body." },
          { status: 400 },
        );
      }

      const existing = await StudySession.findOne({ _id: id, userId });
      if (!existing)
        return NextResponse.json(
          { error: "Study session not found." },
          { status: 404 },
        );

      const date = body.date ?? formatDateOnly(existing.startTime);
      const startTime = body.startTime ?? formatTimeOnly(existing.startTime);
      const endTime = body.endTime ?? formatTimeOnly(existing.endTime);
      if (!isDateOnly(date) || !isTimeOnly(startTime) || !isTimeOnly(endTime)) {
        return NextResponse.json(
          { error: "date, startTime, and endTime must be valid." },
          { status: 400 },
        );
      }
      const start = toDateTime(date, startTime);
      const end = toDateTime(date, endTime);
      const duration = getDurationMinutes(start, end);
      if (duration <= 0)
        return NextResponse.json(
          { error: "endTime must be later than startTime." },
          { status: 400 },
        );

      const updates: Record<string, unknown> = {
        startTime: start,
        endTime: end,
        duration,
      };
      for (const field of ["title", "subjectId", "notes"] as const) {
        if (body[field] !== undefined) {
          if (
            field !== "notes" &&
            (typeof body[field] !== "string" || !body[field].trim())
          ) {
            return NextResponse.json(
              { error: `${field} must be a non-empty string.` },
              { status: 400 },
            );
          }
          updates[field] =
            typeof body[field] === "string" ? body[field].trim() : body[field];
        }
      }

      const session = await StudySession.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { new: true, runValidators: true },
      );
      return NextResponse.json({ session: serializeSession(session!) });
    } catch (error) {
      console.error("Error updating study session:", error);
      return NextResponse.json(
        { error: "Failed to update study session." },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAuth<Context>(
  async (_request, { userId }, { params }) => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "A valid study session ID is required." },
        { status: 400 },
      );
    }
    const session = await StudySession.findOneAndDelete({ _id: id, userId });
    if (!session)
      return NextResponse.json(
        { error: "Study session not found." },
        { status: 404 },
      );
    return NextResponse.json({
      message: "Study session deleted successfully.",
    });
  },
);
