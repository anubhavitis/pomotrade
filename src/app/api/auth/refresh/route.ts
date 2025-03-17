import { NextRequest, NextResponse } from 'next/server';

interface RefreshRequest {
    refresh_token: string;
}

interface RefreshResponse {
    access_token: string;
    refresh_token: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as RefreshRequest;

        if (!body.refresh_token) {
            return NextResponse.json(
                { error: 'Refresh token is required' },
                { status: 400 }
            );
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/auth/refresh";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
        });

        const data = await response.json() as RefreshResponse;
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error refreshing tokens:', error);
        return NextResponse.json(
            { error: 'Failed to refresh tokens' },
            { status: 500 }
        );
    }
}
