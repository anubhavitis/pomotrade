import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("signup verify route hit");
  const { email, pin } = await request.json();
  console.log("email and pin", email, pin);

  try {
    // const { searchParams } = new URL(request.url);
    // const email = searchParams.get("email");
    // const pin = searchParams.get("pin");

    if (!email || !pin) {
      return NextResponse.json(
        { success: false, message: "Email and PIN are required" },
        { status: 400 }
      );
    }

    // request to your backend service
    const backendUrl = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/v1/account/verify/${encodeURIComponent(email)}/${encodeURIComponent(
      pin
    )}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("signup verify data", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Account verification failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Account verification successful", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during account verification" },
      { status: 500 }
    );
  }
}
