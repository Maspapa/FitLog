"use client";

import { useMemo, useState } from "react";
import { lyftaExerciseMedia } from "@/lib/lyfta-links";
import { ExerciseMedia } from "@/components/exercise-media";
import { GYM_EQUIPMENT } from "@/lib/gym-equipment";
import { PHASE_LABELS, TRAINING_DAYS, type PlanExercise, type TrainingDay, type TrainingPhase } from "@/lib/training-plan";

import type { DailyLog } from "@/lib/schemas";
import { lastWorkout, workoutSummary } from "@/lib/workout-history";
import { dateKey } from "@/lib/metrics";

const PHASES: TrainingPhase[] = ["warmup", "main", "stretch"];

function suggestedDay(date: string): TrainingDay["id"] {
  const day = new Date(`${date}T12:00:00`).getDay();
  if (day === 3) return "wednesday";
  if (day === 5) return "friday";
  return "monday";
}

function ExerciseCard({ item, index, open, onToggle, onAdd, previous, added, saving }: { item: PlanExercise; index: number; open: boolean; onToggle: () => void; onAdd: () => void; previous: ReturnType<typeof lastWorkout>; added: boolean; saving: boolean }) {
  const lyfta = lyftaExerciseMedia(item.englishName);
  return <article className={`exercise-card ${open ? "open" : ""}`}>
    <div className="exercise-heading"><button className="exercise-summary" type="button" aria-expanded={open} onClick={onToggle}>
      <span className="exercise-index">{String(index + 1).padStart(2, "0")}</span><span className="exercise-name"><strong>{item.name}</strong><small>{item.englishName} · {item.target}</small></span><b>{item.dose}</b>{item.rest && <em>休 {item.rest}</em>}<i aria-hidden="true">{open ? "⌃" : "⌄"}</i>
      <span className="exercise-history">{previous ? `上次 ${previous.date} · ${workoutSummary(previous.workout)}` : "暂无历史记录"}</span>
    </button><button className="exercise-add" type="button" disabled={added || saving} aria-label={added ? `${item.name}已加入今天` : `添加${item.name}到今天`} onClick={onAdd}>{added ? "✓" : "＋"}</button></div>
    {open && <div className="exercise-detail">
      <aside className="lyfta-guide">
        <div className="lyfta-brand"><b>{lyfta.source}</b><span>动作指导</span></div>
        <ExerciseMedia key={item.englishName} media={lyfta} name={item.name} />
        <a href={lyfta.page} target="_blank" rel="noreferrer">在 {lyfta.source} 查看指导 <span>↗</span></a>
      </aside>
      <div className="detail-copy">
        <div className="equipment-tag">器械：{item.equipment}{item.rest && <> · 组间休息：{item.rest}</>}</div>
        <section><h5>先调整</h5><p>{item.setup}</p></section>
        <section><h5>怎么做</h5><ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
        <section className="cue-block"><h5>记住这三个词</h5><div>{item.cues.map((cue) => <span key={cue}>{cue}</span>)}</div></section>
        <div className="form-alert"><p><b>常见错误</b>{item.mistake}</p><p><b>安全提示</b>{item.safety}</p></div>
      </div>
    </div>}
  </article>;
}

