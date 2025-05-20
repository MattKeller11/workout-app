import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "@/app/groq";

export async function POST(request: Request) {
  try {
    const { userMessage } = await request.json();
    const completion = await getGroqChatCompletion(userMessage);
    return NextResponse.json({ result: completion });
  } catch (error) {
    return NextResponse.json(
      { error: error?.toString() || "Unknown error" },
      { status: 500 }
    );
  }
}
