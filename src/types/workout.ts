export interface Exercise {
  exercise: string;
  sets: number;
  reps: number;
}

export interface WorkoutPlan {
  title: string;
  exercises: Exercise[];
}

export interface Workout {
  date: string;
  plan: string | WorkoutPlan;
}
