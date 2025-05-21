import React, { useState } from "react";
import { WorkoutPlan, isNormalExercise } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export function WorkoutPlanTable({ plan }: { plan: WorkoutPlan }) {
  // Track checked state for each exercise
  const [checked, setChecked] = useState<boolean[]>(() =>
    plan.exercises.map(() => false)
  );

  const handleCheck = (idx: number, value: boolean) => {
    setChecked((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-green-400 text-center">
        {plan.title}
      </h2>
      <table className="min-w-full border border-neutral-700 my-4 text-neutral-100">
        <thead>
          <tr>
            <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold"></th>
            <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold">
              Exercise
            </th>
            <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold">
              Sets
            </th>
            <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold">
              Reps
            </th>
          </tr>
        </thead>
        <tbody>
          {plan.exercises.map((ex, i) =>
            isNormalExercise(ex) ? (
              <tr key={i}>
                <td className="px-3 py-2 border-b border-neutral-800">
                  <Checkbox
                    checked={checked[i]}
                    onCheckedChange={(val) => handleCheck(i, !!val)}
                    aria-label={`Mark ${ex.exercise} as complete`}
                  />
                </td>
                <td className="px-3 py-2 border-b border-neutral-800">
                  {ex.exercise}
                </td>
                <td className="px-3 py-2 border-b border-neutral-800">
                  {ex.sets}
                </td>
                <td className="px-3 py-2 border-b border-neutral-800">
                  {ex.reps}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </>
  );
}
