"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useWorkoutPlan } from "@/app/workout/WorkoutPlanContext";

export default function WorkoutChecklist() {
  const { plan } = useWorkoutPlan();
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

  function handleCheck(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const checkedCount = Object.values(checked).filter(Boolean).length;

  async function handleCompleteWorkout() {
    if (!plan) return;
    const completedExercises = plan.dataRows
      .map((row, i) => ({ checked: checked[i] || false, data: row }))
      .filter((ex) => ex.checked);
    if (completedExercises.length === 0) return;
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
    return (
      <div className="p-8 text-lg text-center">
        No workout plan found. Please generate a plan first.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950">
      <h1 className="text-2xl font-bold mb-6 text-neutral-100">
        Workout Checklist
      </h1>
      <table className="w-full max-w-2xl text-left border-separate border-spacing-y-2 mb-8">
        <thead>
          <tr>
            <th className="px-2 py-1"></th>
            {plan.header.map((h, i) => (
              <th
                key={i}
                className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plan.dataRows.map((row, i) => (
            <tr key={i} className={checked[i] ? "opacity-50" : ""}>
              <td className="px-2 py-1">
                <input
                  type="checkbox"
                  checked={checked[i] || false}
                  onChange={() => handleCheck(i)}
                  className="w-5 h-5 accent-green-500"
                />
              </td>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-2 py-1 border-b border-neutral-800 text-neutral-100"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        onClick={handleCompleteWorkout}
        className="mb-4"
        disabled={saving || checkedCount === 0}
      >
        {saving ? "Saving..." : "Complete Workout"}
      </Button>
      {saveMessage && (
        <div className="mb-4 p-4 rounded bg-neutral-900 text-neutral-100 border border-neutral-700 max-w-xl text-center">
          {saveMessage}
        </div>
      )}
      <Button onClick={() => window.history.back()}>Back to Plan</Button>
    </div>
  );
}
