import type { DailyLog, Goal } from "./schemas";

const GOALS: Record<Goal, string> = { fat_loss: "减脂", muscle_gain: "增肌", maintenance: "保持体型", performance: "提升运动表现" };

export function buildCoachPrompt(goal: Goal, logs: DailyLog[]): string {
  const compact = logs.map((log) => ({
    date: log.date, weight: log.weight, waist: log.waist,
    workouts: log.workouts.map(({ name, category, sets, reps, weight, duration, intensity }) => ({ name, category, sets, reps, weight, duration, intensity })),
    meals: log.meals, sleepHours: log.sleepHours,
    fatigue: log.fatigue, mood: log.mood, soreness: log.soreness,
    steps: log.steps, waterGlasses: log.waterGlasses, alcohol: log.alcohol, notes: log.notes,
  }));
  return `你是一位谨慎、务实的健身习惯教练。用户目标是：${GOALS[goal]}。
分析下面最近最多14天的记录，并输出简体中文 JSON。

${JSON.stringify(compact)}

规则：
1. 不诊断疾病，不提供极端节食或惩罚性训练建议；出现持续疼痛、明显异常或危险信号时建议停止相关训练并咨询专业人士。
2. 用户刻意只记录“吃了什么”。不要猜测卡路里、份量、克数、烹饪方式，也不要建议用户补记这些信息。只评价文字中明确出现的食物种类：蛋白质来源、蔬果、主食、饮料、零食、酒精和规律性。
3. 某餐有食物文字时，就把它视为该餐已完成有效记录，不能因为没有份量而称其“不完整”。只有餐次文本为空时才能说该餐未记录；未记录不等于没吃。
4. 声称某类食物“没有出现”之前，必须逐字检查所有餐次。青菜、番茄、黄瓜、西兰花、白菜、菠菜等均属于蔬菜；鸡蛋、牛奶、鸡肉、牛肉、鱼、虾和豆制品等均属于蛋白质来源。记录中出现任一对应食物，就禁止声称该类别缺失。
5. 体重主要看多日趋势，不评价单日波动；腰围记录少时明确说明证据不足。
6. 每个判断引用具体日期、次数或记录作为证据，不做空泛鼓励；证据不足就直接说明，不要推测“不足”。
7. 下周只给一个最值得执行的重点，要求足够小、可以衡量。不要为了填充内容而把“多记录一个字段”当成健身建议。
8. 只输出包含 headline、summary、wins、patterns、nextWeekFocus、caution 的 JSON 对象。patterns 每项包含 title、evidence、suggestion。`;
}
