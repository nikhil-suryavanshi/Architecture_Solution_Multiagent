import { NextResponse } from "next/server";
import { approveRun } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ runId: string }> }) {
  const { runId } = await context.params;
  const run = approveRun(runId);
  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });
  if (!run.synthesis.result) return NextResponse.json({ error: "Cannot approve an incomplete synthesis" }, { status: 409 });
  return NextResponse.json(run);
}
