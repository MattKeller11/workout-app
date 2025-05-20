"use client";

import { useState, useActionState, useEffect } from "react";
import { getGroqResultAction } from "@/app/actions/groqAction";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useWorkoutPlan } from "@/app/workout/WorkoutPlanContext";
import { useFormStatus } from "react-dom";

function parseGroqResponse(
  response: string
): { header: string[]; dataRows: string[][] } | null {
  // Simple parser: expects response in a markdown or text table format
  // Example: Exercise | Sets | Reps\n---|---|---\nBench Press | 3 | 10\n...
  const lines = response.split("\n").filter(Boolean);
  if (lines.length < 2) return null;
  // Find header and data rows
  const header = lines[0].split("|").map((h) => h.trim());
  // Skip the separator row (usually dashes) and any empty lines
  const dataRows = lines
    .slice(1)
    .filter((line) => !/^[-|\s]+$/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()));
  if (!dataRows.length) return null;
  return { header, dataRows };
}

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getGroqResultAction, "");
  const [parsed, setParsed] = useState<{
    header: string[];
    dataRows: string[][];
  } | null>(null);
  const router = useRouter();
  const { setPlan, plan } = useWorkoutPlan();

  // Parse response when state changes
  useEffect(() => {
    if (state) {
      const parsedResult = parseGroqResponse(state);
      setParsed(
        parsedResult && parsedResult.dataRows.length ? parsedResult : null
      );
    }
  }, [state]);

  // Show the last parsed plan if it exists, even if the user navigates back from /workout
  useEffect(() => {
    if (!parsed && plan) {
      setParsed(plan);
    }
  }, [parsed, plan]);

  function handleStartWorkout() {
    if (!parsed) return;
    setPlan(parsed);
    router.push("/workout");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <form
          action={formAction}
          className="flex flex-col gap-4 w-full max-w-xl"
        >
          <label htmlFor="userMessage" className="font-semibold">
            Provide muscle groups:
          </label>
          <input
            id="userMessage"
            name="userMessage"
            type="text"
            required
            className="border rounded px-3 py-2 text-base w-full"
            placeholder="Lets get it!"
          />
          <GenerateButton />
        </form>
        {parsed ? (
          <div className="mt-4 p-4 border rounded bg-neutral-900 text-neutral-100 max-w-xl shadow-lg w-full">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {parsed.header.map((h, i) => (
                    <th
                      key={i}
                      className="px-2 py-1 font-bold border-b border-neutral-700"
                    >
                      {h.replace(/\*\*(.*?)\*\*/g, "$1")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.dataRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-2 py-1 border-b border-neutral-800"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              className="mt-6 w-full"
              onClick={handleStartWorkout}
              type="button"
            >
              Start Workout
            </Button>
          </div>
        ) : state ? (
          <div className="mt-4 p-4 border rounded bg-neutral-900 text-neutral-100 max-w-xl shadow-lg">
            {state}
          </div>
        ) : null}
      </main>
    </div>
  );
}
