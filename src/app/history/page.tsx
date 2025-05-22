"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkoutPlan } from "@/lib/types";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryItem {
  id: string;
  date: string;
  plan: WorkoutPlan;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <PageContainer>
      <div className="w-full flex flex-col gap-0 mb-8">
        <h1 className="text-xl font-bold mb-4 text-green-400 text-center">
          Workout History
        </h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-300">
            Loading...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            No workouts found.
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((item) => {
              const exerciseCount = Array.isArray(item.plan?.exercises)
                ? item.plan.exercises.length
                : 0;
              return (
                <Card
                  key={item.id}
                  className="w-full cursor-pointer hover:border-green-400 focus-within:border-green-400 transition-colors outline-none"
                  tabIndex={0}
                  onClick={() => setSelected(item)}
                  aria-label={`View details for ${
                    item.plan &&
                    typeof item.plan === "object" &&
                    "title" in item.plan
                      ? item.plan.title
                      : "Untitled"
                  }`}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelected(item);
                    }
                  }}
                >
                  <CardContent className="flex flex-row items-center justify-center text-center divide-x divide-neutral-800 px-0 py-2 h-6">
                    <span className="flex-1 px-2 text-xs text-neutral-400 font-mono truncate">
                      {item.date
                        ? new Date(item.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })
                        : "-"}
                    </span>
                    <span className="flex-1 px-2 font-medium text-sm text-neutral-100 truncate">
                      {item.plan &&
                      typeof item.plan === "object" &&
                      "title" in item.plan
                        ? item.plan.title
                        : "Untitled"}
                    </span>
                    <span className="flex-1 px-2 text-xs text-green-300 font-semibold truncate">
                      {exerciseCount} ex
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-neutral-900 text-neutral-100 rounded-md shadow-md">
          {selected && (
            <>
              <DialogHeader className="p-0 mb-2">
                <DialogTitle asChild>
                  <span className="w-full font-semibold text-base text-green-400 truncate text-center px-2 block">
                    {selected.plan &&
                    typeof selected.plan === "object" &&
                    "title" in selected.plan
                      ? selected.plan.title
                      : "Untitled"}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto">
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
                            ex: {
                              exercise: string;
                              sets: number;
                              reps: number;
                            },
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default HistoryPage;
