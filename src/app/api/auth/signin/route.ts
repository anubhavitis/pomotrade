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
  try {
    const formData = await request.json();
    const email = formData.email as string;

    const resp: SignInResponse = {
      message: "",
      success: false,
    };

    if (!checkEmailFormat(email)) {
      resp.message = "Invalid email format";
      resp.success = false;
      return NextResponse.json(resp, { status: 400 });
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`;
    const body = {
      email: email,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Handle different response types
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle text or other response types
        const textData = await response.text();
        try {
          // Try to parse as JSON anyway
          data = JSON.parse(textData);
        } catch (e) {
          // If parsing fails, use text as message
          data = {
            success: false,
            message: textData || "Unknown error occurred",
          };
        }
      }

      if (response.ok) {
        resp.success = true;
        resp.message = data.message || "Sign in link sent";
      } else {
        resp.success = false;
        resp.message = data.message || "Error during sign in";
      }

      return NextResponse.json(resp, { status: response.ok ? 200 : 400 });
    } catch (fetchError) {
      resp.success = false;
      resp.message = "Failed to connect to authentication service";
      return NextResponse.json(resp, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request format",
      },
      { status: 400 }
    );
  }
}
