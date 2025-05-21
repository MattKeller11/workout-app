// src/lib/types.ts

export type WorkoutPlan = {
  title: string;
  exercises: Array<{
    exercise: string;
    sets: number;
    reps: number;
  }>;
};

export function isNormalExercise(ex: unknown): ex is {
  exercise: string;
  sets: number;
  reps: number;
} {
  return (
    typeof ex === "object" &&
    ex !== null &&
    "exercise" in ex &&
    "sets" in ex &&
    "reps" in ex
  );
}
