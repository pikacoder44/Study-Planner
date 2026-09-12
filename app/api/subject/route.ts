import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { getAuthenticatedUserId } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, code, color, description } = body;

    const subject = new Subject({
      userId,
      name,
      code,
      color,
      description,
    });

    const savedSubject = await subject.save();
    return NextResponse.json(
      { message: "Subject created successfully", subject: savedSubject },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ subjects });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
