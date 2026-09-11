import type { OrchestrationRun } from "./types";

const runs = new Map<string, OrchestrationRun>();

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
