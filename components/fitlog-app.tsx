"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { DailyEditor, freshLog } from "./daily-editor";
import { CoachReport } from "./coach-report";
import { TrendChart } from "./trend-chart";
import { calculateStreak, dateKey, latestMeasurement, recentLogs, weightAverage, workoutsThisWeek } from "@/lib/metrics";
import { createData, exportData, getOrCreateDeviceToken, importData, loadData, saveData, upsertLog } from "@/lib/storage";
import type { AiReport, FitData, Goal } from "@/lib/schemas";

const GOALS: Record<Goal, string> = { fat_loss: "减脂", muscle_gain: "增肌", maintenance: "保持体型", performance: "提升运动表现" };

export function FitLogApp() {
  const [data, setData] = useState<FitData>(() => createData());
  const [ready, setReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [editorKey, setEditorKey] = useState(0);
  const [report, setReport] = useState<AiReport | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try { const token = getOrCreateDeviceToken(); tokenRef.current = token; setData(await loadData(token)); }
      catch (error) { setMessage(error instanceof Error ? error.message : "无法连接服务器记录"); }
      finally { setReady(true); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const selectedLog = useMemo(() => data.logs.find((log) => log.date === selectedDate) || freshLog(selectedDate), [data.logs, selectedDate]);
  const last14 = useMemo(() => recentLogs(data.logs, 14), [data.logs]);
  const stats = useMemo(() => ({ average: weightAverage(data.logs), waist: latestMeasurement(data.logs, "waist"), workouts: workoutsThisWeek(data.logs), streak: calculateStreak(data.logs) }), [data.logs]);

  async function persist(next: FitData) {
    setData(next);
    try { await saveData(tokenRef.current, next); setMessage("记录已保存到服务器"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "保存失败"); }
    window.setTimeout(() => setMessage(""), 2500);
  }
  function saveLog(log: typeof selectedLog) { void persist(upsertLog(data, log)); setEditorKey((key) => key + 1); }
  function changeDate(value: string) { setSelectedDate(value); setEditorKey((key) => key + 1); }
  function changeGoal(goal: Goal) { void persist({ ...data, profile: { ...data.profile, goal } }); }
  async function onImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    try { const next = await importData(file); await persist(next); setMessage(`已导入并保存 ${next.logs.length} 天记录`); }
    catch { setMessage("导入失败：请选择 FitLog 导出的 JSON 文件"); }
    event.target.value = "";
  }
  async function generateReport() {
    if (!last14.length || coachLoading) return;
    setCoachLoading(true); setMessage("");
    try {
      const response = await fetch("/api/coach", { method: "POST", headers: { "X-FitLog-Token": tokenRef.current } });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "AI 周报生成失败");
      setReport(payload.report); requestAnimationFrame(() => document.querySelector(".coach-report")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "AI 周报生成失败"); }
    finally { setCoachLoading(false); }
  }

  if (!ready) return <div className="loading-screen"><span>FITLOG</span><i /></div>;
  return <main>
    <nav className="topbar"><a href="#top" className="brand"><i>FL</i>FitLog</a><div><a className="topbar-primary" href="#daily">今日打卡</a><button type="button" onClick={() => exportData(data)}>导出备份</button><button type="button" onClick={() => importRef.current?.click()}>导入</button><input ref={importRef} hidden type="file" accept="application/json" onChange={onImport} /></div></nav>

    <header className="hero" id="top">
      <div className="hero-meta"><span>{new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}</span><label>目标<select value={data.profile.goal} onChange={(e) => changeGoal(e.target.value as Goal)}>{Object.entries(GOALS).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label></div>
      <h1>今天，过得怎么样？</h1>
      <p>选一个项目开始记录。不用全部填满，也不用追求完美。</p>
      <div className="date-control"><button type="button" onClick={() => { const date = new Date(`${selectedDate}T12:00:00`); date.setDate(date.getDate()-1); changeDate(dateKey(date)); }}>←</button><input aria-label="打卡日期" type="date" max={dateKey()} value={selectedDate} onChange={(e) => changeDate(e.target.value)} /><button type="button" disabled={selectedDate === dateKey()} onClick={() => { const date = new Date(`${selectedDate}T12:00:00`); date.setDate(date.getDate()+1); changeDate(dateKey(date)); }}>→</button></div>
    </header>

    <section className="stats-strip">
      <Stat value={stats.average === null ? "--" : stats.average.toFixed(1)} unit="kg" label="近7日平均体重" />
      <Stat value={stats.waist === null ? "--" : stats.waist.toFixed(1)} unit="cm" label="最近腰围" />
      <Stat value={String(stats.workouts)} unit="项" label="本周训练" />
      <Stat value={String(stats.streak)} unit="天" label="连续记录" />
    </section>

    <nav className="quick-nav" aria-label="打卡快捷入口"><span>快速记录</span><a href="#body-card"><b>01</b>身体</a><a href="#workout-card"><b>02</b>训练</a><a href="#food-card"><b>03</b>饮食</a><a href="#state-card"><b>04</b>恢复</a></nav>

    <DailyEditor key={`${selectedDate}-${editorKey}`} initial={selectedLog} onSave={saveLog} />

    <section className="insights-section">
      <div className="section-title light"><span>LONG GAME</span><h2>别盯着一天，看趋势。</h2><p>单日体重会受水分、盐分和作息影响。曲线比数字更诚实。</p></div>
      <div className="insight-grid"><article className="chart-card"><div><span>最近30次记录</span><h3>体重趋势</h3></div><TrendChart logs={data.logs} /></article>
        <article className="coach-card"><span>WEEKLY COACH</span><h3>让 AI 帮你复盘这段记录</h3><p>它不会猜热量，只会根据你实际写下的训练、饮食和恢复寻找规律。</p><button type="button" disabled={!last14.length || coachLoading} onClick={generateReport}>{coachLoading ? "正在整理这两周…" : last14.length ? `分析最近 ${last14.length} 天` : "先完成一次打卡"}<b>↗</b></button><small>每个 IP 每小时最多生成 10 次</small></article>
      </div>
      {report && <CoachReport report={report} />}
    </section>

    {data.logs.length > 0 && <section className="logbook"><div className="section-title"><span>LOGBOOK</span><h2>最近记录</h2></div><div className="log-list">{[...data.logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,14).map((log) => <button type="button" key={log.date} onClick={() => { changeDate(log.date); document.querySelector(".editor-section")?.scrollIntoView({behavior:"smooth"}); }}><time>{log.date.slice(5).replace("-","/")}</time><span>{log.workouts.length ? log.workouts.map((item)=>item.name).join("、") : "休息 / 未记录训练"}</span><b>{log.weight ? `${log.weight}kg` : "--"}</b></button>)}</div></section>}

    <footer><b>FitLog</b><span>记录保存在你的服务器 · 当前浏览器持有访问凭证 · 建议定期导出备份</span></footer>
    {message && <div className="toast" role="status">{message}</div>}
  </main>;
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{unit}</span><p>{label}</p></div>; }
