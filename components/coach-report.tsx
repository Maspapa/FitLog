import type { AiReport } from "@/lib/schemas";

export function CoachReport({ report }: { report: AiReport }) {
  return <div className="coach-report">
    <div className="report-lead"><span>AI WEEKLY REVIEW</span><h3>{report.headline}</h3><p>{report.summary}</p></div>
    <div className="report-columns">
      <section><h4>这周做对了</h4>{report.wins.map((item) => <p key={item}>＋ {item}</p>)}</section>
      <section><h4>记录里出现的规律</h4>{report.patterns.map((item) => <article key={item.title}><b>{item.title}</b><small>{item.evidence}</small><p>{item.suggestion}</p></article>)}</section>
    </div>
    <div className="next-focus"><span>下周只做这一件事</span><strong>{report.nextWeekFocus}</strong></div>
    <p className="caution">提醒：{report.caution}</p>
  </div>;
}

