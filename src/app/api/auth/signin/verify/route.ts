import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("verify route hit");
    const { email, pin } = await request.json();

    console.log("request", request);

    // const { searchParams } = new URL(request.url);
    // const email = searchParams.get("email");
    // const pin = searchParams.get("pin");

    if (!email || !pin) {
      return NextResponse.json(
        { success: false, message: "Email and PIN are required" },
        { status: 400 }
      );
    }

    // Request to backend service
    const backendUrl = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/v1/auth/login/${encodeURIComponent(email)}/${encodeURIComponent(
      pin
    )}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Login verification failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Login successful", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login verification" },
      { status: 500 }
    );
  }
}
