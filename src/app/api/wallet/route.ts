import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/account/wallet`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
        });

        const data = await backendResponse.json();

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Error retrieving wallet:", error);
        return NextResponse.json({
            message: "Failed to retrieve wallet",
            success: false,
            data: null
        }, { status: 500 });
    }
}
