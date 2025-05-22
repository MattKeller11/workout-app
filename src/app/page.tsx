"use client";

import { useActionState } from "react";
import { getGroqResultAction } from "@/app/actions/groqAction";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { WorkoutPlan, isNormalExercise } from "@/lib/types";
import { MountainTitle } from "../components/MountainTitle";
import PageContainer from "@/components/PageContainer";

export const GenerateButton = () => {
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
};

export default function Home() {
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

  const handleStartWorkout = async () => {
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
  };

  return (
    <PageContainer>
      <header className="w-full flex flex-col items-center gap-2 mb-6 relative">
        <div className="relative w-full flex flex-col items-center justify-center">
          <MountainTitle />
        </div>
      </header>
      <main className="flex flex-col w-full items-center pb-8">
        {/* Tab Content */}
        <>
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
          {!state && <div className="h-24" />}
          {parsedPlan && (
            <div className="w-full bg-neutral-900 rounded-xl shadow-lg p-6 border border-neutral-800 flex flex-col items-center mt-2">
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
        </>
      </main>
    </PageContainer>
  );
}
