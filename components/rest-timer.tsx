"use client";

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { adjustRestTime, clampTimerPosition, parseTimerPosition, remainingSeconds, timerPanelPosition, type TimerPoint, type TimerViewport } from "@/lib/rest-timer";

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
  const [panelSize, setPanelSize] = useState({ width: 300, height: 250 });
  const positionRef = useRef<TimerPoint | null>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; origin: TimerPoint; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const container = useRef<HTMLElement>(null);
  const bubble = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();

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
    if (!expanded) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setExpanded(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setExpanded(false); bubble.current?.focus(); }
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setPanelSize({ width: entry.target.getBoundingClientRect().width, height: entry.target.getBoundingClientRect().height });
    });
    if (panel.current) observer.observe(panel.current);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { observer.disconnect(); document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
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

  function toggle() {
    if (running && deadline.current !== null) {
      const seconds = remainingSeconds(deadline.current);
      if (seconds === 0) { finish(); return; }
      deadline.current = null;
      setRemaining(seconds);
      setRunning(false);
    } else {
      const seconds = done ? duration : remaining;
      setRemaining(seconds);
      setDone(false);
      setVibrationUnavailable(typeof navigator.vibrate !== "function");
      deadline.current = Date.now() + seconds * 1000;
      setRunning(true);
    }
  }

  const time = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const panelPosition = position && viewport ? timerPanelPosition(position, viewport, panelSize) : null;
  return <aside ref={container} className={`rest-timer${done ? " rest-timer-done" : ""}${running ? " rest-timer-running" : ""}${dragging ? " rest-timer-dragging" : ""}`} aria-label="组间休息计时器" style={position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined}>
    <button ref={bubble} type="button" className="rest-timer-bubble" aria-label={`${expanded ? "收起" : "展开"}休息计时器，${done ? "休息结束" : `剩余 ${time}`}`} aria-expanded={expanded} aria-controls={panelId} title="点击展开，拖动移动位置；方向键也可移动"
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
      onClick={(event) => { if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; } setExpanded((value) => !value); }}
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
      {done ? <span className="rest-timer-bubble-done">到时</span> : running || remaining < duration ? <span className="rest-timer-bubble-time">{time}</span> : <svg className="rest-timer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6M12 2v3M18 5l2 2" /></svg>}
    </button>
    <span className="rest-timer-announcement" role="status">{done && !expanded ? "休息结束，可以开始下一组了" : ""}</span>
    {expanded && <div ref={panel} id={panelId} className="rest-timer-panel" role="region" aria-label="休息计时器操作" style={panelPosition && viewport ? { left: panelPosition.x, top: panelPosition.y, right: "auto", bottom: "auto", width: Math.min(300, viewport.width - 24), maxHeight: viewport.height - 24 } : undefined}>
    <div className="rest-timer-heading"><b>组间休息</b><button type="button" className="rest-timer-close" aria-label="收起休息计时器" onClick={() => { setExpanded(false); bubble.current?.focus(); }}>×</button></div>
    <div className="rest-timer-top"><div aria-label="调整休息时长"><button type="button" aria-label="减少30秒" disabled={duration <= 30} onClick={() => adjustTime(-30)}>−30s</button><button type="button" aria-label="增加30秒" onClick={() => adjustTime(30)}>+30s</button></div></div>
    <div className="rest-timer-bottom"><output aria-label="剩余时间" role="timer">{time}</output><button type="button" className="rest-timer-start" onClick={toggle}>{running ? "暂停" : done ? "再来一次" : remaining < duration ? "继续" : "开始"}</button><button type="button" onClick={() => reset()} aria-label="重置休息计时器">重置</button></div>
    <span className="rest-timer-status" role="status">{done ? "休息结束，可以开始下一组了" : ""}</span>
    {vibrationUnavailable && <small>当前浏览器无法震动，请留意计时器</small>}
    </div>}
  </aside>;
}
