import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TrainingPlan } from "../components/training-plan";
import { emptyLog, dateKey } from "../lib/metrics";
import { DailyLogSchema, FitDataSchema } from "../lib/schemas";
import { formatStartTime, recordTrainingStart } from "../lib/training-session";

const entry = { id: "w1", name: "深蹲", category: "strength" as const, sets: 3, reps: 5, weight: 60, duration: null, intensity: null };

describe("training start time", () => {
  it("records the current instant and keeps the rest of the day untouched", () => {
    const log = { ...emptyLog("2026-11-22"), weight: 70.5, workouts: [entry] };
    const now = new Date(2026, 10, 22, 7, 12, 30);
    const next = recordTrainingStart(log, now);
    expect(next.startedAt).toBe(now.toISOString());
    expect(next.updatedAt).toBe(now.toISOString());
    expect(next.weight).toBe(70.5);
    expect(next.workouts).toEqual([entry]);
    expect(log.startedAt).toBeNull();
  });

  it("stores only a start point, with no end time", () => {
    const next = recordTrainingStart(emptyLog("2026-11-22"), new Date(2026, 10, 22, 7, 12));
    expect(next.startedAt).not.toBeNull();
    expect(Object.keys(next)).not.toContain("endedAt");
    expect(Object.keys(next).filter((key) => /end/i.test(key))).toHaveLength(0);
  });

  it("shows the recorded instant as local 24-hour time", () => {
    expect(formatStartTime(new Date(2026, 10, 22, 7, 5).toISOString())).toBe("07:05");
    expect(formatStartTime(new Date(2026, 10, 22, 19, 40).toISOString())).toBe("19:40");
    expect(formatStartTime(null)).toBe("");
    expect(formatStartTime("not-a-time")).toBe("");
  });

  it("keeps records saved before this field existed", () => {
    const legacy: Record<string, unknown> = { ...emptyLog("2026-11-20") };
    delete legacy.startedAt;
    expect(DailyLogSchema.parse(legacy).startedAt).toBeNull();
    expect(DailyLogSchema.parse({ ...legacy, startedAt: "2026-11-20T10:43:36.642Z" }).startedAt).toBe("2026-11-20T10:43:36.642Z");
  });

  it("survives a full round trip through the stored data schema", () => {
    const saved = recordTrainingStart(emptyLog("2026-11-22"), new Date(2026, 10, 22, 7, 12));
    const data = FitDataSchema.parse({ version: 1, profile: { goal: "fat_loss", createdAt: "2026-11-01T00:00:00.000Z" }, logs: [saved] });
    expect(data.logs[0].startedAt).toBe(saved.startedAt);
  });
});

describe("plan header start button", () => {
  const render = (selectedDate: string, startedAt: string | null) => renderToStaticMarkup(createElement(TrainingPlan, {
    selectedDate, logs: [], saving: false, startedAt, onStartTraining: () => undefined, onAddExercises: async () => true,
  }));

  it("offers the start button on today and shows the recorded time afterwards", () => {
    const before = render(dateKey(), null);
    expect(before).toContain("还没记录开始时间");
    expect(before).toContain(">开始训练<");
    const after = render(dateKey(), new Date(2026, 10, 22, 7, 12).toISOString());
    expect(after).toContain("07:12 开始训练");
    expect(after).toContain(">更新开始时间<");
  });

  it("keeps the button off a past day being reviewed", () => {
    const past = render("2026-11-01", null);
    expect(past).not.toContain("还没记录开始时间");
    expect(past).not.toContain("更新开始时间");
  });
});