"use client";

import { useActionState } from "react";
import { getGroqResultAction } from "@/app/actions/groqAction";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

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
  type WorkoutPlan = {
    title: string;
    exercises: Array<{
      exercise: string;
      sets: number;
      reps: number;
    }>;
  };
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

  // Type guards
  function isNormalExercise(ex: unknown): ex is {
    exercise: string;
    sets: number;
    reps: number;
  } {
    return (
      typeof ex === "object" &&
      ex !== null &&
      "exercise" in ex &&
      "sets" in ex &&
      "reps" in ex
    );
  }

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
      <header className="w-full max-w-xl flex flex-col items-center gap-2 mt-8 mb-10">
        <h1
          className="text-4xl sm:text-5xl font-extrabold"
          style={{ color: "#4ade80" }}
        >
          Minimalist Workout
        </h1>
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
        {/* Show animation if no plan is present */}
        {!state && (
          <div className="flex flex-col items-center justify-center mt-40">
            {/* Animated dumbbell icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-dumbbell-icon lucide-dumbbell h-24 w-24 animate-bounce"
              style={{ color: "#4ade80" }}
            >
              <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
              <path d="m2.5 21.5 1.4-1.4" />
              <path d="m20.1 3.9 1.4-1.4" />
              <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
              <path d="m9.6 14.4 4.8-4.8" />
            </svg>
          </div>
        )}
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
