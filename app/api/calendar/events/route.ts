import { NextResponse } from "next/server";
import CalendarEvent from "@/models/CalendarEvent";
import { withAuth } from "@/lib/with-auth";
import { isDateOnly, isTimeOnly } from "@/lib/api-date";

function validateEventBody(body: Record<string, unknown>) {
  const { title, date, startTime, endTime, description, color } = body;
  if (typeof title !== "string" || !title.trim() || !isDateOnly(date)) {
    return "title and a valid date are required.";
  }
  if (startTime !== undefined && !isTimeOnly(startTime))
    return "startTime must be formatted as HH:mm.";
  if (endTime !== undefined && !isTimeOnly(endTime))
    return "endTime must be formatted as HH:mm.";
  if (startTime && endTime && startTime >= endTime)
    return "endTime must be later than startTime.";
  if (description !== undefined && typeof description !== "string")
    return "description must be a string.";
  if (color !== undefined && typeof color !== "string")
    return "color must be a string.";
  return null;
}

export const POST = withAuth(async (request, { userId }) => {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }
    const validationError = validateEventBody(body);
    if (validationError)
      return NextResponse.json({ error: validationError }, { status: 400 });

    const event = await CalendarEvent.create({
      userId,
      title: body.title,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      description: body.description,
      color: body.color,
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event." },
      { status: 500 },
    );
  }
});
