"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface WorkoutPlan {
  header: string[];
  dataRows: string[][];
}

interface WorkoutPlanContextType {
  plan: WorkoutPlan | null;
  setPlan: (plan: WorkoutPlan | null) => void;
}

const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(
  undefined
);

export function WorkoutPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  return (
    <WorkoutPlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </WorkoutPlanContext.Provider>
  );
}

export function useWorkoutPlan() {
  const context = useContext(WorkoutPlanContext);
  if (!context) {
    throw new Error("useWorkoutPlan must be used within a WorkoutPlanProvider");
  }
  return context;
}
