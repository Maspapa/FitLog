import { NextResponse } from "next/server";
import { AiReportSchema } from "@/lib/schemas";
import { buildCoachPrompt } from "@/lib/ai";
import { getFitData, tokenFromRequest } from "@/lib/server-store";

export const runtime = "nodejs";
export const maxDuration = 55;

const attempts = new Map<string, number[]>();

function allowed(ip: string): boolean {
  const now = Date.now(); const cutoff = now - 60 * 60 * 1000;
  const active = (attempts.get(ip) || []).filter((time) => time > cutoff);
  if (active.length >= 10) return false;
  active.push(now); attempts.set(ip, active); return true;
}

export async function POST(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "设备身份无效。" }, { status: 401 });
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!allowed(ip)) return NextResponse.json({ error: "本小时 AI 周报次数已用完，请稍后再试。" }, { status: 429 });
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI 服务尚未配置。" }, { status: 503 });

  const data = getFitData(token);
  const logs = [...data.logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14).reverse();
  if (!logs.length) return NextResponse.json({ error: "至少需要一条有效记录。" }, { status: 400 });

  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 50_000);
  try {
    const response = await fetch(`${(process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
        messages: [{ role: "user", content: buildCoachPrompt(data.profile.goal, logs) }],
        response_format: { type: "json_object" }, thinking: { type: "disabled" }, temperature: 0.2, max_tokens: 2200,
      }), signal: controller.signal,
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      console.error("DeepSeek coach request failed", response.status);
      return NextResponse.json({ error: response.status === 429 ? "AI 服务繁忙，请稍后重试。" : "AI 周报暂时不可用。" }, { status: response.status === 429 ? 429 : 502 });
    }
    const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw new Error("empty AI response");
    const report = AiReportSchema.parse(JSON.parse(content));
    return NextResponse.json({ report }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Coach report failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: error instanceof Error && error.name === "AbortError" ? "AI 周报生成超时。" : "AI 周报格式异常，请重试。" }, { status: 502 });
  } finally { clearTimeout(timer); }
}
