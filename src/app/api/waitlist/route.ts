import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Waitlist from "@/models/waitlist";
import { sendWaitlistEmail } from "@/lib/mailer";

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
    await dbConnect();
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      resp.message = "Invalid email format";
      resp.success = false;
      return NextResponse.json(resp, { status: 400 });
    }

    // Check if email already exists
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      resp.message = "You are already on the waitlist";
      resp.success = true;
      return NextResponse.json(resp, { status: 200 });
    }

    await sendWaitlistEmail(email);
    await Waitlist.create({ email });
    resp.message = "You are now on the waitlist";
    resp.success = true;
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    resp.message = "Internal server error";
    return NextResponse.json(resp, { status: 500 });
  }
}
