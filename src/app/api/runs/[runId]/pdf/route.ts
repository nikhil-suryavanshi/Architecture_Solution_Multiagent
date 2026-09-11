import { NextResponse } from "next/server";
import { createArchitecturePdf } from "@/lib/pdf";
import { getRun } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ runId: string }> }) {
  const { runId } = await context.params;
  const run = getRun(runId);
  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });
  if (run.status !== "approved") return NextResponse.json({ error: "Approve the architecture package before downloading the PDF" }, { status: 403 });
  try {
    const bytes = await createArchitecturePdf(run);
    const fileName = `${(run.synthesis.result?.title || "architecture-package").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "architecture-package"}.pdf`;
    return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${fileName}"`, "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate PDF" }, { status: 500 });
  }
}
