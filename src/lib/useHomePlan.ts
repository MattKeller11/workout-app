import { useEffect } from "react";
import { parseGroqResponse } from "@/lib/workoutParsing";

export function useHomePlan(
  state: string,
  setParsed: (parsed: { header: string[]; dataRows: string[][] } | null) => void
) {
  // On mount, check for a plan in localStorage if no new plan is generated
  useEffect(() => {
    if (!state) {
      const local = localStorage.getItem("currentWorkout");
      if (local) {
        try {
          type Exercise = { exercise: string; sets: string; reps: string };
          const parsedLocal = JSON.parse(local);
          if (
            parsedLocal &&
            Array.isArray(parsedLocal.exercises) &&
            parsedLocal.exercises.length > 0
          ) {
            const header = ["Exercise", "Sets", "Reps"];
            const dataRows = (parsedLocal.exercises as Exercise[]).map((ex) => [
              ex.exercise,
              ex.sets,
              ex.reps,
            ]);
            setParsed({ header, dataRows });
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [state, setParsed]);

  // Parse response when state changes
  useEffect(() => {
    if (state) {
      const parsedResult = parseGroqResponse(state);
      setParsed(
        parsedResult && parsedResult.dataRows.length ? parsedResult : null
      );
    }
  }, [state, setParsed]);
}
