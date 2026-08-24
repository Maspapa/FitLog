import { NextResponse } from "next/server";
import { checkDatabase } from "@/lib/server-store";

export function GET() {
  try { return NextResponse.json({ ok: checkDatabase(), storage: "sqlite", aiConfigured: Boolean(process.env.DEEPSEEK_API_KEY) }); }
  catch { return NextResponse.json({ ok: false, storage: "unavailable", aiConfigured: Boolean(process.env.DEEPSEEK_API_KEY) }, { status: 503 }); }
}
