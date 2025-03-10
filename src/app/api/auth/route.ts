import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/account`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Credentials': 'include',
                'Content-Type': 'application/json',
            },
        });

        console.log("backendResponse", backendResponse);

        if (!backendResponse.ok) {
            return NextResponse.json(
                { success: false, message: "Authentication failed" },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json(
            { success: true, message: "Authenticated" },
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
