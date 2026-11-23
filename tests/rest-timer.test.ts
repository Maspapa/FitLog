import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RestTimer } from "../components/rest-timer";
import { adjustRestTime, clampTimerForActions, clampTimerPosition, parseTimerPosition, remainingSeconds, satellitePositions, shouldAutoStart, TIMER_ACTION_SIZE, TIMER_BUBBLE_SIZE, TIMER_RING_INSET } from "../lib/rest-timer";

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

describe("auto start on collapse", () => {
  const fresh = { done: false, running: false, remaining: 60, duration: 60 };
  it("starts only a timer that was never started", () => {
    expect(shouldAutoStart(fresh)).toBe(true);
    expect(shouldAutoStart({ ...fresh, remaining: 90, duration: 90 })).toBe(true);
  });
  it("leaves a running, paused or finished timer alone", () => {
    expect(shouldAutoStart({ ...fresh, running: true })).toBe(false);
    expect(shouldAutoStart({ ...fresh, remaining: 30 })).toBe(false);
    expect(shouldAutoStart({ ...fresh, done: true, remaining: 0 })).toBe(false);
    expect(shouldAutoStart({ ...fresh, remaining: 0, duration: 0 })).toBe(false);
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
  it("shows the remaining time on the bubble even before it starts", () => {
    const html = renderToStaticMarkup(createElement(RestTimer));
    expect(html).toContain('class="rest-timer-bubble-time"');
    expect(html).toContain("01:00");
    expect(html).not.toContain("rest-timer-icon");
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
  it("puts minus, plus, reset and start in the four corners around the bubble", () => {
    const center = { x: 160, y: 400 };
    const actions = satellitePositions(center, viewport);
    const cx = center.x + TIMER_BUBBLE_SIZE / 2, cy = center.y + TIMER_BUBBLE_SIZE / 2;
    expect(actions.minus.x).toBeLessThan(cx); expect(actions.minus.y).toBeLessThan(cy);
    expect(actions.plus.x).toBeGreaterThan(cx); expect(actions.plus.y).toBeLessThan(cy);
    expect(actions.reset.x).toBeLessThan(cx); expect(actions.reset.y).toBeGreaterThan(cy);
    expect(actions.start.x).toBeGreaterThan(cx); expect(actions.start.y).toBeGreaterThan(cy);
  });
  it("moves the bubble inward so the whole ring stays visible", () => {
    expect(TIMER_RING_INSET).toBe(45);
    expect(clampTimerForActions({ x: 12, y: 12 }, viewport)).toEqual({ x: 45, y: 45 });
    const roomy = clampTimerForActions({ x: 200, y: 400 }, viewport);
    expect(roomy).toEqual({ x: 200, y: 400 });
    const corner = clampTimerForActions({ x: 12, y: 12 }, viewport);
    for (const point of Object.values(satellitePositions(corner, viewport))) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeGreaterThanOrEqual(0);
    }
  });
  it("keeps every ring button inside a small viewport near the corner", () => {
    const small = { x: 0, y: 0, width: 320, height: 300 };
    for (const point of Object.values(satellitePositions({ x: 252, y: 232 }, small))) {
      expect(point.x).toBeGreaterThanOrEqual(8);
      expect(point.x + TIMER_ACTION_SIZE).toBeLessThanOrEqual(small.width - 8);
      expect(point.y).toBeGreaterThanOrEqual(8);
      expect(point.y + TIMER_ACTION_SIZE).toBeLessThanOrEqual(small.height - 8);
    }
  });
  it("restores only valid saved positions and tolerates unavailable storage", () => {
    expect(parseTimerPosition('{"x":20,"y":40}')).toEqual({ x: 20, y: 40 });
    for (const value of [null, "invalid", "null", "[]", '{"x":"20","y":40}', '{"x":1e999,"y":40}', '{"x":20}']) {
      expect(parseTimerPosition(value)).toBeNull();
    }
  });
});
