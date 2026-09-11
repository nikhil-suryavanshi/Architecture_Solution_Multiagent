import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ openai: Boolean(process.env.OPENAI_API_KEY?.trim()), model: process.env.OPENAI_MODEL?.trim() || "gpt-5.6-sol" });
}
