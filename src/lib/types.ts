import { z } from "zod";

export const architectureBriefSchema = z.object({
  title: z.string().trim().max(160).default(""),
  businessContext: z.string().trim().min(40, "Please provide at least a short business paragraph."),
  industry: z.string().trim().default("Other"),
  scale: z.string().trim().default("Enterprise"),
  constraints: z.array(z.string().trim().min(1)).max(20).default([]),
  existingSystems: z.string().trim().default(""),
  architectureStyle: z.string().trim().default("recommend"),
});

export type ArchitectureBrief = z.infer<typeof architectureBriefSchema>;

export const intentAnalysisSchema = z.object({
  summary: z.string(),
  outcomes: z.array(z.string()),
  scope: z.string(),
  openQuestions: z.array(z.string()),
});
export type IntentAnalysis = z.infer<typeof intentAnalysisSchema>;

export const functionalRequirementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["must", "should", "could"]),
});
export type FunctionalRequirement = z.infer<typeof functionalRequirementSchema>;

export const nonFunctionalRequirementSchema = z.object({
  id: z.string(),
  category: z.string(),
  requirement: z.string(),
  target: z.string(),
});
export type NonFunctionalRequirement = z.infer<typeof nonFunctionalRequirementSchema>;

export const requirementsAnalysisSchema = z.object({
  functionalRequirements: z.array(functionalRequirementSchema),
  nonFunctionalRequirements: z.array(nonFunctionalRequirementSchema),
});
export type RequirementsAnalysis = z.infer<typeof requirementsAnalysisSchema>;

const architectureLayerSchema = z.object({
  name: z.string(),
  components: z.array(z.string()),
  responsibilities: z.string(),
});

const architectureModuleSchema = z.object({
  name: z.string(),
  layer: z.enum(["presentation", "api", "domain", "data", "integration", "cross-cutting"]),
  responsibilities: z.string(),
  interfaces: z.array(z.string()),
});

const technologyChoiceSchema = z.object({
  layer: z.string(),
  choices: z.array(z.string()),
  why: z.string(),
});

export const applicationArchitectureSchema = z.object({
  overview: z.string(),
  style: z.string(),
  styleId: z.string(),
  styleRationale: z.string(),
  layers: z.array(architectureLayerSchema),
  modules: z.array(architectureModuleSchema),
  dataFlow: z.string(),
  mermaid: z.string(),
  techStack: z.array(technologyChoiceSchema),
  integrationPoints: z.array(z.string()),
});
export type ApplicationArchitecture = z.infer<typeof applicationArchitectureSchema>;

export const architectureDraftSchema = z.object({
  proposedSolution: z.string(),
  applicationArchitecture: applicationArchitectureSchema,
  assumptions: z.array(z.string()),
});
export type ArchitectureDraft = z.infer<typeof architectureDraftSchema>;

export const architecturePackageSchema = z.object({
  title: z.string(),
  proposedSolution: z.string(),
  functionalRequirements: z.array(functionalRequirementSchema),
  nonFunctionalRequirements: z.array(nonFunctionalRequirementSchema),
  applicationArchitecture: applicationArchitectureSchema,
  assumptions: z.array(z.string()),
});
export type ArchitecturePackage = z.infer<typeof architecturePackageSchema>;

export const governanceFindingSchema = z.object({
  severity: z.enum(["high", "medium", "low"]),
  title: z.string(),
  evidence: z.string(),
  recommendation: z.string(),
});

export const governanceReviewSchema = z.object({
  score: z.number(),
  summary: z.string(),
  findings: z.array(governanceFindingSchema),
});
export type GovernanceReview = z.infer<typeof governanceReviewSchema>;

export type AgentName = "intent" | "requirements" | "architecture" | "risk" | "governance";
export type AgentStatus = "completed" | "failed";

export type AgentExecution<T> = {
  agent: AgentName | "orchestrator";
  label: string;
  status: AgentStatus;
  result: T | null;
  model: string;
  durationMs: number;
  attempts: number;
  error?: string;
};

export type OrchestrationRun = {
  runId: string;
  createdAt: string;
  status: "awaiting_approval" | "approved";
  source: "openai" | "mock";
  brief: ArchitectureBrief;
  waveOne: AgentExecution<unknown>[];
  synthesis: AgentExecution<ArchitecturePackage>;
  governance: AgentExecution<GovernanceReview>;
  approvedAt?: string;
};
