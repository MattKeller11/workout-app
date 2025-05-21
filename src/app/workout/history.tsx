// src/app/workout/history.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { WorkoutPlan } from "@/lib/types";

interface WorkoutHistoryItem {
  id: string;
  date: string;
  plan: WorkoutPlan;
}

export default function WorkoutHistoryPage() {
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WorkoutHistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const { data, error } = await supabase
        .from("workouts")
        .select("id, date, plan")
        .order("date", { ascending: false });
      if (error) setError(error.message);
      else if (Array.isArray(data)) {
        // Parse plan as WorkoutPlan, fallback to null if invalid
        setHistory(
          data.map((item) => {
            let plan: WorkoutPlan | null = null;
            if (typeof item.plan === "string") {
              try {
                const parsed = JSON.parse(item.plan);
                if (
                  parsed &&
                  typeof parsed === "object" &&
                  "title" in parsed &&
                  Array.isArray(parsed.exercises)
                ) {
                  plan = parsed as WorkoutPlan;
                }
              } catch {}
            } else if (
              item.plan &&
              typeof item.plan === "object" &&
              "title" in item.plan &&
              Array.isArray(item.plan.exercises)
            ) {
              plan = item.plan as WorkoutPlan;
            }
            return {
              ...item,
              plan: plan || { title: "Untitled", exercises: [] },
            };
          })
        );
      } else {
        setHistory([]);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-neutral-950">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-xl p-6 mb-8 border border-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-green-400 text-center">
          Workout History
        </h1>
        {loading ? (
          <div className="text-neutral-300 text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-neutral-400 text-center py-8">
            No workouts found.
          </div>
        ) : (
          <table className="min-w-full border border-neutral-700 text-neutral-100">
            <thead>
              <tr>
                <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold">
                  Date
                </th>
                <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold">
                  Title
                </th>
                <th className="px-3 py-2 border-b border-neutral-700 text-left font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 border-b border-neutral-800">
                    {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 border-b border-neutral-800">
                    {item.plan &&
                    typeof item.plan === "object" &&
                    "title" in item.plan
                      ? item.plan.title
                      : "Untitled"}
                  </td>
                  <td className="px-3 py-2 border-b border-neutral-800">
                    <Button size="sm" onClick={() => setSelected(item)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Button variant="secondary" onClick={() => router.push("/")}>
        Back to Home
      </Button>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-neutral-900 text-neutral-100 rounded-md shadow-md p-4 max-w-md w-full flex flex-col items-center border-0">
          <DialogTitle className="text-lg font-semibold mb-2 text-center">
            Workout Details
          </DialogTitle>
          {selected && (
            <div className="w-full">
              <div className="mb-2 text-green-400 font-bold text-center">
                {selected.plan &&
                typeof selected.plan === "object" &&
                "title" in selected.plan
                  ? selected.plan.title
                  : "Untitled"}
              </div>
              <div className="mb-2 text-neutral-400 text-center text-xs">
                {selected.date ? new Date(selected.date).toLocaleString() : "-"}
              </div>
              <table className="min-w-full border border-neutral-700 text-neutral-100 mb-2">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border-b border-neutral-700 text-left font-bold">
                      Exercise
                    </th>
                    <th className="px-2 py-1 border-b border-neutral-700 text-left font-bold">
                      Sets
                    </th>
                    <th className="px-2 py-1 border-b border-neutral-700 text-left font-bold">
                      Reps
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selected.plan && Array.isArray(selected.plan.exercises)
                    ? selected.plan.exercises.map(
                        (
                          ex: { exercise: string; sets: number; reps: number },
                          i: number
                        ) => (
                          <tr key={i}>
                            <td className="px-2 py-1 border-b border-neutral-800">
                              {ex.exercise}
                            </td>
                            <td className="px-2 py-1 border-b border-neutral-800">
                              {ex.sets}
                            </td>
                            <td className="px-2 py-1 border-b border-neutral-800">
                              {ex.reps}
                            </td>
                          </tr>
                        )
                      )
                    : null}
                </tbody>
              </table>
            </div>
          )}
          <Button
            size="sm"
            className="mt-2 w-24 h-8 text-sm font-medium"
            onClick={() => setSelected(null)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
