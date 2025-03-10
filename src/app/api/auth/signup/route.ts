import { error } from "console";
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

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },

    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        message: "Account creation failed",
        data: response.json(),
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  console.log("data", data);

  resp.success = data.success;
  resp.message = data.message;

  return NextResponse.json(resp, { status: 200 });
}
