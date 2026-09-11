import { NextResponse } from "next/server";
import { runOrchestrator } from "@/lib/orchestrator";
import { saveRun } from "@/lib/store";
import { architectureBriefSchema } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 240;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { brief?: unknown; openaiApiKey?: unknown };
    const parsed = architectureBriefSchema.safeParse(body.brief);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid architecture brief" }, { status: 400 });
    const apiKey = typeof body.openaiApiKey === "string" ? body.openaiApiKey.trim() : process.env.OPENAI_API_KEY?.trim();
    const run = saveRun(await runOrchestrator(parsed.data, apiKey));
    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to run the orchestrator" }, { status: 500 });
  }
}
