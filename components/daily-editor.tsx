import { useState } from "react";
import { emptyLog } from "@/lib/metrics";
import type { DailyLog, Workout } from "@/lib/schemas";

const CATEGORIES = { strength: "力量", cardio: "有氧", mobility: "拉伸", sport: "运动", other: "其他" } as const;
const INTENSITIES = { easy: "轻松", moderate: "适中", hard: "吃力" } as const;
const MEALS = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snacks: "零食 / 加餐" } as const;

function numberOrNull(value: string): number | null { return value === "" ? null : Number(value); }

export function DailyEditor({ initial, onSave }: { initial: DailyLog; onSave: (log: DailyLog) => void }) {
  const [log, setLog] = useState(initial);
  const [saved, setSaved] = useState(false);
  function field<K extends keyof DailyLog>(key: K, value: DailyLog[K]) { setLog((current) => ({ ...current, [key]: value })); setSaved(false); }
  function addWorkout() {
    const workout: Workout = { id: crypto.randomUUID(), name: "", category: "strength", sets: null, reps: null, weight: null, duration: null, intensity: "moderate" };
    field("workouts", [...log.workouts, workout]);
  }
  function updateWorkout(id: string, values: Partial<Workout>) { field("workouts", log.workouts.map((item) => item.id === id ? { ...item, ...values } : item)); }
  function submit() { onSave({ ...log, workouts: log.workouts.filter((item) => item.name.trim()), updatedAt: new Date().toISOString() }); setSaved(true); }

  return (
    <section className="editor-section" id="daily">
      <div className="section-title"><h2>今日打卡</h2></div>
      <div className="editor-grid">
        <article className="entry-card body-card" id="body-card">
          <div className="entry-number">01</div><h3>身体数据</h3>
          <div className="measure-grid">
            <label><span>体重</span><div><input type="number" inputMode="decimal" step="0.1" value={log.weight ?? ""} onChange={(e) => field("weight", numberOrNull(e.target.value))} placeholder="--" /><b>kg</b></div></label>
            <label><span>腰围</span><div><input type="number" inputMode="decimal" step="0.1" value={log.waist ?? ""} onChange={(e) => field("waist", numberOrNull(e.target.value))} placeholder="--" /><b>cm</b></div></label>
          </div>
        </article>

        <article className="entry-card workout-card" id="workout-card">
          <div className="entry-number">02</div><div className="card-heading"><h3>训练</h3><button type="button" onClick={addWorkout}>＋ 添加训练</button></div>
          {log.workouts.length === 0 && <button className="empty-action" type="button" onClick={addWorkout}>＋ 记录一项训练</button>}
          <div className="workout-list">{log.workouts.map((workout) => (
            <div className="workout-row" key={workout.id}>
              <input className="workout-name" value={workout.name} onChange={(e) => updateWorkout(workout.id, { name: e.target.value })} placeholder="动作或运动名称" />
              <select value={workout.category} onChange={(e) => updateWorkout(workout.id, { category: e.target.value as Workout["category"] })}>{Object.entries(CATEGORIES).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
              {workout.category === "strength" ? <>
                <label>组<input type="number" value={workout.sets ?? ""} onChange={(e) => updateWorkout(workout.id, { sets: numberOrNull(e.target.value) })} /></label>
                <label>次<input type="number" value={workout.reps ?? ""} onChange={(e) => updateWorkout(workout.id, { reps: numberOrNull(e.target.value) })} /></label>
                <label>kg<input type="number" step="0.5" value={workout.weight ?? ""} onChange={(e) => updateWorkout(workout.id, { weight: numberOrNull(e.target.value) })} /></label>
              </> : <label className="duration-field">分钟<input type="number" value={workout.duration ?? ""} onChange={(e) => updateWorkout(workout.id, { duration: numberOrNull(e.target.value) })} /></label>}
              <select value={workout.intensity ?? "moderate"} onChange={(e) => updateWorkout(workout.id, { intensity: e.target.value as Workout["intensity"] })}>{Object.entries(INTENSITIES).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
              <button className="remove-button" type="button" aria-label={`删除 ${workout.name || "训练"}`} onClick={() => field("workouts", log.workouts.filter((item) => item.id !== workout.id))}>×</button>
            </div>
          ))}</div>
        </article>

        <article className="entry-card food-card" id="food-card">
          <div className="entry-number">03</div><h3>饮食</h3>
          <div className="meal-grid">{Object.entries(MEALS).map(([key, label]) => <label key={key}><span>{label}</span><textarea rows={2} value={log.meals[key as keyof DailyLog["meals"]]} onChange={(e) => field("meals", { ...log.meals, [key]: e.target.value })} placeholder="例如：米饭、鸡腿、青菜" /></label>)}</div>
        </article>

        <article className="entry-card state-card" id="state-card">
          <div className="entry-number">04</div><h3>恢复与状态</h3>
          <div className="state-grid">
            <label>睡眠（小时）<input type="number" step="0.5" value={log.sleepHours ?? ""} onChange={(e) => field("sleepHours", numberOrNull(e.target.value))} placeholder="7.5" /></label>
            <label>步数<input type="number" value={log.steps ?? ""} onChange={(e) => field("steps", numberOrNull(e.target.value))} placeholder="8000" /></label>
            <label>饮水（杯）<input type="number" value={log.waterGlasses ?? ""} onChange={(e) => field("waterGlasses", numberOrNull(e.target.value))} placeholder="8" /></label>
            <label className="check-label"><input type="checkbox" checked={log.alcohol} onChange={(e) => field("alcohol", e.target.checked)} />今天饮酒</label>
            <Scale label="精神" value={log.mood} low="差" high="好" onChange={(value) => field("mood", value)} />
            <Scale label="疲劳" value={log.fatigue} low="低" high="高" onChange={(value) => field("fatigue", value)} />
            <Scale label="酸痛" value={log.soreness} low="无" high="重" onChange={(value) => field("soreness", value)} />
          </div>
          <label className="notes-label">备注<textarea rows={3} value={log.notes} onChange={(e) => field("notes", e.target.value)} placeholder="聚餐、出差、哪里不舒服，或者今天值得记住的事" /></label>
        </article>
      </div>
      <button className={`save-button ${saved ? "saved" : ""}`} type="button" onClick={submit}>{saved ? "✓ 今天已记录" : "完成今日打卡"}<span>→</span></button>
    </section>
  );
}

function Scale({ label, value, low, high, onChange }: { label: string; value: number | null; low: string; high: string; onChange: (value: number) => void }) {
  return <div className="scale"><span>{label}</span><div>{[1,2,3,4,5].map((item) => <button className={value === item ? "active" : ""} type="button" key={item} onClick={() => onChange(item)}>{item}</button>)}</div><small>{low}<i />{high}</small></div>;
}

export function freshLog(date: string) { return emptyLog(date); }
