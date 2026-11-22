import type { DailyLog, Workout } from "./schemas";
import type { PlanExercise, TrainingDay } from "./training-plan";

export type WorkoutNumbers = Pick<Workout, "sets" | "reps" | "weight" | "duration">;

/** Use the previous session on this weekday; retain the default plan without history. */
export function planFromLastSession(day: TrainingDay, logs: DailyLog[], before: string) {
  const main = day.exercises.filter((item) => item.phase === "main");
  const choices = [...main, ...day.alternatives.filter((item) => item.phase === "main")];
  const names = new Map(choices.map((item) => [item.name.trim(), item]));
  const nonMainNames = new Set([...day.exercises, ...day.alternatives].filter((item) => item.phase !== "main").map((item) => item.name.trim()));
  const weekday = { monday: 1, wednesday: 3, friday: 5 }[day.id];
  const previous = [...logs].filter((log) => log.date < before && new Date(`${log.date}T12:00:00`).getDay() === weekday)
    .sort((a, b) => b.date.localeCompare(a.date))
    .find((log) => log.workouts.some((workout) => workout.name.trim() && !nonMainNames.has(workout.name.trim())));
  if (!previous) return { main, alternatives: day.alternatives, date: null };
  const seen = new Set<string>();
  const performed: PlanExercise[] = [];
  for (const workout of previous.workouts) {
    const name = workout.name.trim();
    if (!name || seen.has(name) || nonMainNames.has(name)) continue;
    seen.add(name);
    performed.push(names.get(name) ?? {
      id: `history-${encodeURIComponent(name)}`, name, phase: "main", historicalOnly: true,
      englishName: "", dose: "", target: "", equipment: "未知", setup: "", steps: [], cues: [], mistake: "", safety: "",
      diagram: workout.category === "cardio" ? "cardio" : "push",
    });
  }
  return {
    main: performed,
    alternatives: [...day.alternatives.filter((item) => item.phase !== "main"), ...choices.filter((item) => !seen.has(item.name.trim()))],
    date: previous.date,
  };
}

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
    // 计划只提供首次记录的建议值；已有历史时原样沿用，不按计划截断实际组数。
    sets: previous ? previous.sets : item.log?.sets ?? null,
    reps: previous ? previous.reps : item.log?.reps ?? null,
    weight: previous?.weight ?? null, duration: previous?.duration ?? null, intensity: null,
  };
}
