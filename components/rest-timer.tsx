"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { remainingSeconds } from "@/lib/rest-timer";

export function RestTimer() {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [vibrationUnavailable, setVibrationUnavailable] = useState(false);
  const deadline = useRef<number | null>(null);

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

  return <aside className={`rest-timer${done ? " rest-timer-done" : ""}`} aria-label="组间休息计时器">
    <div className="rest-timer-top"><span>组间休息</span><div aria-label="休息时长">{[60, 90].map((seconds) => <button type="button" key={seconds} aria-pressed={duration === seconds} onClick={() => { setDuration(seconds); reset(seconds); }}>{seconds === 60 ? "1 分钟" : "1 分半"}</button>)}</div></div>
    <div className="rest-timer-bottom"><output aria-label="剩余时间" role="timer">{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</output><button type="button" className="rest-timer-start" onClick={toggle}>{running ? "暂停" : done ? "再来一次" : remaining < duration ? "继续" : "开始"}</button><button type="button" onClick={() => reset()} aria-label="重置休息计时器">重置</button></div>
    <span className="rest-timer-status" role="status">{done ? "休息结束，可以开始下一组了" : ""}</span>
    {vibrationUnavailable && <small>当前浏览器无法震动，请留意倒计时</small>}
  </aside>;
}
