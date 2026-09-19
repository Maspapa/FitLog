import { useState } from "react";
import { emptyLog } from "@/lib/metrics";
import type { DailyLog, Workout } from "@/lib/schemas";

const CATEGORIES = { strength: "力量", cardio: "有氧", mobility: "拉伸", sport: "运动", other: "其他" } as const;

function numberOrNull(value: string): number | null { return value === "" ? null : Number(value); }

export function DailyEditor({ initial, onDraftChange, onSave }: { initial: DailyLog; onDraftChange: (log: DailyLog) => void; onSave: (log: DailyLog) => void }) {
  const [log, setLog] = useState(initial);
  const [saved, setSaved] = useState(false);
  function field<K extends keyof DailyLog>(key: K, value: DailyLog[K]) { const next = { ...log, [key]: value }; setLog(next); onDraftChange(next); setSaved(false); }
  function addWorkout() {
    const workout: Workout = { id: crypto.randomUUID(), name: "", category: "strength", sets: null, reps: null, weight: null, duration: null, intensity: null };
    field("workouts", [...log.workouts, workout]);
  }
  function updateWorkout(id: string, values: Partial<Workout>) { field("workouts", log.workouts.map((item) => item.id === id ? { ...item, ...values } : item)); }
  function submit() { onSave({ ...log, workouts: log.workouts.filter((item) => item.name.trim()), updatedAt: new Date().toISOString() }); setSaved(true); }

  return (
    <section className="editor-section" id="daily">
      <div className="editor-grid">
        <article className="entry-card body-card" id="body-card">
          <div className="measure-grid">
            <label><span>体重</span><div><input type="number" inputMode="decimal" step="0.1" value={log.weight ?? ""} onChange={(e) => field("weight", numberOrNull(e.target.value))} placeholder="--" /><b>kg</b></div></label>
            <label><span>腰围</span><div><input type="number" inputMode="decimal" step="0.1" value={log.waist ?? ""} onChange={(e) => field("waist", numberOrNull(e.target.value))} placeholder="--" /><b>cm</b></div></label>
          </div>
        </article>

        <article className="entry-card workout-card" id="workout-card">
          <div className="card-heading"><h3>训练</h3><button type="button" onClick={addWorkout}>＋ 添加</button></div>
          {log.workouts.length === 0 && <p className="hint">还没有训练，可手动添加或从下方计划选择。</p>}
          <div className="workout-list">{log.workouts.map((workout) => (
            <div className="workout-row" key={workout.id}>
              <input className="workout-name" value={workout.name} onChange={(e) => updateWorkout(workout.id, { name: e.target.value })} placeholder="动作或运动名称" />
              <select value={workout.category} onChange={(e) => updateWorkout(workout.id, { category: e.target.value as Workout["category"] })}>{Object.entries(CATEGORIES).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
              {workout.category === "strength" ? <>
                <label>组<input type="number" value={workout.sets ?? ""} onChange={(e) => updateWorkout(workout.id, { sets: numberOrNull(e.target.value) })} /></label>
                <label>次<input type="number" value={workout.reps ?? ""} onChange={(e) => updateWorkout(workout.id, { reps: numberOrNull(e.target.value) })} /></label>
                <label>kg<input type="number" step="0.5" value={workout.weight ?? ""} onChange={(e) => updateWorkout(workout.id, { weight: numberOrNull(e.target.value) })} /></label>
              </> : <label className="duration-field">分钟<input type="number" value={workout.duration ?? ""} onChange={(e) => updateWorkout(workout.id, { duration: numberOrNull(e.target.value) })} /></label>}
              <button className="remove-button" type="button" aria-label={`删除 ${workout.name || "训练"}`} onClick={() => field("workouts", log.workouts.filter((item) => item.id !== workout.id))}>×</button>
            </div>
          ))}</div>
        </article>

      </div>
      <button className={`save-button ${saved ? "saved" : ""}`} type="button" onClick={submit}>{saved ? "✓ 已保存" : "保存记录"}</button>
    </section>
  );
}

export function freshLog(date: string) { return emptyLog(date); }
