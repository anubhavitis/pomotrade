import { NextResponse } from "next/server";

interface WaitlistResponse {
  message: string;
  success: boolean;
}

async function checkEmailExists(email: string): Promise<boolean> {
  const url = `https://api.brevo.com/v3/contacts/${email}`;
  const response = await fetch(url, {
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
    },
  });

  const resp = await response.json();

  if (response.status === 200 && resp.email === email) {
    return true;
  }

  return false;
}

async function createContact(email: string): Promise<boolean> {
  const url = `https://api.brevo.com/v3/contacts`;
  const body = {
    email: email,
    attributes: {},
    listIds: [6],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  const resp = await response.json();
  console.log("value of create contact response", resp);

  if (response.ok == true && response.statusText == "Created") {
    return true;
  }
  return false;
}

function checkEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  const resp: WaitlistResponse = {
    message: "",
    success: false,
  };

  const email = (await request.json()).email as string;

  if (!checkEmailFormat(email)) {
    console.log("wrong email format");
    resp.message = "Invalid email format";
    resp.success = false;
    return NextResponse.json(resp, { status: 400 });
  }

  if (await checkEmailExists(email)) {
    console.log("email already exists");
    resp.message = "You are already on the waitlist";
    resp.success = true;
    return NextResponse.json(resp, { status: 200 });
  }

  if (await createContact(email)) {
    console.log("email created");
    resp.message = "You are now on the waitlist";
    resp.success = true;
    return NextResponse.json(resp, { status: 200 });
  } else {
    resp.message = "Internal server error";
    resp.success = false;
    return NextResponse.json(resp, { status: 500 });
  }
}
