import { NextResponse } from "next/server";

interface SignUpResponse {
  message: string;
  success: boolean;
}

function checkEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  console.log("signup");
  try {
    const formData = await request.json();
    const name = formData.name as string;
    const email = formData.email as string;

    const resp: SignUpResponse = {
      message: "",
      success: false,
    };

    if (!checkEmailFormat(email)) {
      console.log("wrong email format");
      resp.message = "Invalid email format";
      resp.success = false;
      return NextResponse.json(resp, { status: 400 });
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/account/sign-up`;
    const body = {
      email: email,
      name: name,
    };
    console.log("url", url);
    console.log("body", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("response status:", response.status);

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
            message: textData || "Unknown error occurred"
          };
        }
      }

      console.log("parsed data:", data);

      if (response.ok) {
        resp.success = true;
        resp.message = data.message || "Signup successful";
      } else {
        resp.success = false;
        resp.message = data.message || "Error during signup";
      }

      return NextResponse.json(resp, { status: response.ok ? 200 : 400 });
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      resp.success = false;
      resp.message = "Failed to connect to authentication service";
      return NextResponse.json(resp, { status: 500 });
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json({
      success: false,
      message: "Invalid request format"
    }, { status: 400 });
  }
}
