import { systemPrompt } from "./prompts";
import { z } from "zod";

// Define a schema with Zod for the workout plan
export const WorkoutPlanSchema = z.object({
  title: z.string(),
  exercises: z
    .array(
      z.object({
        exercise: z.string(),
        sets: z.number().int(),
        reps: z.number().int(),
      })
    )
    .min(1),
});

export async function getGroqChatCompletion(userMessage: string) {
  const apiKey = process.env.GROQ_API_KEY;
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const body = {
    model: "llama-3.3-70b-versatile",
    response_format: {
      type: "json_object",
    },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from Groq");
  let jsonData;
  try {
    jsonData = JSON.parse(content);
    // Handle double-encoded JSON
    if (typeof jsonData === "string") {
      jsonData = JSON.parse(jsonData);
    }
  } catch {
    throw new SyntaxError(
      "JSON parsing failed: The model did not return valid JSON"
    );
  }
  // Validate with Zod
  return WorkoutPlanSchema.parse(jsonData);
}
