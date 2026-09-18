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
  it("only sends exercise and measurements to the coach, even for old records", () => {
    const old = { ...log("2026-08-24", 78), waist: 85, meals: { breakfast: "历史早餐", lunch: "", dinner: "", snacks: "" }, sleepHours: 7, notes: "历史备注" };
    const prompt = buildCoachPrompt("fat_loss", [old]);
    expect(prompt).toContain("用户只记录运动、体重和腰围");
    expect(prompt).toContain("都是选填");
    expect(prompt).toContain('"weight":78');
    expect(prompt).toContain('"waist":85');
    for (const field of ["meals", "sleepHours", "fatigue", "mood", "soreness", "steps", "waterGlasses", "alcohol", "notes", "intensity"]) expect(prompt).not.toContain('"' + field + '":');
    expect(prompt).not.toContain("历史早餐");
    expect(prompt).not.toContain("历史备注");
  });
});
