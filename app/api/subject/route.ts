import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { id: string } | null;
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded.id;

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
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
