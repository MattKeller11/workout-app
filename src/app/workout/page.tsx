"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParsedWorkoutPlan } from "@/lib/useParsedWorkoutPlan";
import { WorkoutPlanTable } from "./WorkoutPlanTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CompletionCheckAnimation } from "./CompletionCheckAnimation";
import { useCompleteWorkout } from "./useCompleteWorkout";
import { Workout } from "@/types/workout";

export default function WorkoutChecklist() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [showMustCheckMsg, setShowMustCheckMsg] = useState(false);
  const {
    completing,
    error: completeError,
    completeWorkout,
    setError: setCompleteError,
    setSuccess: setCompleteSuccess,
  } = useCompleteWorkout();
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    const local =
      typeof window !== "undefined"
        ? localStorage.getItem("currentWorkout")
        : null;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setWorkout(parsed);
      } catch {
        setWorkout(null);
      }
    } else {
      router.replace("/");
    }
  }, [router]);

  const parsedPlan = useParsedWorkoutPlan(workout);

  useEffect(() => {
    if (parsedPlan) {
      setChecked(parsedPlan.exercises.map(() => false));
    }
  }, [parsedPlan]);

  function handleCheck(idx: number, value: boolean) {
    setChecked((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setShowMustCheckMsg(false);
  }

  async function handleCompleteWorkout() {
    if (!workout || !parsedPlan) return;
    if (!checked.some(Boolean)) {
      setShowMustCheckMsg(true);
      return;
    }

    // Filter exercises where checked is true
    const completedExercises = parsedPlan.exercises.filter(
      (_, idx) => checked[idx]
    );

    // Create updated workout with filtered exercises
    const updatedWorkout: Workout = {
      date: workout.date,
      plan: {
        title: parsedPlan.title,
        exercises: completedExercises,
      },
    };

    // Pass to completeWorkout
    await completeWorkout(updatedWorkout);

    if (!completeError && !completing) {
      setShowSuccessAnim(true);
    }
  }

  // Hide the workout page content while the animation is showing
  if (showSuccessAnim) {
    // Trigger navigation after a delay, but do NOT set showSuccessAnim to false until after navigation
    setTimeout(() => {
      router.replace("/");
    }, 1500); // match animation duration
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950">
        <CompletionCheckAnimation onDone={() => {}} />
      </div>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-neutral-950">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-xl p-6 mb-8 border border-neutral-800">
        {parsedPlan ? (
          <WorkoutPlanTable
            plan={parsedPlan}
            checked={checked}
            onCheck={handleCheck}
          />
        ) : (
          <div className="prose prose-invert w-full max-w-none text-neutral-100 mb-4">
            <pre className="whitespace-pre-wrap">
              {typeof workout?.plan === "string"
                ? workout.plan
                : JSON.stringify(workout?.plan, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full max-w-2xl justify-center px-0">
        <Button
          onClick={handleCompleteWorkout}
          className="mb-0 w-full h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
          disabled={completing || showSuccessAnim}
        >
          {completing ? "Completing..." : "Complete Workout"}
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="mb-0 w-full h-12 text-lg font-semibold tracking-wide rounded-lg shadow-md transition-colors duration-150"
          variant="secondary"
        >
          Back to Plan
        </Button>
      </div>
      {showSuccessAnim && (
        <CompletionCheckAnimation
          onDone={() => {
            setShowSuccessAnim(false);
            setCompleteSuccess(false);
            router.push("/");
          }}
        />
      )}
      <Dialog open={showMustCheckMsg} onOpenChange={setShowMustCheckMsg}>
        <DialogContent className="bg-yellow-900 text-yellow-100 rounded-md shadow-md p-4 max-w-xs w-full flex flex-col items-center border-0">
          <DialogTitle className="text-base font-semibold mb-1 text-center p-0">
            Action Required
          </DialogTitle>
          <div className="text-sm mb-1 text-center p-0">
            Please check off at least one exercise before completing your
            workout.
          </div>
          <Button
            size="sm"
            className="mt-2 w-24 h-8 text-sm font-medium"
            onClick={() => setShowMustCheckMsg(false)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!completeError}
        onOpenChange={(v) => {
          if (!v) setCompleteError(null);
        }}
      >
        <DialogContent className="bg-red-900 text-red-100 rounded-md shadow-md p-4 max-w-xs w-full flex flex-col items-center border-0">
          <DialogTitle className="text-base font-semibold mb-1 text-center p-0">
            Error
          </DialogTitle>
          <div className="text-sm mb-1 text-center p-0">{completeError}</div>
          <Button
            size="sm"
            className="mt-2 w-24 h-8 text-sm font-medium"
            onClick={() => setCompleteError(null)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
