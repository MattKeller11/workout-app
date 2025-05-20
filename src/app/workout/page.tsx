"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function WorkoutChecklist() {
  const router = useRouter();
  const [workout, setWorkout] = useState<{
    id: string;
    date: string;
    exercises: Array<{ exercise: string; sets: string; reps: string }>;
  } | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    // Always load current workout from localStorage (no DB fetch)
    const local = localStorage.getItem("currentWorkout");
    if (local) {
      const parsed = JSON.parse(local);
      setWorkout(parsed);
      // Initialize checked state
      if (parsed && parsed.exercises) {
        const initialChecked: Record<string, boolean> = {};
        parsed.exercises.forEach((_: unknown, i: number) => {
          initialChecked[i] = false;
        });
        setChecked(initialChecked);
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  function handleCheck(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  async function handleCompleteWorkout() {
    if (!workout) return;
    const completedExercises = workout.exercises
      .map((row, i: number) => ({ checked: checked[i] || false, data: row }))
      .filter((ex) => ex.checked)
      .map((ex) => ex.data);
    if (completedExercises.length === 0) {
      setSaveMessage(
        "You must check off at least one exercise before completing your workout."
      );
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    // Always save to DB as completed, then clear localStorage
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
      localStorage.removeItem("currentWorkout");
    } else {
      setSaveMessage("Error saving workout: " + error.message);
    }
  }

  if (!workout) {
    return null;
  }
  const exercises: Array<{ exercise: string; sets: string; reps: string }> =
    workout.exercises ?? [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950">
      <h1 className="text-3xl font-extrabold mb-8 text-neutral-100 tracking-tight drop-shadow-lg">
        Workout Checklist
      </h1>
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-xl p-6 mb-8 border border-neutral-800">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200">
                Done
              </th>
              <th className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200">
                Exercise
              </th>
              <th className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200">
                Sets
              </th>
              <th className="px-2 py-1 font-bold border-b border-neutral-700 text-neutral-200">
                Reps
              </th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((row, i) => {
              const isLastRow = i === exercises.length - 1;
              const borderClass = isLastRow
                ? ""
                : "border-b border-neutral-800";
              return (
                <tr
                  key={i}
                  className={
                    checked[i]
                      ? "opacity-50"
                      : "hover:bg-neutral-800 transition-colors duration-150"
                  }
                >
                  <td className={`px-2 py-1 align-middle ${borderClass}`}>
                    <input
                      type="checkbox"
                      checked={checked[i] || false}
                      onChange={() => handleCheck(i)}
                      className="w-5 h-5 accent-green-500 rounded-full border-2 border-neutral-700 shadow-sm focus:ring-2 focus:ring-green-400"
                    />
                  </td>
                  <td
                    className={`px-2 py-1 text-neutral-100 align-middle ${borderClass}`}
                  >
                    {row.exercise}
                  </td>
                  <td
                    className={`px-2 py-1 text-neutral-100 align-middle ${borderClass}`}
                  >
                    {row.sets}
                  </td>
                  <td
                    className={`px-2 py-1 text-neutral-100 align-middle ${borderClass}`}
                  >
                    {row.reps}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-2xl justify-center px-0">
        <Button
          onClick={handleCompleteWorkout}
          className="mb-0 w-full h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
          disabled={saving}
        >
          {saving ? "Saving..." : "Complete Workout"}
        </Button>
        <Button
          onClick={() => window.history.back()}
          className="mb-0 w-full h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
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
