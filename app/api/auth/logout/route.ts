// logout user
import { NextResponse } from "next/server";

export async function POST() {
    try{

        const response = NextResponse.json({ message: "Logout successful!" }, { status: 200 });
        
        // Clear the token cookie
        response.cookies.set("token", "", {
            name: "token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Expire immediately
            path: "/", // Cookie is accessible throughout the site
        });
        
        return response;
    }catch (error) {
        console.error("Error in POST /api/auth/logout:", error);
        return NextResponse.json(
            { errors: ["Internal Server Error"] },
            { status: 500 },
        );
    }
}