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
  "The workout plan should be suitable for a 45-60 minute session.",
  `Return only a valid JSON object that strictly matches this schema: ${JSON.stringify(
    workoutPlanSchema
  )}`,
  "Do not include any other fields other than the ones specified in the schema.",
  "Do not return markdown, tables, or any text outside the JSON object.",
].join(" ");
