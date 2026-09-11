export type JsonSchema = Record<string, unknown>;

const stringArray = { type: "array", items: { type: "string" } };

export const intentJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["summary", "outcomes", "scope", "openQuestions"],
  properties: { summary: { type: "string" }, outcomes: stringArray, scope: { type: "string" }, openQuestions: stringArray },
};

export const requirementsJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["functionalRequirements", "nonFunctionalRequirements"],
  properties: {
    functionalRequirements: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "title", "description", "priority"], properties: { id: { type: "string" }, title: { type: "string" }, description: { type: "string" }, priority: { type: "string", enum: ["must", "should", "could"] } } } },
    nonFunctionalRequirements: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "category", "requirement", "target"], properties: { id: { type: "string" }, category: { type: "string" }, requirement: { type: "string" }, target: { type: "string" } } } },
  },
};

const architectureJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["overview", "style", "styleId", "styleRationale", "layers", "modules", "dataFlow", "mermaid", "techStack", "integrationPoints"],
  properties: {
    overview: { type: "string" }, style: { type: "string" }, styleId: { type: "string" }, styleRationale: { type: "string" }, dataFlow: { type: "string" }, mermaid: { type: "string" }, integrationPoints: stringArray,
    layers: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "components", "responsibilities"], properties: { name: { type: "string" }, components: stringArray, responsibilities: { type: "string" } } } },
    modules: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "layer", "responsibilities", "interfaces"], properties: { name: { type: "string" }, layer: { type: "string" }, responsibilities: { type: "string" }, interfaces: stringArray } } },
    techStack: { type: "array", items: { type: "object", additionalProperties: false, required: ["layer", "choices", "why"], properties: { layer: { type: "string" }, choices: stringArray, why: { type: "string" } } } },
  },
};

export const architectureDraftJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["proposedSolution", "applicationArchitecture", "assumptions"],
  properties: { proposedSolution: { type: "string" }, applicationArchitecture: architectureJsonSchema, assumptions: stringArray },
};

export const packageJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["title", "proposedSolution", "functionalRequirements", "nonFunctionalRequirements", "applicationArchitecture", "assumptions"],
  properties: { title: { type: "string" }, proposedSolution: { type: "string" }, functionalRequirements: requirementsJsonSchema.properties && (requirementsJsonSchema.properties as Record<string, unknown>).functionalRequirements, nonFunctionalRequirements: requirementsJsonSchema.properties && (requirementsJsonSchema.properties as Record<string, unknown>).nonFunctionalRequirements, applicationArchitecture: architectureJsonSchema, assumptions: stringArray },
};

export const governanceJsonSchema: JsonSchema = {
  type: "object", additionalProperties: false,
  required: ["score", "summary", "findings"],
  properties: {
    score: { type: "number" }, summary: { type: "string" },
    findings: { type: "array", items: { type: "object", additionalProperties: false, required: ["severity", "title", "evidence", "recommendation"], properties: { severity: { type: "string", enum: ["high", "medium", "low"] }, title: { type: "string" }, evidence: { type: "string" }, recommendation: { type: "string" } } } },
  },
};
