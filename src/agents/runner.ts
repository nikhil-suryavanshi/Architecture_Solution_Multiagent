import "server-only";

import OpenAI from "openai";
import type { ZodType } from "zod";
import type { AgentExecution, AgentName } from "@/lib/types";
import type { JsonSchema } from "./schemas";

export type AgentDefinition<T> = {
  agent: AgentName | "orchestrator";
  label: string;
  prompt: string;
  jsonSchema: JsonSchema;
  validator: ZodType<T>;
  mock: (input: any) => T;
  maxOutputTokens?: number;
  reasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh";
};

const defaultModel = process.env.OPENAI_MODEL?.trim() || "gpt-5.6-sol";

function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

async function invokeOpenAI<T>(client: OpenAI, definition: AgentDefinition<T>, input: unknown): Promise<T> {
  const response = await client.responses.create({
    model: defaultModel,
    instructions: definition.prompt,
    input: JSON.stringify(input),
    reasoning: { effort: definition.reasoningEffort || "medium" },
    max_output_tokens: definition.maxOutputTokens || 2600,
    store: false,
    text: { format: { type: "json_schema", name: `${definition.agent}_output`, strict: true, schema: definition.jsonSchema } },
  } as any);
  if (!response.output_text?.trim()) throw new Error(`${definition.label} returned an empty response.`);
  return definition.validator.parse(parseJson(response.output_text));
}

export async function runAgent<T>(definition: AgentDefinition<T>, input: unknown, apiKey?: string): Promise<AgentExecution<T>> {
  const started = Date.now();
  const attemptsAllowed = apiKey ? 2 : 1;
  let lastError = "Unknown agent error";

  for (let attempt = 1; attempt <= attemptsAllowed; attempt += 1) {
    try {
      const result = apiKey
        ? await invokeOpenAI(new OpenAI({ apiKey, maxRetries: 0, timeout: 80_000 }), definition, input)
        : definition.mock(input);
      return { agent: definition.agent, label: definition.label, status: "completed", result, model: apiKey ? defaultModel : "mock", durationMs: Date.now() - started, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Agent execution failed";
    }
  }

  return { agent: definition.agent, label: definition.label, status: "failed", result: null, model: apiKey ? defaultModel : "mock", durationMs: Date.now() - started, attempts: attemptsAllowed, error: lastError };
}
