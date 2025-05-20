import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to fetch recent workouts (last 3) for context
export async function getRecentWorkoutsSummary() {
  type WorkoutRow = {
    date: string;
    exercises: { checked: boolean; data: string[] }[];
  };
  const { data, error } = await supabase
    .from("workouts")
    .select("date, exercises")
    .order("date", { ascending: false })
    .limit(5);
  if (error || !data) return "";
  return (data as WorkoutRow[])
    .map((w) => {
      const date = new Date(w.date).toLocaleDateString();
      const exercises = (w.exercises || [])
        .map((ex) => ex.data?.[0])
        .filter(Boolean)
        .join(", ");
      return `On ${date}: ${exercises}`;
    })
    .join("\n");
}
