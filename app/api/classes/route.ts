import { NextRequest, NextResponse } from "next/server";
import ClassModel from "@/models/Class";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Filter classes by the authenticated user's ID
    const classes = await ClassModel.find({ userId }).sort({ startTime: 1 });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 },
    );
  }
});

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { subjectId, title, dayOfWeek, startTime, endTime, room, isActive } =
      body;
    if (!subjectId || !title || !dayOfWeek || !startTime) {
      return NextResponse.json(
        {
          error:
            "subjectId, title, dayOfWeek, and startTime are required fields",
        },
        { status: 400 },
      );
    }

    const newClass = await ClassModel.create({
      userId,
      subjectId,
      title,
      dayOfWeek,
      startTime,
      endTime,
      room,
      isActive: isActive ?? true,
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
});
