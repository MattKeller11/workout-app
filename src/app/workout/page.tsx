"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useWorkoutPlan } from "@/app/workout/WorkoutPlanContext";
import { useRouter } from "next/navigation";

export default function WorkoutChecklist() {
  const { plan } = useWorkoutPlan();
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (plan && plan.dataRows) {
      const initialChecked: Record<string, boolean> = {};
      plan.dataRows.forEach((_, i) => {
        initialChecked[i] = false;
      });
      setChecked(initialChecked);
    }
  }, [plan]);

  useEffect(() => {
    if (!plan) {
      router.replace("/");
    }
  }, [plan, router]);

  function handleCheck(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  async function handleCompleteWorkout() {
    if (!plan) return;
    const completedExercises = plan.dataRows
      .map((row, i) => ({ checked: checked[i] || false, data: row }))
      .filter((ex) => ex.checked);
    if (completedExercises.length === 0) {
      setSaveMessage(
        "You must check off at least one exercise before completing your workout."
      );
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    const date = new Date().toISOString();
    const { error } = await supabase.from("workouts").insert([
      {
        date,
        exercises: completedExercises,
      },
    ]);
    setSaving(false);
    if (!error) {
      setSaveMessage("Workout saved!");
    } else {
      setSaveMessage("Error saving workout: " + error.message);
    }
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950">
      <h1 className="text-3xl font-extrabold mb-8 text-neutral-100 tracking-tight drop-shadow-lg">
        Workout Checklist
      </h1>
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-xl p-6 mb-8 border border-neutral-800">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-2 py-1 text-neutral-400 font-mono w-8">#</th>
              <th className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200">
                Done
              </th>
              {plan.header.map((h, i) =>
                // Remove number/"#" column from header
                i === 0 && h.match(/^#|No\.?$/i) ? null : (
                  <th
                    key={i}
                    className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {plan.dataRows.map((row, i) => (
              <tr
                key={i}
                className={
                  checked[i]
                    ? "opacity-50"
                    : "hover:bg-neutral-800 transition-colors duration-150"
                }
              >
                <td className="px-2 py-1 text-neutral-400 font-mono align-middle">
                  {i + 1}
                </td>
                <td className="px-2 py-1 align-middle">
                  <input
                    type="checkbox"
                    checked={checked[i] || false}
                    onChange={() => handleCheck(i)}
                    className="w-5 h-5 accent-green-500 rounded-full border-2 border-neutral-700 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                </td>
                {/* Only remove the first cell if it is ONLY a number or number+period/parenthesis, otherwise just strip the prefix from the cell */}
                {row.map((cell, j) => {
                  if (
                    j === 0 &&
                    cell.match(/^\s*(\d+\.?|\d+\)|\d+\.|\d+\s)[\s\-\.]?$/)
                  ) {
                    // If the cell is just a number or number+punctuation, skip it
                    return null;
                  }
                  // Otherwise, strip any leading number+punctuation, but keep the rest
                  return (
                    <td
                      key={j}
                      className="px-2 py-1 border-b border-neutral-800 text-neutral-100 align-middle"
                    >
                      {j === 0
                        ? cell
                            .replace(
                              /^\s*(\d+\.?|\d+\)|\d+\.|\d+\s)[\s\-\.]*/,
                              ""
                            )
                            .trim()
                        : cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 w-full max-w-2xl justify-center">
        <Button
          onClick={handleCompleteWorkout}
          className="mb-0 w-48 h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
          disabled={saving}
        >
          {saving ? "Saving..." : "Complete Workout"}
        </Button>
        <Button
          onClick={() => window.history.back()}
          className="mb-0 w-48 h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
          variant="secondary"
        >
          Back to Plan
        </Button>
      </div>
      {saveMessage && (
        <div className="mt-6 p-4 rounded bg-neutral-900 text-neutral-100 border border-green-700 max-w-xl text-center shadow-lg">
          {saveMessage}
        </div>
      )}
    </div>
  );
}
