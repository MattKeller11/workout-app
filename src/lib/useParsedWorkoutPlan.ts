// src/lib/useParsedWorkoutPlan.ts
import { useMemo } from "react";
import { WorkoutPlan } from "@/lib/types";

/**
 * Accepts a workout object (with a .plan property that may be a stringified or object WorkoutPlan)
 * Returns a parsed WorkoutPlan or null if invalid.
 */
export function useParsedWorkoutPlan(
  workout: { plan: string } | { plan: unknown } | null
): WorkoutPlan | null {
  return useMemo(() => {
    if (!workout) return null;
    const plan = workout.plan;
    if (typeof plan === "string") {
      try {
        const obj = JSON.parse(plan);
        if (
          obj &&
          typeof obj === "object" &&
          "title" in obj &&
          Array.isArray(obj.exercises)
        ) {
          return obj as WorkoutPlan;
        }
      } catch {}
    }
    if (
      plan &&
      typeof plan === "object" &&
      "title" in plan &&
      "exercises" in plan
    ) {
      return plan as WorkoutPlan;
    }
    return null;
  }, [workout]);
}
