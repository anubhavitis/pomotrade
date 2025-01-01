import { NextResponse } from "next/server";
import { LoopsClient } from "loops";

// Initialize Loops with your API key
const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Test API key
    const testResult = await loops.testApiKey();
    console.log("API key test:", testResult);

    // Create contact
    const response = await loops.createContact(email);
    console.log("Loops response:", response);

    if (response.message) {
      return NextResponse.json(
        { error: "Failed to add contact" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
