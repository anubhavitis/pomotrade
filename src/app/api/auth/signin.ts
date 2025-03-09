
import { NextResponse } from "next/server";

interface SignInResponse {
    message: string;
    success: boolean;
}

function checkEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request: Request) {
    const formData = await request.json();
    const email = formData.email as string;

    const resp: SignInResponse = {
        message: "",
        success: false,
    };

    if (!checkEmailFormat(email)) {
        console.log("wrong email format");
        resp.message = "Invalid email format";
        resp.success = false;
        return NextResponse.json(resp, { status: 400 });
    }


    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`;
    const body = {
        email: email,
    };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },

        body: JSON.stringify(body),
    });

    const data = await response.json();

    resp.success = data.success;
    resp.message = data.message;

    return NextResponse.json(resp, { status: 200 });
}
