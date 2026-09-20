import { describe, expect, it } from "vitest";
import { emptyLog } from "../lib/metrics";
import { lastWorkout, workoutFromPlan, workoutSummary, mergePlanWorkouts } from "../lib/workout-history";
import { TRAINING_DAYS } from "../lib/training-plan";

const item = TRAINING_DAYS[0].exercises.find((item) => item.phase === "main")!;
const workout = { id: "old", name: item.name, category: "strength" as const, sets: 4, reps: 10, weight: 25, duration: null, intensity: null };
const record = (date: string, weight = 25) => ({ ...emptyLog(date), workouts: [{ ...workout, weight }] });

describe("exercise history quick add", () => {
  it("adds entered numbers and updates today's existing entry without duplicates", () => {
    const values = { sets: 2, reps: 9, weight: 0, duration: null };
    const added = mergePlanWorkouts([], [item], [], "2026-09-20", { [item.id]: values });
    expect(added.workouts[0]).toMatchObject(values);
    const updated = mergePlanWorkouts(added.workouts, [item], [], "2026-09-20", { [item.id]: { ...values, weight: 30 } });
    expect(updated.workouts).toHaveLength(1);
    expect(updated.workouts[0]).toMatchObject({ id: added.workouts[0].id, weight: 30 });
    expect(added.workouts[0].weight).toBe(0);
    expect(mergePlanWorkouts(updated.workouts, [item], [], "2026-09-20").changed).toBe(0);
  });
  it("never copies historical load into warm-up sets", () => {
    const warmup = TRAINING_DAYS[0].exercises.find((exercise) => exercise.phase === "warmup")!;
    const log = { ...record("2026-09-16"), workouts: [{ ...workout, name: warmup.name }] };
    expect(workoutFromPlan(warmup, [log], "2026-09-18")).toMatchObject({ weight: null, sets: null, reps: null });
  });
  it("finds the latest matching past date, excluding today and future records", () => {
    const logs = [record("2026-09-18", 99), record("2026-09-10"), record("2026-09-20", 100), record("2026-09-16", 30)];
    expect(lastWorkout(logs, item.name, "2026-09-18")?.workout.weight).toBe(30);
    expect(lastWorkout(logs, "其他动作", "2026-09-18")).toBeNull();
    expect(logs[0].date).toBe("2026-09-18");
  });
  it("copies the previous values with a new id and does not mutate history", () => {
    const logs = [record("2026-09-16")];
    const added = workoutFromPlan(item, logs, "2026-09-18");
    expect(added).toMatchObject({ sets: 4, reps: 10, weight: 25, duration: null });
    expect(added.id).not.toBe("old");
    expect(logs[0].workouts[0].id).toBe("old");
  });
  it("preserves missing values and zero rather than replacing them with suggested values", () => {
    const log = { ...record("2026-09-16"), workouts: [{ ...workout, sets: null, reps: null, weight: 0 }] };
    expect(workoutFromPlan(item, [log], "2026-09-18")).toMatchObject({ sets: null, reps: null, weight: 0 });
    expect(workoutSummary(log.workouts[0])).toBe("0 kg");
  });
  it("uses plan defaults only without history and supports cardio duration", () => {
    expect(workoutFromPlan(item, [], "2026-09-18")).toMatchObject({ sets: item.log?.sets, reps: item.log?.reps, weight: null });
    const cardio = { ...TRAINING_DAYS[0].alternatives.find((item) => item.diagram === "cardio")!, phase: "main" as const };
    const log = { ...emptyLog("2026-09-16"), workouts: [{ ...workout, name: cardio.name, category: "cardio" as const, sets: null, reps: null, weight: null, duration: 20 }] };
    expect(workoutFromPlan(cardio, [log], "2026-09-18")).toMatchObject({ category: "cardio", duration: 20 });
    expect(workoutSummary(log.workouts[0])).toBe("20 分钟");
  });
});
