"use client";

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { adjustRestTime, clampTimerForActions, clampTimerPosition, parseTimerPosition, remainingSeconds, satellitePositions, shouldAutoStart, type TimerPoint, type TimerViewport } from "@/lib/rest-timer";

const POSITION_KEY = "fitlog.rest-timer.position";

function currentViewport(): TimerViewport {
  const viewport = window.visualViewport;
  return { x: viewport?.offsetLeft ?? 0, y: viewport?.offsetTop ?? 0, width: viewport?.width ?? window.innerWidth, height: viewport?.height ?? window.innerHeight };
}

function rememberPosition(point: TimerPoint) {
  try { localStorage.setItem(POSITION_KEY, JSON.stringify(point)); } catch { /* Position is optional in private browsing. */ }
}

export function RestTimer() {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [vibrationUnavailable, setVibrationUnavailable] = useState(false);
  const deadline = useRef<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState<TimerPoint | null>(null);
  const [viewport, setViewport] = useState<TimerViewport | null>(null);
  const [dragging, setDragging] = useState(false);
  const positionRef = useRef<TimerPoint | null>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; origin: TimerPoint; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const container = useRef<HTMLElement>(null);
  const bubble = useRef<HTMLButtonElement>(null);
  const actionsId = useId();
  const collapseRef = useRef<() => void>(() => {});
  const startRef = useRef<() => void>(() => {});
  const freshRef = useRef(false);

  useEffect(() => {
    let stored: TimerPoint | null = null;
    try { stored = parseTimerPosition(localStorage.getItem(POSITION_KEY)); } catch { /* Use the default corner. */ }
    function reposition() {
      const bounds = currentViewport();
      const point = clampTimerPosition(positionRef.current ?? stored ?? { x: bounds.x + bounds.width - 74, y: bounds.y + bounds.height - 84 }, bounds);
      positionRef.current = point;
      setPosition(point);
      setViewport(bounds);
    }
    const frame = window.requestAnimationFrame(reposition);
    window.addEventListener("resize", reposition);
    window.visualViewport?.addEventListener("resize", reposition);
    window.visualViewport?.addEventListener("scroll", reposition);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", reposition);
      window.visualViewport?.removeEventListener("resize", reposition);
      window.visualViewport?.removeEventListener("scroll", reposition);
    };
  }, []);

  useEffect(() => {
    freshRef.current = shouldAutoStart({ done, running, remaining, duration });
    startRef.current = startTimer;
    collapseRef.current = collapse;
  });

  useEffect(() => {
    if (!expanded) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) collapseRef.current();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { collapseRef.current(); bubble.current?.focus(); }
    }
    function autoStartOnBlur() {
      if (freshRef.current) startRef.current();
    }
    function onVisibilityChange() {
      if (document.hidden) autoStartOnBlur();
    }
    function keepRingVisible() {
      const bounds = currentViewport();
      const point = clampTimerForActions(positionRef.current ?? { x: bounds.x, y: bounds.y }, bounds);
      positionRef.current = point;
      setPosition(point);
      setViewport(bounds);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", autoStartOnBlur);
    window.addEventListener("resize", keepRingVisible);
    window.visualViewport?.addEventListener("resize", keepRingVisible);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", autoStartOnBlur);
      window.removeEventListener("resize", keepRingVisible);
      window.visualViewport?.removeEventListener("resize", keepRingVisible);
    };
  }, [expanded]);

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const origin = positionRef.current ?? clampTimerPosition({ x: event.currentTarget.getBoundingClientRect().left, y: event.currentTarget.getBoundingClientRect().top }, currentViewport());
    suppressClick.current = false;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, origin, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.moved && Math.hypot(dx, dy) < 6) return;
    gesture.moved = true;
    suppressClick.current = true;
    setDragging(true);
    setExpanded(false);
    const point = clampTimerPosition({ x: gesture.origin.x + dx, y: gesture.origin.y + dy }, currentViewport());
    positionRef.current = point;
    setPosition(point);
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.moved && positionRef.current) rememberPosition(positionRef.current);
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const finish = useCallback(() => {
    deadline.current = null;
    setRemaining(0);
    setRunning(false);
    setDone(true);
    try {
      if (!navigator.vibrate?.([400, 150, 400, 150, 600])) setVibrationUnavailable(true);
    } catch { setVibrationUnavailable(true); }
  }, []);

  useEffect(() => {
    if (!running) return;
    function tick() {
      if (deadline.current === null) return;
      const seconds = remainingSeconds(deadline.current);
      if (seconds === 0) finish();
      else setRemaining(seconds);
    }
    const interval = window.setInterval(tick, 200);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("pageshow", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("pageshow", tick);
    };
  }, [running, finish]);

  function reset(seconds = duration) {
    deadline.current = null;
    setRunning(false);
    setDone(false);
    setRemaining(seconds);
    try { navigator.vibrate?.(0); } catch { /* The visual timer works without vibration. */ }
  }

  function adjustTime(delta: number) {
    if (delta < 0 && duration <= 30) return;
    const next = adjustRestTime({ duration, remaining, deadline: deadline.current, done }, delta);
    setDuration(next.duration);
    setRemaining(next.remaining);
    setDone(next.done);
    deadline.current = next.deadline;
    try { navigator.vibrate?.(0); } catch { /* Time adjustment works without vibration. */ }
    if (next.done) finish();
  }

  function startTimer() {
    const seconds = done ? duration : remaining;
    if (seconds <= 0) return;
    setRemaining(seconds);
    setDone(false);
    setVibrationUnavailable(typeof navigator.vibrate !== "function");
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  }


  /** 一次都没开始过时收起面板，视为“开始练了”，直接开表。 */
  function collapse() {
    setExpanded(false);
    if (shouldAutoStart({ done, running, remaining, duration })) startTimer();
  }

  const time = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const actions = position && viewport ? satellitePositions(position, viewport) : null;
  const actionStyle = (key: "minus" | "plus" | "reset") => actions ? { left: actions[key].x, top: actions[key].y } : undefined;
  return <aside ref={container} className={`rest-timer${done ? " rest-timer-done" : ""}${running ? " rest-timer-running" : ""}${dragging ? " rest-timer-dragging" : ""}`} aria-label="组间休息计时器" style={position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined}>
    <button ref={bubble} type="button" className="rest-timer-bubble" aria-label={`${expanded ? "收起" : "展开"}休息计时器，${done ? "休息结束" : `剩余 ${time}`}`} aria-expanded={expanded} aria-controls={actionsId} title="点击展开，拖动移动位置；方向键也可移动"
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
      onClick={(event) => {
        if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
        if (expanded) { collapse(); return; }
        const point = clampTimerForActions(positionRef.current ?? { x: 0, y: 0 }, currentViewport());
        positionRef.current = point; setPosition(point); rememberPosition(point);
        setExpanded(true);
      }}
      onKeyDown={(event) => {
        const directions: Record<string, TimerPoint> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
        const direction = directions[event.key];
        if (!direction || !positionRef.current) return;
        event.preventDefault();
        const step = event.shiftKey ? 32 : 12;
        const point = clampTimerPosition({ x: positionRef.current.x + direction.x * step, y: positionRef.current.y + direction.y * step }, currentViewport());
        positionRef.current = point; setPosition(point); rememberPosition(point);
      }}>
      <svg className="rest-timer-ring" viewBox="0 0 56 56" aria-hidden="true"><circle className="rest-timer-ring-track" cx="28" cy="28" r="25" /><circle className="rest-timer-ring-progress" cx="28" cy="28" r="25" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - (remaining / duration) * 100} /></svg>
      {done ? <span className="rest-timer-bubble-done">到时</span> : <span className="rest-timer-bubble-time">{time}</span>}
    </button>
    <span className="rest-timer-announcement" role="status">{done ? "休息结束，可以开始下一组了" : expanded && vibrationUnavailable ? "当前浏览器无法震动，请留意计时器" : ""}</span>
    {expanded && actions && <div className="rest-timer-actions" id={actionsId} role="group" aria-label="休息计时器操作">
      <button type="button" className="rest-timer-action rest-timer-action-minus" style={actionStyle("minus")} aria-label="减少30秒" disabled={duration <= 30} onClick={() => adjustTime(-30)}>−30s</button>
      <button type="button" className="rest-timer-action rest-timer-action-plus" style={actionStyle("plus")} aria-label="增加30秒" onClick={() => adjustTime(30)}>+30s</button>
      <button type="button" className="rest-timer-action rest-timer-action-reset" style={actionStyle("reset")} aria-label="重置休息计时器" onClick={() => reset()}>重置</button>
    </div>}
  </aside>;
}
