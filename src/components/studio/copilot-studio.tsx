"use client";

import { useEffect, useState } from "react";
import { SAMPLE_BRIEFS } from "@/lib/samples";
import type { ArchitectureBrief, OrchestrationRun } from "@/lib/types";
import { BriefForm } from "./brief-form";
import { LoadingAnalysis } from "./loading-analysis";
import { ResultWorkspace } from "./result-workspace";

const KEY_STORAGE = "arcgate-ai.openaiApiKey";
const initialBrief: ArchitectureBrief = { ...SAMPLE_BRIEFS[0] };

export function CopilotStudio() {
  const [brief, setBrief] = useState<ArchitectureBrief>(initialBrief);
  const [apiKey, setApiKey] = useState("");
  const [serverHasKey, setServerHasKey] = useState(false);
  const [run, setRun] = useState<OrchestrationRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try { setApiKey(window.localStorage.getItem(KEY_STORAGE) ?? ""); } catch { /* browser storage can be unavailable */ }
    void fetch("/api/status").then((response) => response.json()).then((payload: { openai?: boolean }) => setServerHasKey(Boolean(payload.openai))).catch(() => setServerHasKey(false));
  }, []);

  function updateApiKey(value: string) {
    setApiKey(value);
    try { if (value.trim()) window.localStorage.setItem(KEY_STORAGE, value.trim()); else window.localStorage.removeItem(KEY_STORAGE); } catch { /* ignore storage errors */ }
  }

  async function startWorkflow() {
    setLoading(true); setError(null); setRun(null);
    try {
      const response = await fetch("/api/orchestrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brief, openaiApiKey: apiKey.trim() || undefined }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to start workflow");
      setRun(payload as OrchestrationRun);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to start workflow"); }
    finally { setLoading(false); }
  }

  async function approve() {
    if (!run) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch(`/api/runs/${run.runId}/approve`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to approve package");
      setRun(payload as OrchestrationRun);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to approve package"); }
    finally { setLoading(false); }
  }

  return <main className="studio-shell">
    <header className="studio-topbar"><div className="brand"><span className="brand-mark">AG</span><div><strong>ArcGate AI</strong><small>Governed architecture studio · multi-orchestrator</small></div></div><div className="topbar-actions"><span className={`key-status ${apiKey.trim() || serverHasKey ? "ready" : ""}`}><i />{apiKey.trim() || serverHasKey ? "OpenAI ready" : "Mock mode · add a key for live generation"}</span>{run?.status === "approved" ? <a className="secondary-button" href={`/api/runs/${run.runId}/pdf`}>Download PDF</a> : null}</div></header>
    <section className="studio-hero"><div><p className="eyebrow">AI solution studio</p><h1>Shape a solution before you build it.</h1><p>Start with the outcome you need. ArcGate AI runs independent specialists in parallel, reconciles their evidence, and pauses for a human architecture decision before PDF export.</p></div><div className="flow-steps"><span className="current"><b>01</b> Define<br /><small>Intent & context</small></span><span><b>02</b> Run<br /><small>Parallel specialists</small></span><span><b>03</b> Review<br /><small>Human approval</small></span><span><b>04</b> Export<br /><small>Approved PDF</small></span></div></section>
    <div className="studio-grid">
      <aside className="brief-sidebar"><div className="panel-heading"><div className="step-number">1</div><div><strong>Your solution brief</strong><small>Give the orchestrator the right context.</small></div></div><BriefForm brief={brief} openaiApiKey={apiKey} onOpenAIApiKeyChange={updateApiKey} serverHasKey={serverHasKey} onChange={setBrief} onSubmit={() => void startWorkflow()} loading={loading} /></aside>
      <section className="results-column">
        {error ? <div className="error-panel"><strong>Could not complete the workflow</strong><p>{error}</p></div> : null}
        {loading && !run ? <LoadingAnalysis /> : run ? <><AgentReview run={run} approving={loading} onApprove={() => void approve()} /><ResultWorkspace run={run} /></> : <EmptyState onPickSample={(sample) => setBrief({ ...sample })} />}
      </section>
    </div>
    <footer>ArcGate AI · specialist outputs remain structured JSON internally; the approved user-facing artifact is a deterministic PDF.</footer>
  </main>;
}

function AgentReview({ run, approving, onApprove }: { run: OrchestrationRun; approving: boolean; onApprove: () => void }) {
  const governance = run.governance.result;
  return <article className="review-panel"><div className="review-heading"><div><p className="eyebrow">Agent handoffs</p><h2>Architecture Review Gate</h2><p className="muted-copy">Four first-wave specialists ran concurrently; the orchestrator then synthesized this package.</p></div>{governance ? <strong className="score">{Math.round(governance.score)}<small>/100</small></strong> : null}</div><div className="agent-grid">{run.waveOne.map((agent) => <div className="agent-card" key={agent.label}><span className={`agent-dot ${agent.status}`} /><div><strong>{agent.label}</strong><small>{agent.status === "completed" ? `${agent.durationMs}ms · ${agent.model} · ${agent.attempts} attempt${agent.attempts === 1 ? "" : "s"}` : agent.error || "Agent failed"}</small></div></div>)}</div>{governance ? <div className="governance-box"><div><span>Governance summary</span><p>{governance.summary}</p></div>{governance.findings.map((finding) => <div className="finding" key={finding.title}><span className={`severity ${finding.severity}`}>{finding.severity}</span><div><strong>{finding.title}</strong><p>{finding.recommendation}</p></div></div>)}</div> : null}<div className="approval-row">{run.status === "awaiting_approval" ? <><div><strong>Human approval required</strong><p>Review requirements, assumptions, diagram source, and governance findings before unlocking the artifact.</p></div><button className="primary" type="button" disabled={approving || !run.synthesis.result} onClick={onApprove}>{approving ? "Saving approval…" : "Approve & unlock PDF"}</button></> : <><div><strong className="approved-label">✓ Approved</strong><p>{run.approvedAt ? `Approved ${new Date(run.approvedAt).toLocaleString()}` : "The package is ready."}</p></div><a className="primary link-button" href={`/api/runs/${run.runId}/pdf`}>Download architecture PDF</a></>}</div></article>;
}

function EmptyState({ onPickSample }: { onPickSample: (sample: (typeof SAMPLE_BRIEFS)[number]) => void }) {
  return <div className="empty-panel"><div className="empty-icon">◎</div><p className="eyebrow">Ready when you are</p><h2>Turn a good brief into a confident first proposal.</h2><p>Add context on the left, or start with one of the sample briefs below. The approval gate stays closed until you review the result.</p><div className="starter-grid">{SAMPLE_BRIEFS.map((sample) => <button type="button" key={sample.id} onClick={() => onPickSample(sample)}><strong>{sample.label} ↗</strong><span>{sample.summary}</span></button>)}</div></div>;
}
