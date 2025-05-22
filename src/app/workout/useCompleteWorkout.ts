/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Workout, WorkoutPlan } from "@/types/workout";

export function useCompleteWorkout() {
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function completeWorkout(workout: Workout) {
    setCompleting(true);
    setError(null);
    setSuccess(false);

    try {
      // Use provided workout.date or fallback to current timestamp
      const date = workout.date || new Date().toISOString();

      // Ensure plan is an object (not a string) for Supabase
      const plan: WorkoutPlan =
        typeof workout.plan === "string"
          ? JSON.parse(workout.plan)
          : workout.plan;

      // Validate plan structure
      if (!plan || !plan.title || !Array.isArray(plan.exercises)) {
        throw new Error("Invalid workout plan format");
      }

      // Insert into workouts table
      const { error } = await supabase.from("workouts").insert([
        {
          date,
          plan, // Pass plan as an object, Supabase handles JSONB serialization
        },
      ]);

      if (error) throw new Error(error.message);

      setSuccess(true);
      localStorage.removeItem("currentWorkout");
    } catch (err: any) {
      setError(err.message || "Failed to save workout");
    } finally {
      setCompleting(false);
    }
  }

  return { completing, error, success, completeWorkout, setError, setSuccess };
}
