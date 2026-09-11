import type { OrchestrationRun } from "./types";

declare global {
  // Next can evaluate route handlers as separate bundles in development. Keeping
  // the prototype registry on globalThis lets the create, approve, and PDF
  // handlers observe the same active browser-session runs.
  // eslint-disable-next-line no-var
  var __arcgateRuns: Map<string, OrchestrationRun> | undefined;
}

const runs = globalThis.__arcgateRuns ?? new Map<string, OrchestrationRun>();
globalThis.__arcgateRuns = runs;

export function saveRun(run: OrchestrationRun): OrchestrationRun {
  runs.set(run.runId, run);
  return run;
}

export function getRun(runId: string): OrchestrationRun | undefined {
  return runs.get(runId);
}

export function approveRun(runId: string): OrchestrationRun | undefined {
  const run = runs.get(runId);
  if (!run) return undefined;
  run.status = "approved";
  run.approvedAt = new Date().toISOString();
  runs.set(runId, run);
  return run;
}
