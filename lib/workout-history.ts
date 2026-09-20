import type { DailyLog, Workout } from "./schemas";
import type { PlanExercise } from "./training-plan";

export type WorkoutNumbers = Pick<Workout, "sets" | "reps" | "weight" | "duration">;

export function mergePlanWorkouts(existing: Workout[], items: PlanExercise[], logs: DailyLog[], today: string, values: Record<string, WorkoutNumbers> = {}) {
  const workouts = existing.filter((workout) => workout.name.trim()).map((workout) => ({ ...workout }));
  let changed = 0;
  for (const item of items) {
    const index = workouts.findIndex((workout) => workout.name.trim() === item.name.trim());
    if (index >= 0) {
      if (values[item.id]) { workouts[index] = { ...workouts[index], ...values[item.id] }; changed++; }
    } else {
      workouts.push({ ...workoutFromPlan(item, logs, today), ...values[item.id] }); changed++;
    }
  }
  return { workouts, changed };
}

export function lastWorkout(logs: DailyLog[], name: string, before: string) {
  for (const log of [...logs].filter((log) => log.date < before).sort((a, b) => b.date.localeCompare(a.date))) {
    const workout = [...log.workouts].reverse().find((item) => item.name.trim() === name.trim());
    if (workout) return { date: log.date, workout };
  }
  return null;
}

export function workoutSummary(workout: Workout): string {
  const parts = [
    workout.sets !== null ? `${workout.sets} 组` : "",
    workout.reps !== null ? `${workout.reps} 次` : "",
    workout.weight !== null ? `${workout.weight} kg` : "",
    workout.duration !== null ? `${workout.duration} 分钟` : "",
  ].filter(Boolean);
  return parts.join(" · ") || "已记录动作，未填数值";
}

export function workoutFromPlan(item: PlanExercise, logs: DailyLog[], today: string): Workout {
  // 热身从轻重量开始，不自动复制历史负重。
  const previous = item.phase === "warmup" ? undefined : lastWorkout(logs, item.name, today)?.workout;
  return {
    id: crypto.randomUUID(), name: item.name,
    category: previous?.category ?? (item.diagram === "cardio" ? "cardio" : item.phase === "stretch" ? "mobility" : "strength"),
    sets: previous ? previous.sets : item.log?.sets ?? null,
    reps: previous ? previous.reps : item.log?.reps ?? null,
    weight: previous?.weight ?? null, duration: previous?.duration ?? null, intensity: null,
  };
}
