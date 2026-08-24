import { describe, expect, it } from "vitest";
import { calculateStreak, dateKey, emptyLog, latestMeasurement, weightAverage, workoutsThisWeek } from "@/lib/metrics";
import { buildCoachPrompt } from "@/lib/ai";

function log(date: string, weight: number | null = null) { return { ...emptyLog(date), weight }; }

describe("fitness metrics", () => {
  it("uses local calendar dates", () => { expect(dateKey(new Date(2026, 7, 4, 23, 59))).toBe("2026-08-04"); });
  it("calculates a seven-day weight average without missing values", () => {
    expect(weightAverage([log("2026-08-22", 80), log("2026-08-23"), log("2026-08-24", 79)], 7, new Date(2026, 7, 24))).toBe(79.5);
  });
  it("finds the latest waist measurement", () => {
    const first = { ...log("2026-08-20"), waist: 88 }; const second = { ...log("2026-08-23"), waist: 87.5 };
    expect(latestMeasurement([first, second], "waist")).toBe(87.5);
  });
  it("allows today's streak to continue from yesterday", () => {
    expect(calculateStreak([log("2026-08-22"), log("2026-08-23")], new Date(2026, 7, 24))).toBe(2);
  });
  it("counts workout entries in the current week", () => {
    const monday = { ...log("2026-08-24"), workouts: [{ id:"1", name:"深蹲", category:"strength" as const, sets:3, reps:5, weight:80, duration:null, intensity:"hard" as const }] };
    expect(workoutsThisWeek([monday], new Date(2026, 7, 24))).toBe(1);
  });
  it("tells the coach not to require calories or portions", () => {
    const prompt = buildCoachPrompt("fat_loss", [log("2026-08-24", 78)]);
    expect(prompt).toContain("不要猜测卡路里、份量、克数");
    expect(prompt).toContain("不能因为没有份量而称其“不完整”");
    expect(prompt).toContain("青菜、番茄");
  });
});
