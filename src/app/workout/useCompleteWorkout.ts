// src/app/workout/useCompleteWorkout.ts
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useCompleteWorkout() {
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function completeWorkout(workout: { date: string; plan: string }) {
    setCompleting(true);
    setError(null);
    setSuccess(false);
    const date = new Date().toISOString();
    const { error } = await supabase.from("workouts").insert([
      {
        date,
        plan: workout.plan,
      },
    ]);
    setCompleting(false);
    if (!error) {
      setSuccess(true);
      localStorage.removeItem("currentWorkout");
    } else {
      setError(error.message);
    }
  }

  return { completing, error, success, completeWorkout, setError, setSuccess };
}
