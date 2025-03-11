import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Get authorization header from the incoming request
        const authHeader = request.headers.get('authorization');

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/account`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Authentication failed" },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(
            { success: true, message: "Authenticated", data },
            { status: 200 }
        );

    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
