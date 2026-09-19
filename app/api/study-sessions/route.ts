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

function parseSessionBody(body: Record<string, unknown>) {
  const { title, subjectId, date, startTime, endTime, notes } = body;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof subjectId !== "string" ||
    !subjectId.trim() ||
    !isDateOnly(date) ||
    !isTimeOnly(startTime) ||
    !isTimeOnly(endTime)
  ) {
    return {
      error: "title, subjectId, date, startTime, and endTime are required.",
    };
  }

  const start = toDateTime(date, startTime);
  const end = toDateTime(date, endTime);
  const duration = getDurationMinutes(start, end);
  if (duration <= 0) {
    return { error: "endTime must be later than startTime." };
  }

  return {
    value: {
      title: title.trim(),
      subjectId: subjectId.trim(),
      startTime: start,
      endTime: end,
      duration,
      notes: typeof notes === "string" ? notes.trim() : "",
    },
  };
}

export const GET = withAuth(async (request, { userId }) => {
  try {
    const sessions = await StudySession.find({ userId }).sort({ startTime: 1 });
    return NextResponse.json({ sessions: sessions.map(serializeSession) });
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch study sessions." },
      { status: 500 },
    );
  }
});

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

    const parsed = parseSessionBody(body);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const session = await StudySession.create({ userId, ...parsed.value });
    return NextResponse.json(
      { session: serializeSession(session) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json(
      { error: "Failed to create study session." },
      { status: 500 },
    );
  }
});
