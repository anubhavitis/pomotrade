import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
) {
    try {
        const { email, pin } = await request.json();

        if (!email || !pin) {
            return NextResponse.json(
                { success: false, message: "Email and PIN are required" },
                { status: 400 }
            );
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login/${encodeURIComponent(email)}/${encodeURIComponent(pin)}`;

        const backendResponse = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(
                { success: false, message: "Login failed" },
                { status: backendResponse.status }
            );
        }


        const data = {
            success: true,
            message: "Login successful",
            tokens: {
                accessToken: body.access_token,
                refreshToken: body.refresh_token,
            }
        };

        // Create the response with the data
        const response = NextResponse.json(data, {
            status: backendResponse.status,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
} 