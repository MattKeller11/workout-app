"use server";
import { getGroqChatCompletion } from "@/app/groq";
import { getRecentWorkoutsSummary } from "@/lib/supabaseClient";

export async function getGroqResultAction(
  _prevState: string,
  formData: FormData
) {
  const userMessage = formData.get("userMessage") as string;
  // Fetch recent workouts for context
  const recentWorkouts = await getRecentWorkoutsSummary();
  let context = "";
  if (recentWorkouts) {
    context = `Here are my last workouts:\n${recentWorkouts}\nPlease switch up exercises and provide any additional insight for my next workout.`;
  }
  try {
    const data = await getGroqChatCompletion(`${context}\n${userMessage}`);
    return data.choices?.[0]?.message?.content || "No result returned";
  } catch (e) {
    return e instanceof Error ? e.message : "Unknown error";
  }
}
