// src/lib/workoutParsing.ts

// Helper to parse a row into { exercise, sets, reps }
export function parseExerciseRow(row: string[]): {
  exercise: string;
  sets: string;
  reps: string;
} {
  const [rawExercise = "", setsInit = "", repsInit = ""] = row;
  let sets = setsInit;
  let reps = repsInit;
  let exercise = rawExercise
    .replace(/^[\s]*(\d+\.?|\d+\)|\d+\.|\d+\s)[\s\-\.]*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();

  // If sets or reps are missing, try to extract from exercise name
  if ((!sets || !reps) && exercise) {
    // Match formats like: (3x10), 3x10, 3 x 10, 3 sets x 10 reps, etc.
    const match = exercise.match(
      /(?:\(|\s|^)(\d{1,2})\s*[xX×]\s*(\d{1,3})(?:\)|\s|$)/
    );
    if (match) {
      if (!sets) sets = match[1];
      if (!reps) reps = match[2];
      // Remove the matched part from the exercise name
      exercise = exercise.replace(match[0], "").replace(/[()]/g, "").trim();
    } else {
      // Try to match '3 sets x 10 reps' or similar
      const match2 = exercise.match(
        /(\d{1,2})\s*sets?\s*[xX×]\s*(\d{1,3})\s*reps?/i
      );
      if (match2) {
        if (!sets) sets = match2[1];
        if (!reps) reps = match2[2];
        exercise = exercise.replace(match2[0], "").trim();
      }
    }
  }
  return { exercise: exercise.trim(), sets: sets.trim(), reps: reps.trim() };
}

// Helper to parse the entire plan into structured data
export function parsePlanToStructured(plan: {
  header: string[];
  dataRows: string[][];
}): Array<{ exercise: string; sets: string; reps: string }> {
  return plan.dataRows.map(parseExerciseRow);
}

// Helper to parse Groq AI response
export function parseGroqResponse(
  response: string
): { header: string[]; dataRows: string[][] } | null {
  const lines = response.split("\n").filter(Boolean);
  if (lines.length < 2) return null;
  const header = lines[0].split("|").map((h) => h.trim());
  const dataRows = lines
    .slice(1)
    .filter((line) => !/^[-|\s]+$/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()));
  if (!dataRows.length) return null;
  return { header, dataRows };
}
