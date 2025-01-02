import { NextResponse } from "next/server";
import { LoopsClient } from "loops";

// Initialize Loops with your API key
const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

interface WaitlistResponse {
  message: string;
  success: boolean;
}

export async function POST(request: Request) {
  const resp: WaitlistResponse = {
    message: "",
    success: false,
  };
  try {
    const { email } = await request.json();

    const findContact = await loops.findContact({ email });

    if (findContact.length > 0 && findContact[0].email === email) {
      resp.message = "User Exists";
      resp.success = true;
      return NextResponse.json(resp, { status: 200 });
    }
    // Create contact
    const response = await loops.createContact(email);

    // @ts-expect-error response as message, just not exported by loops
    if (response.message) {
      resp.message = "Failed to add contact";
      resp.success = false;
      return NextResponse.json(resp, { status: 400 });
    }

    resp.message = "You are now on the waitlist";
    resp.success = true;
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    resp.message = "Internal server error";
    return NextResponse.json(resp, { status: 500 });
  }
}
