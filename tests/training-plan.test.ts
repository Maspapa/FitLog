import { describe, expect, it } from "vitest";
import { lyftaExerciseMedia, lyftaExerciseUrl } from "../lib/lyfta-links";
import { TRAINING_DAYS } from "../lib/training-plan";
import { GYM_EQUIPMENT, GYM_EQUIPMENT_NOTES } from "../lib/gym-equipment";
import { buildCoachPrompt } from "../lib/ai";

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

  it("offers warm-up, machine and stretch replacements without inflating the base workout", () => {
    for (const day of TRAINING_DAYS) {
      expect(day.alternatives.length).toBeGreaterThanOrEqual(8);
      expect(day.exercises.filter((item) => item.phase === "main").length).toBeLessThanOrEqual(5);
      for (const phase of ["warmup", "main", "stretch"] as const) {
        expect(day.alternatives.filter((item) => item.phase === phase).length).toBeGreaterThanOrEqual(3);
      }
      expect(day.alternatives.filter((item) => item.phase === "main").every((item) => item.log)).toBe(true);
      expect(day.alternatives.filter((item) => item.phase !== "main").every((item) => !item.log)).toBe(true);
    }
  });

  it("uses only confirmed equipment in every phase, including alternatives", () => {
    const allowed = new Set<string>([...GYM_EQUIPMENT, "无需器械"]);
    for (const day of TRAINING_DAYS) {
      const all = [...day.exercises, ...day.alternatives];
      for (const item of all) {
        expect(allowed.has(item.equipment), `${item.id}: ${item.equipment}`).toBe(true);
        expect(JSON.stringify(item)).not.toMatch(/自行车|哈克|提踵机|弹力带|长凳|平凳|上斜凳|瑜伽垫/);
      }
      const cardio = all.filter((item) => item.diagram === "cardio");
      expect(cardio.every((item) => ["跑步机", "椭圆机"].includes(item.equipment))).toBe(true);
    }
  });

  it("passes the same complete equipment inventory and fixed schedule to the coach", () => {
    const prompt = buildCoachPrompt("fat_loss", []);
    expect(prompt).toContain(GYM_EQUIPMENT_NOTES);
    for (const equipment of GYM_EQUIPMENT) expect(prompt).toContain(equipment);
    expect(prompt).toContain("周一练胸与推、周三练腿与臀、周五练背与肩");
    expect(prompt).toContain("有氧热身只用跑步机或椭圆机");
    expect(prompt).toContain("旧记录里出现清单外器械，也不能据此推荐继续使用");
  });

  it("matches the photographed combination machines rather than assuming seated arm machines", () => {
    const all = TRAINING_DAYS.flatMap((day) => [...day.exercises, ...day.alternatives]);
    const arms = all.filter((item) => item.equipment === "二头/三头绳索训练站");
    expect(arms).toHaveLength(2);
    expect(arms.map((item) => item.englishName)).toEqual(["Triceps pushdown", "Cable curl"]);
    for (const arm of arms) {
      expect(arm.setup).toContain("站");
      expect(arm.setup).not.toMatch(/座椅|支撑垫|转轴/);
      expect(lyftaExerciseMedia(arm.englishName).video).toContain("Cable-");
    }
    expect(all.filter((item) => item.equipment === "双臂外展训练机").map((item) => item.englishName)).toEqual(["Machine fly", "Reverse pec deck"]);
    expect(new Set(all.filter((item) => item.equipment === "高拉/低拉划船机").map((item) => item.englishName))).toEqual(new Set(["Lat pulldown", "Seated cable row"]));
    expect(GYM_EQUIPMENT).toContain("史密斯机");
    expect(GYM_EQUIPMENT).not.toContain("史密斯推肩机");
    expect(GYM_EQUIPMENT).toContain("罗马椅");
    expect(GYM_EQUIPMENT).toContain("反向挺身机");
    expect(GYM_EQUIPMENT).toContain("腹部/背部训练器");
  });

  it("pairs Friday pulldowns with rows without adding training volume", () => {
    const friday = TRAINING_DAYS.find((day) => day.id === "friday")!;
    const main = friday.exercises.filter((item) => item.phase === "main");
    expect(main.map((item) => item.englishName)).toEqual(["Lat pulldown", "Lever row", "Cable face pull", "Dumbbell lateral raise", "Cable curl"]);
    expect(main.map((item) => item.log?.sets)).toEqual([3, 3, 2, 2, 2]);
    expect(friday.exercises.some((item) => item.phase === "warmup" && item.englishName === "Lat pulldown")).toBe(true);
    expect(friday.alternatives.some((item) => item.englishName === "Lever high row" && item.phase === "main")).toBe(true);
  });

  it("provides matching exercise guides, allowing explicit text-only guides", () => {
    const exercises = TRAINING_DAYS.flatMap((day) => [...day.exercises, ...day.alternatives]);
    let videoCount = 0;
    for (const item of exercises) {
      const url = new URL(lyftaExerciseUrl(item.englishName));
      expect(["https://www.lyfta.app", "https://shop.lifefitness.com"]).toContain(url.origin);
      expect(url.pathname).toMatch(/^\/(exercise|products)\/[a-z0-9-]+$/);
      const media = lyftaExerciseMedia(item.englishName);
      if (!["Smith incline push-up", "D.Y. row"].includes(item.englishName)) {
        expect(media.video || media.poster, item.englishName).toBeTruthy();
      }
      if (media.video) {
        expect(new URL(media.video).hostname).toBe("apilyfta.com");
        videoCount += 1;
      }
    }
    expect(videoCount).toBeGreaterThan(40);
  });
});
