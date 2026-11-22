import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RestTimer } from "../components/rest-timer";
import { adjustRestTime, clampTimerPosition, parseTimerPosition, remainingSeconds, timerPanelPosition } from "../lib/rest-timer";

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

describe("adjustable rest duration", () => {
  const idle = { duration: 60, remaining: 60, deadline: null, done: false };
  it("adds and subtracts 30 seconds before starting", () => {
    expect(adjustRestTime(idle, 30, 0)).toEqual({ ...idle, duration: 90, remaining: 90 });
    expect(adjustRestTime(idle, -30, 0)).toEqual({ ...idle, duration: 30, remaining: 30 });
  });
  it("does not reduce the configured duration below 30 seconds", () => {
    const minimum = { ...idle, duration: 30, remaining: 10 };
    expect(adjustRestTime(minimum, -30, 0)).toEqual(minimum);
  });
  it("extends a running deadline without pausing or losing partial seconds", () => {
    expect(adjustRestTime({ ...idle, remaining: 40, deadline: 60_000 }, 30, 20_250))
      .toEqual({ duration: 90, remaining: 70, deadline: 90_000, done: false });
  });
  it("shortens a running timer and catches up with a stale display", () => {
    expect(adjustRestTime({ ...idle, remaining: 60, deadline: 60_000 }, -30, 20_250))
      .toEqual({ duration: 30, remaining: 10, deadline: 30_000, done: false });
  });
  it("finishes when subtraction uses up the remaining time", () => {
    expect(adjustRestTime({ ...idle, remaining: 10, deadline: 60_000 }, -30, 50_000))
      .toEqual({ duration: 30, remaining: 0, deadline: null, done: true });
  });
  it("adjusts a paused timer without starting it", () => {
    expect(adjustRestTime({ ...idle, remaining: 20 }, 30, 0))
      .toEqual({ duration: 90, remaining: 50, deadline: null, done: false });
  });
  it("prepares a new duration after completion without automatically starting", () => {
    expect(adjustRestTime({ ...idle, remaining: 0, done: true }, 30, 0))
      .toEqual({ duration: 90, remaining: 90, deadline: null, done: false });
  });
});

describe("floating rest timer", () => {
  const viewport = { x: 0, y: 0, width: 390, height: 844 };
  it("renders only an accessible compact bubble until opened", () => {
    const html = renderToStaticMarkup(createElement(RestTimer));
    expect(html).toContain('class="rest-timer-bubble"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("展开休息计时器");
    expect(html).not.toContain('class="rest-timer-panel"');
    expect(html).not.toContain("开启通知");
  });
  it("allows free movement inside the screen and clamps every edge", () => {
    expect(clampTimerPosition({ x: 150, y: 200 }, viewport)).toEqual({ x: 150, y: 200 });
    expect(clampTimerPosition({ x: -100, y: -100 }, viewport)).toEqual({ x: 12, y: 12 });
    expect(clampTimerPosition({ x: 9999, y: 9999 }, viewport)).toEqual({ x: 322, y: 776 });
  });
  it("keeps the bubble reachable after rotation or opening a keyboard", () => {
    expect(clampTimerPosition({ x: 900, y: 700 }, { x: 0, y: 0, width: 320, height: 300 })).toEqual({ x: 252, y: 232 });
    expect(clampTimerPosition({ x: 0, y: 0 }, { x: 100, y: 200, width: 320, height: 300 })).toEqual({ x: 112, y: 212 });
  });
  it("places the panel above the bubble when there is room, otherwise below", () => {
    const size = { width: 300, height: 240 };
    expect(timerPanelPosition({ x: 322, y: 776 }, viewport, size)).toEqual({ x: 78, y: 524 });
    expect(timerPanelPosition({ x: 12, y: 12 }, viewport, size)).toEqual({ x: 12, y: 80 });
  });
  it("clamps a tall expanded panel to a small visible viewport", () => {
    expect(timerPanelPosition({ x: 250, y: 100 }, { x: 0, y: 0, width: 320, height: 300 }, { width: 296, height: 276 })).toEqual({ x: 12, y: 12 });
  });
  it("restores only valid saved positions and tolerates unavailable storage", () => {
    expect(parseTimerPosition('{"x":20,"y":40}')).toEqual({ x: 20, y: 40 });
    for (const value of [null, "invalid", "null", "[]", '{"x":"20","y":40}', '{"x":1e999,"y":40}', '{"x":20}']) {
      expect(parseTimerPosition(value)).toBeNull();
    }
  });
});
