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

export const TIMER_ACTION_SIZE = 44;
const ACTION_RADIUS = 72;
const ACTION_EDGE = 8;
/** 展开环形按钮时小球需要离边缘的最小距离，保证四个按钮都完整可见。 */
export const TIMER_RING_INSET = Math.ceil(ACTION_RADIUS / Math.SQRT2 + TIMER_ACTION_SIZE / 2 - TIMER_BUBBLE_SIZE / 2);

/** 展开操作时把小球挪进安全区，让环形按钮完整落在屏幕内。 */
export function clampTimerForActions(point: TimerPoint, viewport: TimerViewport): TimerPoint {
  const minX = viewport.x + TIMER_RING_INSET;
  const maxX = viewport.x + viewport.width - TIMER_BUBBLE_SIZE - TIMER_RING_INSET;
  const minY = viewport.y + TIMER_RING_INSET;
  const maxY = viewport.y + viewport.height - TIMER_BUBBLE_SIZE - TIMER_RING_INSET;
  return {
    x: Math.max(minX, Math.min(point.x, maxX)),
    y: Math.max(minY, Math.min(point.y, maxY)),
  };
}

export type TimerActionKey = "minus" | "plus" | "reset" | "start";

/** 四个操作按钮围着小球的四个角排成环，并夹在可视区域内。 */
export function satellitePositions(center: TimerPoint, viewport: TimerViewport): Record<TimerActionKey, TimerPoint> {
  const offset = ACTION_RADIUS / Math.SQRT2;
  const centerX = center.x + TIMER_BUBBLE_SIZE / 2;
  const centerY = center.y + TIMER_BUBBLE_SIZE / 2;
  const minX = viewport.x + ACTION_EDGE;
  const maxX = viewport.x + viewport.width - TIMER_ACTION_SIZE - ACTION_EDGE;
  const minY = viewport.y + ACTION_EDGE;
  const maxY = viewport.y + viewport.height - TIMER_ACTION_SIZE - ACTION_EDGE;
  const place = (dx: number, dy: number): TimerPoint => ({
    x: Math.max(minX, Math.min(centerX + dx - TIMER_ACTION_SIZE / 2, maxX)),
    y: Math.max(minY, Math.min(centerY + dy - TIMER_ACTION_SIZE / 2, maxY)),
  });
  return {
    minus: place(-offset, -offset),
    plus: place(offset, -offset),
    reset: place(-offset, offset),
    start: place(offset, offset),
  };
}
