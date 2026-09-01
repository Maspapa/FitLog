"use client";

import { useMemo, useState } from "react";
import { ExerciseDiagram } from "./exercise-diagram";
import { PHASE_LABELS, TRAINING_DAYS, type PlanExercise, type TrainingDay, type TrainingPhase } from "@/lib/training-plan";

const PHASES: TrainingPhase[] = ["warmup", "main", "stretch"];

function suggestedDay(date: string): TrainingDay["id"] {
  const day = new Date(`${date}T12:00:00`).getDay();
  if (day === 3) return "wednesday";
  if (day === 5) return "friday";
  return "monday";
}

function ExerciseCard({ item, index, open, onToggle, onAdd }: { item: PlanExercise; index: number; open: boolean; onToggle: () => void; onAdd?: () => void }) {
  return <article className={`exercise-card ${open ? "open" : ""}`}>
    <button className="exercise-summary" type="button" aria-expanded={open} onClick={onToggle}>
      <span className="exercise-index">{String(index + 1).padStart(2, "0")}</span><span className="exercise-name"><strong>{item.name}</strong><small>{item.englishName} · {item.target}</small></span><b>{item.dose}</b>{item.rest && <em>休 {item.rest}</em>}<i>{open ? "−" : "＋"}</i>
    </button>
    {open && <div className="exercise-detail">
      <ExerciseDiagram kind={item.diagram} name={item.name} />
      <div className="detail-copy">
        <div className="equipment-tag">器械：{item.equipment}</div>
        <section><h5>先调整</h5><p>{item.setup}</p></section>
        <section><h5>怎么做</h5><ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
        <section className="cue-block"><h5>记住这三个词</h5><div>{item.cues.map((cue) => <span key={cue}>{cue}</span>)}</div></section>
        <div className="form-alert"><p><b>常见错误</b>{item.mistake}</p><p><b>安全提示</b>{item.safety}</p></div>
        <div className="detail-actions">{item.guideUrl && <a className="video-link" href={item.guideUrl} target="_blank" rel="noreferrer">查看专业图文 / 视频示范 <span>↗</span></a>}{onAdd && <button type="button" onClick={onAdd}>＋ 加入当天打卡</button>}</div>
      </div>
    </div>}
  </article>;
}

export function TrainingPlan({ selectedDate, onAddExercises }: { selectedDate: string; onAddExercises: (items: PlanExercise[], day: TrainingDay) => void }) {
  const [dayId, setDayId] = useState<TrainingDay["id"]>(() => suggestedDay(selectedDate));
  const [openId, setOpenId] = useState<string | null>(null);
  const day = useMemo(() => TRAINING_DAYS.find((item) => item.id === dayId) || TRAINING_DAYS[0], [dayId]);
  const mainExercises = day.exercises.filter((item) => item.phase === "main");

  return (
    <section className="plan-section" id="training-plan">
      <div className="section-title plan-title"><span>BEGINNER PROGRAM</span><h2>到健身房，照着做就行。</h2><p>从热身到拉伸都排好了。先看图，再看动作要领；第一次使用陌生器械，先请巡场教练帮你调一次座椅。</p></div>
      <div className="plan-principles">
        <div><b>01</b><strong>前两周减量</strong><span>所有器械先做 2 组；第 3 周起状态良好再做完整组数。</span></div>
        <div><b>02</b><strong>重量怎么选</strong><span>做完目标次数，感觉还能规范完成 2–3 次，就是合适重量。</span></div>
        <div><b>03</b><strong>什么时候加重</strong><span>连续两次训练都做到次数上限且动作稳定，再加最小一档。</span></div>
        <div><b>04</b><strong>疼痛不是训练感</strong><span>肌肉酸胀可以；关节锐痛、麻木、眩晕或胸闷必须停止。</span></div>
      </div>

      <div className="day-tabs" role="tablist" aria-label="每周训练日">
        {TRAINING_DAYS.map((item) => <button role="tab" aria-selected={item.id === day.id} className={item.id === day.id ? "active" : ""} type="button" key={item.id} onClick={() => { setDayId(item.id); setOpenId(null); }}><span>{item.weekday}</span><strong>{item.title}</strong><small>{item.focus}</small></button>)}
      </div>

      <article className="plan-day">
        <header><div><span>{day.weekday} · {day.duration}</span><h3>{day.title}</h3><p>{day.summary}</p></div><button type="button" onClick={() => onAddExercises(mainExercises, day)}>＋ 加入 {selectedDate.slice(5).replace("-", "/")} 的打卡</button></header>
        {PHASES.map((phase, phaseIndex) => {
          const items = day.exercises.filter((item) => item.phase === phase);
          return <section className={`plan-phase phase-${phase}`} key={phase}>
            <div className="phase-heading"><b>0{phaseIndex + 1}</b><div><h4>{PHASE_LABELS[phase].title}</h4><p>{PHASE_LABELS[phase].subtitle}</p></div><span>{items.length} 个动作</span></div>
            <div className="exercise-list">{items.map((item, index) => <ExerciseCard key={item.id} item={item} index={index} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />)}</div>
          </section>;
        })}
        <section className="plan-phase alternatives-phase">
          <div className="phase-heading"><b>＋</b><div><h4>更多常见动作</h4><p>热身、器械、拉伸都有备选；按当天器械和身体状态替换</p></div><span>{day.alternatives.length} 个可选</span></div>
          <div className="alternative-note"><strong>怎么用：</strong>热身和拉伸各挑 1–3 个；器械动作挑 1–2 个替换同部位动作。同一天的器械训练总数尽量控制在 5–6 个，不要把整库全部做完。</div>
          <div className="alternative-groups">{PHASES.map((phase) => {
            const items = day.alternatives.filter((item) => item.phase === phase);
            return <section className={`alternative-group alt-${phase}`} key={phase}>
              <header><div><span>{phase === "warmup" ? "WARM UP" : phase === "main" ? "EQUIPMENT" : "COOL DOWN"}</span><h5>{PHASE_LABELS[phase].title}备选</h5></div><b>{items.length} 个</b></header>
              <div className="exercise-list">{items.map((item, index) => <ExerciseCard key={item.id} item={item} index={index} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} onAdd={item.log ? () => onAddExercises([item], day) : undefined} />)}</div>
            </section>;
          })}</div>
        </section>
        <footer className="plan-footer"><p><strong>一堂课的节奏：</strong>热身不喘 → 器械组间按时休息 → 拉伸不忍痛。总时长超出很多，通常是重量太重或组间刷手机太久。</p><span>计划参考 ACE 动作库与 PureGym 专业动作示范；动作插图由 <a href="https://repdb.co" target="_blank" rel="noreferrer">RepDB</a> 提供。它是通用入门计划，不能替代医生、康复师或现场教练的个体评估。</span></footer>
      </article>
    </section>
  );
}
