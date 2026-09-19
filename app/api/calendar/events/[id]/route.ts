import mongoose from "mongoose";
import { NextResponse } from "next/server";
import CalendarEvent from "@/models/CalendarEvent";
import { withAuth } from "@/lib/with-auth";
import { isDateOnly, isTimeOnly } from "@/lib/api-date";

type Context = { params: Promise<{ id: string }> };
const editableFields = [
  "title",
  "date",
  "startTime",
  "endTime",
  "description",
  "color",
] as const;

export const PATCH = withAuth<Context>(
  async (request, { userId }, { params }) => {
    try {
      const { id } = await params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return NextResponse.json(
          { error: "A valid event ID is required." },
          { status: 400 },
        );
      let body: Record<string, unknown>;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body." },
          { status: 400 },
        );
      }

      const event = await CalendarEvent.findOne({ _id: id, userId });
      if (!event)
        return NextResponse.json(
          { error: "Calendar event not found." },
          { status: 404 },
        );
      const updates: Record<string, unknown> = {};
      for (const field of editableFields)
        if (body[field] !== undefined) updates[field] = body[field];
      if (
        updates.title !== undefined &&
        (typeof updates.title !== "string" || !updates.title.trim())
      )
        return NextResponse.json(
          { error: "title must be a non-empty string." },
          { status: 400 },
        );
      if (updates.date !== undefined && !isDateOnly(updates.date))
        return NextResponse.json(
          { error: "date must be formatted as YYYY-MM-DD." },
          { status: 400 },
        );
      for (const field of ["startTime", "endTime"] as const)
        if (updates[field] !== undefined && !isTimeOnly(updates[field]))
          return NextResponse.json(
            { error: `${field} must be formatted as HH:mm.` },
            { status: 400 },
          );
      const start = (updates.startTime ?? event.startTime) as
        | string
        | undefined;
      const end = (updates.endTime ?? event.endTime) as string | undefined;
      if (start && end && start >= end)
        return NextResponse.json(
          { error: "endTime must be later than startTime." },
          { status: 400 },
        );
      if (typeof updates.title === "string")
        updates.title = updates.title.trim();
      const updatedEvent = await CalendarEvent.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { new: true, runValidators: true },
      );
      return NextResponse.json({ event: updatedEvent });
    } catch (error) {
      console.error("Error updating calendar event:", error);
      return NextResponse.json(
        { error: "Failed to update calendar event." },
        { status: 500 },
      );
    }
  },
);

export const DELETE = withAuth<Context>(
  async (_request, { userId }, { params }) => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { error: "A valid event ID is required." },
        { status: 400 },
      );
    const event = await CalendarEvent.findOneAndDelete({ _id: id, userId });
    if (!event)
      return NextResponse.json(
        { error: "Calendar event not found." },
        { status: 404 },
      );
    return NextResponse.json({
      message: "Calendar event deleted successfully.",
    });
  },
);
