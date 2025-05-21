"use client";

import { useActionState } from "react";
import { getGroqResultAction } from "@/app/actions/groqAction";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { WorkoutPlan, isNormalExercise } from "@/lib/types";
import { MountainTitle } from "../components/MountainTitle";

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

export default function Home() {
  // UseActionState with a reducer that just returns the new state
  const [state, formAction] = useActionState<string | WorkoutPlan, FormData>(
    async (_prev: string | WorkoutPlan, formData: FormData) =>
      await getGroqResultAction("", formData),
    ""
  );
  const router = useRouter();

  const parsedPlan =
    state &&
    typeof state === "object" &&
    "title" in state &&
    "exercises" in state
      ? (state as WorkoutPlan)
      : null;
  const parseError = state && typeof state === "string";

  async function handleStartWorkout() {
    if (!parsedPlan) return;
    // Save the parsed plan to localStorage
    localStorage.setItem(
      "currentWorkout",
      JSON.stringify({
        date: new Date().toISOString(),
        plan: parsedPlan,
      })
    );
    router.push("/workout");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <header className="w-full max-w-xl flex flex-col items-center gap-2 mb-6 relative">
        <div className="relative w-full flex flex-col items-center justify-center">
          <MountainTitle />
        </div>
      </header>
      <main className="flex flex-col gap-8 w-full max-w-xl items-center">
        <form
          action={formAction}
          className="flex flex-col gap-4 w-full bg-neutral-900 rounded-xl shadow-lg p-6 border border-neutral-800 items-center"
        >
          <label
            htmlFor="userMessage"
            className="font-semibold text-neutral-200 text-center"
          >
            What do you want to train today?
          </label>
          <input
            id="userMessage"
            name="userMessage"
            type="text"
            required
            className="border border-neutral-700 rounded px-3 py-2 text-base w-full bg-neutral-950 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. Chest, Back, Legs, Full Body..."
            autoComplete="off"
          />
          <GenerateButton />
        </form>
        {/* History Link Card using shadcn Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/workout/history")}
          className="group flex items-center gap-3 px-5 py-3 mt-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-green-950/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ minWidth: 0 }}
          aria-label="View workout history"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-400 group-hover:text-green-300 transition-colors"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
          </svg>
          <span className="text-green-300 group-hover:text-green-200 font-medium text-base transition-colors">
            View Workout History
          </span>
        </Button>
        {/* Show animation if no plan is present */}
        {!state && <div className="h-24" />}
        {parsedPlan && (
          <div className="w-full bg-neutral-900 rounded-xl shadow-lg p-6 border border-neutral-800 flex flex-col items-center">
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: "#4ade80" }}
            >
              {parsedPlan.title}
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
                {parsedPlan.exercises.map((ex, i) => {
                  if (isNormalExercise(ex)) {
                    return (
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
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <Button
              className="mt-2 w-full"
              onClick={handleStartWorkout}
              type="button"
            >
              Start Workout
            </Button>
          </div>
        )}
        {parseError && (
          <div className="mt-4 p-4 border rounded bg-red-900 text-red-100 max-w-xl shadow-lg">
            Could not parse workout plan. Please try again.
          </div>
        )}
      </main>
    </div>
  );
}
