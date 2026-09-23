import { NextResponse } from "next/server";
import User from "@/models/User";
import { withAuth } from "@/lib/with-auth";

export const DELETE = withAuth(async (_request, { userId }) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Account deleted successfully." },
      { status: 200 },
    );
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error in DELETE /api/auth/account:", error);
    return NextResponse.json(
      { error: "Unable to delete account." },
      { status: 500 },
    );
  }
});
