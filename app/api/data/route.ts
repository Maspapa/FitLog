import { NextResponse } from "next/server";
import { FitDataSchema } from "@/lib/schemas";
import { deleteEntry, getFitData, replaceFitData, tokenFromRequest } from "@/lib/server-store";

export const runtime = "nodejs";

export function GET(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "设备身份无效。" }, { status: 401 });
  try { return NextResponse.json({ data: getFitData(token) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("FitLog data read failed", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ error: "读取记录失败。" }, { status: 500 }); }
}

export async function PUT(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "设备身份无效。" }, { status: 401 });
  try {
    const parsed = FitDataSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "记录格式不正确。" }, { status: 400 });
    return NextResponse.json({ data: replaceFitData(token, parsed.data) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { console.error("FitLog data write failed", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ error: "保存记录失败。" }, { status: 500 }); }
}
export function DELETE(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) return NextResponse.json({ error: "设备身份无效。" }, { status: 401 });
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "日期格式不正确。" }, { status: 400 });
  try { return NextResponse.json({ data: deleteEntry(token, date) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("FitLog data delete failed", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ error: "删除记录失败。" }, { status: 500 }); }
}