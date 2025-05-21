// src/app/workout/WorkoutPlanTable.tsx
import React from "react";
import { WorkoutPlan, isNormalExercise } from "@/lib/types";

export function WorkoutPlanTable({ plan }: { plan: WorkoutPlan }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-green-400 text-center">
        {plan.title}
      </h2>
      <table className="min-w-full border border-neutral-700 my-4 text-neutral-100">
        <thead>
          <tr>
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
