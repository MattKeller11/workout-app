"use server";
import { getGroqChatCompletion } from "@/app/groq";

export async function getGroqResultAction(
  prevState: string,
  formData: FormData
) {
  const userMessage = formData.get("userMessage") as string;
  try {
    const data = await getGroqChatCompletion(userMessage);
    return data.choices?.[0]?.message?.content || "No result returned";
  } catch (e) {
    return e instanceof Error ? e.message : "Unknown error";
  }
}
