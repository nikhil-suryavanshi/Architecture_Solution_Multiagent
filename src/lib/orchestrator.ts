import { architectureAgent, governanceAgent, intentAgent, requirementsAgent, riskAgent, synthesisAgent } from "@/agents/definitions";
import { runAgent } from "@/agents/runner";
import type { ArchitectureBrief, AgentExecution, GovernanceReview, OrchestrationRun, ArchitecturePackage } from "./types";

function resultOf<T>(execution: PromiseSettledResult<AgentExecution<T>>): AgentExecution<T> {
  if (execution.status === "fulfilled") return execution.value;
  return { agent: "orchestrator", label: "Unknown agent", status: "failed", result: null, model: "unknown", durationMs: 0, attempts: 0, error: execution.reason instanceof Error ? execution.reason.message : "Agent promise failed" };
}

export async function runOrchestrator(brief: ArchitectureBrief, apiKey?: string): Promise<OrchestrationRun> {
  const waveResults = await Promise.allSettled([
    runAgent(intentAgent, { brief }, apiKey),
    runAgent(requirementsAgent, { brief }, apiKey),
    runAgent(architectureAgent, { brief }, apiKey),
    runAgent(riskAgent, { brief }, apiKey),
  ]);

  const intent = resultOf(waveResults[0] as PromiseSettledResult<AgentExecution<any>>);
  const requirements = resultOf(waveResults[1] as PromiseSettledResult<AgentExecution<any>>);
  const architecture = resultOf(waveResults[2] as PromiseSettledResult<AgentExecution<any>>);
  const risk = resultOf(waveResults[3] as PromiseSettledResult<AgentExecution<any>>);
  const source = [intent, requirements, architecture, risk].some((item) => item.model !== "mock") ? "openai" : "mock";

  const synthesis = await runAgent(synthesisAgent, { brief, intent: intent.result, requirements: requirements.result, architecture: architecture.result, risk: risk.result }, apiKey);
  const governance = synthesis.result
    ? await runAgent(governanceAgent, { brief, package: synthesis.result, risk: risk.result }, apiKey)
    : { agent: "governance" as const, label: "Governance Reviewer", status: "failed" as const, result: null as GovernanceReview | null, model: "unknown", durationMs: 0, attempts: 0, error: "Governance was blocked because synthesis failed." };

  return { runId: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "awaiting_approval", source, brief, waveOne: [intent, requirements, architecture, risk], synthesis: synthesis as AgentExecution<ArchitecturePackage>, governance: governance as AgentExecution<GovernanceReview> };
}
