import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth } from "@/lib/with-auth";

export const PATCH = withAuth(async (request, { userId }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "currentPassword and newPassword are required." },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 },
      );
    }
    const user = await User.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 },
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Invalid JSON body or failed password update." },
      { status: 400 },
    );
  }
});
