"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function WorkoutChecklist() {
  const router = useRouter();
  const [workout, setWorkout] = useState<{
    date: string;
    plan: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    // Always load current workout from localStorage (no DB fetch)
    const local = localStorage.getItem("currentWorkout");
    if (local) {
      const parsed = JSON.parse(local);
      setWorkout(parsed);
    } else {
      router.replace("/");
    }
  }, [router]);

  async function handleCompleteWorkout() {
    if (!workout) return;
    setSaving(true);
    setSaveMessage(null);
    // Save the raw plan to DB as completed, then clear localStorage
    const date = new Date().toISOString();
    const { error } = await supabase.from("workouts").insert([
      {
        date,
        plan: workout.plan,
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-950">
      <h1 className="text-3xl font-extrabold mb-8 text-neutral-100 tracking-tight drop-shadow-lg">
        Workout Checklist
      </h1>
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-xl p-6 mb-8 border border-neutral-800">
        <div className="prose prose-invert w-full max-w-none text-neutral-100 mb-4">
          <pre className="whitespace-pre-wrap">{workout.plan}</pre>
        </div>
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
          onClick={() => router.push("/")}
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
