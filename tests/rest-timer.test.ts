import { describe, expect, it } from "vitest";
import { remainingSeconds } from "../lib/rest-timer";

describe("rest timer deadline", () => {
  it("counts full and partial seconds without ending early", () => {
    expect(remainingSeconds(90_000, 0)).toBe(90);
    expect(remainingSeconds(90_000, 1)).toBe(90);
    expect(remainingSeconds(90_000, 89_999)).toBe(1);
  });
  it("catches up after a background tab delay", () => {
    expect(remainingSeconds(90_000, 76_200)).toBe(14);
  });
  it("finishes at the deadline and never becomes negative", () => {
    expect(remainingSeconds(60_000, 60_000)).toBe(0);
    expect(remainingSeconds(60_000, 180_000)).toBe(0);
  });
});
