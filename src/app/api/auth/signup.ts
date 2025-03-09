import { NextResponse } from "next/server";

interface WaitlistResponse {
  message: string;
  success: boolean;
}

function checkEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function Signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;



  const resp: WaitlistResponse = {
    message: "",
    success: false,
  };

  const url = `https://api.brevo.com/v3/contacts`;
  const body = {
    email: email,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      //   "api-key": process.env.BREVO_API_KEY!,
    },

    body: JSON.stringify(body),
  });

  //   const email = (await request.json()).email as string;

  if (!checkEmailFormat(email)) {
    console.log("wrong email format");
    resp.message = "Invalid email format";
    resp.success = false;
    return NextResponse.json(resp, { status: 400 });
  }
}
