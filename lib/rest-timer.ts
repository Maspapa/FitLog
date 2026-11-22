/** Calculate from an absolute deadline so throttled tabs do not lose time. */
export function remainingSeconds(deadline: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function adjustRestTime(state: { duration: number; remaining: number; deadline: number | null; done: boolean }, delta: number, now = Date.now()) {
  const duration = Math.max(30, state.duration + delta);
  const change = duration - state.duration;
  if (change === 0) return state;
  if (state.done) return { duration, remaining: duration, deadline: null, done: false };
  const deadline = state.deadline === null ? null : Math.max(now, state.deadline) + change * 1000;
  const remaining = deadline === null ? Math.max(0, state.remaining + change) : remainingSeconds(deadline, now);
  return { duration, remaining, deadline: remaining === 0 ? null : deadline, done: remaining === 0 };
}

export type TimerPoint = { x: number; y: number };
export type TimerViewport = { x: number; y: number; width: number; height: number };
export const TIMER_BUBBLE_SIZE = 56;
const EDGE = 12;

export function clampTimerPosition(point: TimerPoint, viewport: TimerViewport): TimerPoint {
  return {
    x: Math.max(viewport.x + EDGE, Math.min(point.x, viewport.x + viewport.width - TIMER_BUBBLE_SIZE - EDGE)),
    y: Math.max(viewport.y + EDGE, Math.min(point.y, viewport.y + viewport.height - TIMER_BUBBLE_SIZE - EDGE)),
  };
}

export function parseTimerPosition(raw: string | null): TimerPoint | null {
  try {
    const value = JSON.parse(raw ?? "null");
    return typeof value?.x === "number" && Number.isFinite(value.x) && typeof value?.y === "number" && Number.isFinite(value.y)
      ? { x: value.x, y: value.y } : null;
  } catch { return null; }
}

export function timerPanelPosition(point: TimerPoint, viewport: TimerViewport, size: { width: number; height: number }): TimerPoint {
  const above = point.y - size.height - EDGE;
  return {
    x: Math.max(viewport.x + EDGE, Math.min(point.x + TIMER_BUBBLE_SIZE - size.width, viewport.x + viewport.width - size.width - EDGE)),
    y: Math.max(viewport.y + EDGE, Math.min(above >= viewport.y + EDGE ? above : point.y + TIMER_BUBBLE_SIZE + EDGE,
      viewport.y + viewport.height - size.height - EDGE)),
  };
}
