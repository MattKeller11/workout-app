import React from "react";
import { WorkoutPlan, isNormalExercise } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export function WorkoutPlanTable({
  plan,
  checked,
  onCheck,
}: {
  plan: WorkoutPlan;
  checked: boolean[];
  onCheck: (idx: number, value: boolean) => void;
}) {
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
              <tr
                key={i}
                className={
                  checked[i]
                    ? "opacity-40 cursor-pointer"
                    : "hover:bg-neutral-800 cursor-pointer"
                }
                onClick={() => onCheck(i, !checked[i])}
              >
                <td className="px-3 py-2 border-b border-neutral-800">
                  <Checkbox
                    checked={checked[i]}
                    onCheckedChange={(val) => onCheck(i, !!val)}
                    aria-label={`Mark ${ex.exercise} as complete`}
                    onClick={(e) => e.stopPropagation()}
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
