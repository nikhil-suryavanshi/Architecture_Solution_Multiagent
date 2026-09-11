import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { OrchestrationRun } from "./types";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    lines.push(line);
  }
  return lines.length ? lines : [""];
}

export async function createArchitecturePdf(run: OrchestrationRun): Promise<Uint8Array> {
  if (!run.synthesis.result) throw new Error("Cannot create a PDF without a synthesized package.");
  const pdf = await PDFDocument.create();
  pdf.setTitle(run.synthesis.result.title);
  pdf.setAuthor("ArcGate AI");
  pdf.setSubject("Approved application architecture package");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  let page: PDFPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const nextPage = () => { page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]); y = PAGE_HEIGHT - MARGIN; };
  const ensure = (height: number) => { if (y - height < MARGIN) nextPage(); };
  const text = (value: string, size = 10, font = regular, color = rgb(0.12, 0.17, 0.23), gap = 4) => {
    for (const line of wrap(value, font, size, PAGE_WIDTH - MARGIN * 2)) {
      ensure(size + gap);
      page.drawText(line, { x: MARGIN, y: y - size, size, font, color });
      y -= size + gap;
    }
  };
  const heading = (value: string, size = 16) => { ensure(size + 18); page.drawText(value, { x: MARGIN, y: y - size, size, font: bold, color: rgb(0.05, 0.33, 0.38) }); y -= size + 12; };
  const line = () => { ensure(14); page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: rgb(0.82, 0.87, 0.9) }); y -= 14; };
  const bulletList = (items: string[]) => items.forEach((item) => text(`• ${item}`, 10, regular, rgb(0.16, 0.2, 0.25), 3));

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 135, width: PAGE_WIDTH, height: 135, color: rgb(0.04, 0.12, 0.2) });
  page.drawText("ARCGATE AI", { x: MARGIN, y: PAGE_HEIGHT - 58, size: 12, font: bold, color: rgb(0.3, 0.92, 0.75) });
  page.drawText(run.synthesis.result.title, { x: MARGIN, y: PAGE_HEIGHT - 93, size: 24, font: bold, color: rgb(1, 1, 1), maxWidth: PAGE_WIDTH - MARGIN * 2 });
  y = PAGE_HEIGHT - 170;
  text("Approved application architecture package", 11, bold, rgb(0.05, 0.33, 0.38));
  text(`Run ID: ${run.runId}`);
  text(`Generated: ${new Date(run.createdAt).toLocaleString("en-IN")}`);
  text(`Approval status: ${run.status === "approved" ? `Approved on ${new Date(run.approvedAt || run.createdAt).toLocaleString("en-IN")}` : "Awaiting approval"}`);
  line();

  heading("1. Executive summary");
  text(run.synthesis.result.proposedSolution, 11);
  heading("2. Business intent");
  text(run.brief.businessContext, 10);
  heading("3. Functional requirements");
  run.synthesis.result.functionalRequirements.forEach((item) => text(`${item.id} [${item.priority.toUpperCase()}] — ${item.title}: ${item.description}`, 10));
  heading("4. Non-functional requirements");
  run.synthesis.result.nonFunctionalRequirements.forEach((item) => text(`${item.id} — ${item.category}: ${item.requirement} Target: ${item.target}`, 10));
  heading("5. Application architecture");
  text(run.synthesis.result.applicationArchitecture.overview, 10);
  text(`Style: ${run.synthesis.result.applicationArchitecture.style} (${run.synthesis.result.applicationArchitecture.styleId})`, 10, bold);
  text(run.synthesis.result.applicationArchitecture.styleRationale, 10);
  heading("Architecture layers", 13);
  run.synthesis.result.applicationArchitecture.layers.forEach((layer) => { text(layer.name, 11, bold, rgb(0.05, 0.33, 0.38)); bulletList(layer.components); text(layer.responsibilities, 9); });
  heading("Modules", 13);
  run.synthesis.result.applicationArchitecture.modules.forEach((module) => text(`${module.name} (${module.layer}) — ${module.responsibilities} Interfaces: ${module.interfaces.join(", ")}`, 9));
  heading("Technology choices", 13);
  run.synthesis.result.applicationArchitecture.techStack.forEach((item) => text(`${item.layer}: ${item.choices.join(", ")} — ${item.why}`, 9));
  heading("Integration points", 13);
  bulletList(run.synthesis.result.applicationArchitecture.integrationPoints);
  heading("Primary data flow", 13);
  text(run.synthesis.result.applicationArchitecture.dataFlow);
  heading("Mermaid source", 13);
  text(run.synthesis.result.applicationArchitecture.mermaid, 8, mono, rgb(0.2, 0.25, 0.3), 2);
  heading("6. Governance review");
  if (run.governance.result) { text(`Score: ${Math.round(run.governance.result.score)}/100`, 13, bold, rgb(0.05, 0.33, 0.38)); text(run.governance.result.summary); run.governance.result.findings.forEach((finding) => text(`${finding.severity.toUpperCase()} — ${finding.title}: ${finding.evidence} Recommendation: ${finding.recommendation}`, 9)); }
  else text("Governance review was not completed.");
  heading("7. Assumptions");
  bulletList(run.synthesis.result.assumptions);
  page.drawText("Generated by ArcGate AI multi-orchestrator", { x: MARGIN, y: 24, size: 8, font: regular, color: rgb(0.4, 0.45, 0.5) });
  return pdf.save();
}
