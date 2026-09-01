import { describe, expect, it } from "vitest";
import { TRAINING_DAYS } from "../lib/training-plan";

describe("beginner training plan", () => {
  it("covers the fixed Monday, Wednesday and Friday schedule", () => {
    expect(TRAINING_DAYS.map((day) => day.id)).toEqual(["monday", "wednesday", "friday"]);
    expect(TRAINING_DAYS.map((day) => day.title)).toEqual(["胸与推", "腿与臀", "背与肩"]);
  });

  it("includes warm-up, machine work and stretching every day", () => {
    for (const day of TRAINING_DAYS) {
      expect(new Set(day.exercises.map((item) => item.phase))).toEqual(new Set(["warmup", "main", "stretch"]));
      expect(day.exercises.filter((item) => item.phase === "main").length).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps every exercise instructional and every logged movement actionable", () => {
    const exercises = TRAINING_DAYS.flatMap((day) => [...day.exercises, ...day.alternatives]);
    expect(new Set(exercises.map((item) => item.id)).size).toBe(exercises.length);
    for (const item of exercises) {
      expect(item.setup.length, item.id).toBeGreaterThan(20);
      expect(item.steps.length).toBeGreaterThanOrEqual(3);
      expect(item.cues.length).toBeGreaterThanOrEqual(3);
      expect(item.mistake.length).toBeGreaterThan(15);
      expect(item.safety.length).toBeGreaterThan(10);
      if (item.phase === "main") {
        expect(item.log?.sets).toBeGreaterThanOrEqual(2);
        expect(item.guideUrl).toMatch(/^https:\/\//);
      }
    }
  });

  it("offers common replacement movements without inflating the base workout", () => {
    for (const day of TRAINING_DAYS) {
      expect(day.alternatives.length).toBeGreaterThanOrEqual(5);
      expect(day.exercises.filter((item) => item.phase === "main").length).toBeLessThanOrEqual(5);
      expect(day.alternatives.every((item) => item.phase === "main" && item.log)).toBe(true);
    }
  });
});
