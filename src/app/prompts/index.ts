const workoutPlanSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exercise: { type: "string" },
          sets: { type: "integer" },
          reps: { type: "integer" },
        },
        required: ["exercise", "sets", "reps"],
      },
      minItems: 1,
    },
  },
  required: ["title", "exercises"],
};

export const systemPrompt = [
  "You are an expert workout assistant.",
  "Generate a concise workout plan targeting the specified muscle group(s) effectively.",
  "Assume access to all gym equipment available at an Anytime Fitness gym.",
  "For each muscle group, include 3-4 exercises, with 2-4 sets per exercise and 8-12 reps per set, ensuring a maximum of 8 total sets for the muscle group.",
  "Return only a valid JSON object that strictly matches this schema: { title: string, exercises: [ { exercise: string, sets: integer, reps: integer } ] }.",
  "Do not include any fields other than 'title', and 'exercises' (with 'exercise', 'sets', 'reps'). Do not include warm-up exercises, instructions, supersets, techniques, or any other fields.",
  "Do not return markdown, tables, or any text outside the JSON object.",
  `The JSON object must use the following schema: ${JSON.stringify(
    workoutPlanSchema
  )}`,
].join(" ");
