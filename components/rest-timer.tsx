"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { remainingSeconds } from "@/lib/rest-timer";
import { showRestNotification, supportsRestNotifications } from "@/lib/rest-notifications";

export function RestTimer() {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [vibrationUnavailable, setVibrationUnavailable] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const generation = useRef(0);
  const deadline = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setNotificationEnabled(supportsRestNotifications() && Notification.permission === "granted"), 0);
    return () => { window.clearTimeout(timer); generation.current += 1; };
  }, []);

  async function enableNotifications() {
    if (!supportsRestNotifications()) {
      setNotificationMessage("浏览器不支持通知；iPhone 可先添加到主屏幕后打开");
      return;
    }
    setNotificationBusy(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationEnabled(permission === "granted");
      if (permission !== "granted") {
        setNotificationMessage(permission === "denied" ? "通知被禁用，请在浏览器网站设置中允许通知" : "未开启通知，仍可使用倒计时");
        return;
      }
      // A test notification lets the user check the phone’s system settings.
      const sent = await showRestNotification();
      setNotificationMessage(sent ? "已发送测试通知" : "通知发送失败，请检查浏览器和系统通知设置");
    } catch { setNotificationMessage("开启通知失败，请检查浏览器网站设置"); }
    finally { setNotificationBusy(false); }
  }

  const finish = useCallback(() => {
    deadline.current = null;
    setRemaining(0);
    setRunning(false);
    setDone(true);
    try {
      if (!navigator.vibrate?.([400, 150, 400, 150, 600])) setVibrationUnavailable(true);
    } catch { setVibrationUnavailable(true); }
    const current = generation.current;
    if (supportsRestNotifications() && Notification.permission === "granted") {
      void showRestNotification(() => generation.current === current).then((sent) => {
        if (generation.current === current && !sent) setNotificationMessage("通知发送失败，请留意页面提醒");
      });
    }
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
    generation.current += 1;
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
      generation.current += 1;
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
    <div className="rest-timer-notifications"><button type="button" disabled={notificationBusy} onClick={() => void enableNotifications()}>{notificationBusy ? "开启中…" : notificationEnabled ? "测试通知" : "开启通知"}</button><span>{notificationEnabled ? "到时通知提醒" : vibrationUnavailable ? "无法震动，可开启通知" : "可开启到时通知"}</span></div>
    {notificationMessage && <small role="status">{notificationMessage}</small>}
  </aside>;
}
