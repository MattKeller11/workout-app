/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Workout, WorkoutPlan } from "@/types/workout";

/**
 * Accepts a workout object (with a .plan property that may be a stringified or object WorkoutPlan)
 * Returns a parsed WorkoutPlan or null if invalid.
 */
export function useParsedWorkoutPlan(
  workout: Workout | null
): WorkoutPlan | null {
  return useMemo(() => {
    if (!workout || !workout.plan) return null;
    const plan = workout.plan;
    if (typeof plan === "string") {
      try {
        const obj = JSON.parse(plan);
        if (
          obj &&
          typeof obj === "object" &&
          "title" in obj &&
          typeof obj.title === "string" &&
          Array.isArray(obj.exercises) &&
          obj.exercises.every(
            (ex: any) =>
              typeof ex === "object" &&
              "exercise" in ex &&
              typeof ex.exercise === "string" &&
              "sets" in ex &&
              typeof ex.sets === "number" &&
              "reps" in ex &&
              typeof ex.reps === "number"
          )
        ) {
          return obj as WorkoutPlan;
        }
      } catch {
        return null;
      }
    }
    if (
      plan &&
      typeof plan === "object" &&
      "title" in plan &&
      typeof plan.title === "string" &&
      Array.isArray(plan.exercises) &&
      plan.exercises.every(
        (ex: any) =>
          typeof ex === "object" &&
          "exercise" in ex &&
          typeof ex.exercise === "string" &&
          "sets" in ex &&
          typeof ex.sets === "number" &&
          "reps" in ex &&
          typeof ex.reps === "number"
      )
    ) {
      return plan as WorkoutPlan;
    }
    return null;
  }, [workout]);
}