export function TrainingPlan({ selectedDate, logs, saving, onAddExercises }: { selectedDate: string; logs: DailyLog[]; saving: boolean; onAddExercises: (items: PlanExercise[], day: TrainingDay) => void }) {
  const [dayId, setDayId] = useState<TrainingDay["id"]>(() => suggestedDay(selectedDate));
  const [openId, setOpenId] = useState<string | null>(null);
  const [alternativesOpen, setAlternativesOpen] = useState(false);
  const day = useMemo(() => TRAINING_DAYS.find((item) => item.id === dayId) || TRAINING_DAYS[0], [dayId]);
  const today = dateKey();
  const todayNames = new Set(logs.find((log) => log.date === today)?.workouts.map((item) => item.name.trim()) ?? []);
  const card = (item: PlanExercise, index: number) => <ExerciseCard key={item.id} item={item} index={index} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} onAdd={() => onAddExercises([item], day)} previous={lastWorkout(logs, item.name, today)} added={todayNames.has(item.name.trim())} saving={saving} />;
  const mainExercises = day.exercises.filter((item) => item.phase === "main");

  return (
    <section className="plan-section" id="training-plan">
      <div className="section-title plan-title"><h2>训练计划</h2></div>
      <details className="gym-equipment"><summary>我的健身房 · {GYM_EQUIPMENT.length} 种设备</summary><div>{GYM_EQUIPMENT.map((equipment) => <span key={equipment}>{equipment}</span>)}</div></details>
      <div className="plan-note"><strong>新手提示</strong><span>留 2–3 次余力 · 连续两次达到次数上限再小幅加重 · 关节疼痛立即停止</span></div>

      <div className="day-tabs" role="tablist" aria-label="每周训练日">
        {TRAINING_DAYS.map((item) => <button role="tab" aria-selected={item.id === day.id} className={item.id === day.id ? "active" : ""} type="button" key={item.id} onClick={() => { setDayId(item.id); setOpenId(null); setAlternativesOpen(false); }}><span>{item.weekday}</span><strong>{item.title}</strong><small>{item.focus}</small></button>)}
      </div>

      <article className="plan-day">
        <header><div><span>{day.weekday} · {day.duration}</span><h3>{day.title}</h3><p>{day.summary}</p></div><button type="button" disabled={saving} onClick={() => onAddExercises(mainExercises, day)}>＋ 全部加入今天</button></header>
        {PHASES.map((phase, phaseIndex) => {
          const items = day.exercises.filter((item) => item.phase === phase);
          return <section className={`plan-phase phase-${phase}`} key={phase}>
            <div className="phase-heading"><b>0{phaseIndex + 1}</b><div><h4>{PHASE_LABELS[phase].title}</h4><p>{PHASE_LABELS[phase].subtitle}</p></div><span>{items.length} 个动作</span></div>
            <div className="exercise-list">{items.map(card)}</div>
          </section>;
        })}
        <section className="plan-phase alternatives-phase">
          <button className="phase-heading alternatives-toggle" type="button" aria-expanded={alternativesOpen} aria-controls="alternative-exercises" onClick={() => { setAlternativesOpen(!alternativesOpen); if (alternativesOpen && day.alternatives.some((item) => item.id === openId)) setOpenId(null); }}><b aria-hidden="true">{alternativesOpen ? "−" : "＋"}</b><strong>可替换动作</strong><span>{day.alternatives.length} 个可选 · {alternativesOpen ? "收起" : "展开"}</span></button>
          {alternativesOpen && <div id="alternative-exercises">
          <div className="alternative-note"><strong>怎么用：</strong>有氧升温按需选择；备选动作只替换同部位动作，不额外加练。热身用轻重量，不沿用正式负重。</div>
          <div className="alternative-groups">{PHASES.map((phase) => {
            const items = day.alternatives.filter((item) => item.phase === phase);
            return <section className={`alternative-group alt-${phase}`} key={phase}>
              <header><div><span>{phase === "warmup" ? "WARM UP" : phase === "main" ? "EQUIPMENT" : "COOL DOWN"}</span><h5>{PHASE_LABELS[phase].title}备选</h5></div><b>{items.length} 个</b></header>
              <div className="exercise-list">{items.map(card)}</div>
            </section>;
          })}</div>
          </div>}
        </section>
        <footer className="plan-footer"><p><strong>一堂课的节奏：</strong>轻重量热身 → 按标注休息 → 轻松走动与按需拉伸约 5 分钟。时长不含等器械；不要为赶时间省掉热身或主动作休息。</p><span>真人动作演示由 <a href="https://www.lyfta.app/exercises" target="_blank" rel="noreferrer">Lyfta 动作库</a>提供；本站保留中文要点与安全提示。通用入门计划不能替代医生、康复师或现场教练的个体评估。</span></footer>
      </article>
    </section>
  );
}
