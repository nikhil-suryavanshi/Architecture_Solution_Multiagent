"use client";

import { useState } from "react";
import type { ArchitectureBrief, OrchestrationRun } from "@/lib/types";

const initialBrief: ArchitectureBrief = { title: "Healthcare discovery platform", businessContext: "Create a governed application that helps healthcare teams move from a business outcome to a review-ready application architecture. The solution must expose requirements, measurable quality attributes, domain modules, integrations, governance risks, and a formal document for stakeholder approval.", industry: "Healthcare", scale: "Enterprise", constraints: ["Protect sensitive data", "Provide an auditable approval trail", "Support enterprise integrations"], existingSystems: "Identity provider, data platform, enterprise integration services", architectureStyle: "recommend" };

export default function HomePage() {
  const [brief, setBrief] = useState(initialBrief);
  const [apiKey, setApiKey] = useState("");
  const [run, setRun] = useState<OrchestrationRun | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key: keyof ArchitectureBrief, value: string) => setBrief((current) => ({ ...current, [key]: value }));

  async function startWorkflow(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setRun(null);
    try { const response = await fetch("/api/orchestrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brief, openaiApiKey: apiKey }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Unable to start workflow"); setRun(payload); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to start workflow"); }
    finally { setBusy(false); }
  }

  async function approve() {
    if (!run) return; setBusy(true); setMessage("");
    try { const response = await fetch(`/api/runs/${run.runId}/approve`, { method: "POST" }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Unable to approve package"); setRun(payload); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to approve package"); }
    finally { setBusy(false); }
  }

  return <main className="page-shell">
    <header className="topbar"><div className="brand"><span>AG</span><div><strong>ArcGate AI</strong><small>Multi-orchestrator studio</small></div></div><div className="badge">Parallel analysis · PDF output</div></header>
    <section className="hero"><div><p className="eyebrow">Architecture decision workspace</p><h1>Turn business intent into an approved architecture package.</h1><p className="hero-copy">Independent specialist agents analyze the brief in parallel. The orchestrator reconciles their outputs, governance reviews the synthesis, and a human approval gate unlocks the final PDF.</p></div><div className="hero-stat"><strong>4</strong><span>parallel first-wave agents</span><strong>1</strong><span>human approval gate</span></div></section>
    <div className="workspace">
      <form className="card form-card" onSubmit={startWorkflow}><div className="card-heading"><div><p className="eyebrow">Step 01</p><h2>Define the brief</h2></div><span className="mode">Mock mode works without a key</span></div>
        <label>Proposal title<input value={brief.title} onChange={(e) => update("title", e.target.value)} /></label>
        <label>Business context<textarea rows={7} value={brief.businessContext} onChange={(e) => update("businessContext", e.target.value)} /></label>
        <div className="two-col"><label>Industry<input value={brief.industry} onChange={(e) => update("industry", e.target.value)} /></label><label>Scale<select value={brief.scale} onChange={(e) => update("scale", e.target.value)}><option>SMB</option><option>Enterprise</option><option>Global enterprise</option></select></label></div>
        <label>Existing systems<textarea rows={3} value={brief.existingSystems} onChange={(e) => update("existingSystems", e.target.value)} /></label>
        <label>OpenAI API key <span className="optional">optional; used for this request only</span><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Uses server key when blank" /></label>
        <button className="primary" disabled={busy}>{busy ? "Running specialists…" : "Run multi-orchestrator"}</button>
      </form>
      <section className="card results-card"><div className="card-heading"><div><p className="eyebrow">Step 02</p><h2>Workflow trace</h2></div>{run && <span className={`status ${run.status}`}>{run.status.replace("_", " ")}</span>}</div>
        {!run && <div className="empty"><div className="empty-icon">◎</div><strong>Your decision package will appear here</strong><p>Run the workflow to see parallel handoffs, synthesis, governance findings, and the approval-controlled PDF action.</p></div>}
        {run && <><div className="agent-grid">{run.waveOne.map((agent) => <article className="agent" key={agent.label}><span className={`dot ${agent.status}`} /><div><strong>{agent.label}</strong><small>{agent.status === "completed" ? `${agent.durationMs}ms · ${agent.model}` : agent.error}</small></div></article>)}</div><div className="synthesis"><p className="eyebrow">Orchestrator synthesis</p><h3>{run.synthesis.result?.title || "Synthesis failed"}</h3><p>{run.synthesis.result?.proposedSolution || run.synthesis.error}</p>{run.governance.result && <div className="governance"><span>Governance score</span><strong>{Math.round(run.governance.result.score)}/100</strong><small>{run.governance.result.summary}</small></div>}</div><div className="actions">{run.status !== "approved" ? <button className="primary" onClick={approve} disabled={busy || !run.synthesis.result}>{busy ? "Saving approval…" : "Approve and unlock PDF"}</button> : <a className="primary link-button" href={`/api/runs/${run.runId}/pdf`}>Download architecture PDF</a>}<span>Run {run.runId.slice(0, 8)} · {run.source} mode</span></div></>}
        {message && <p className="error">{message}</p>}
      </section>
    </div>
    <footer>ArcGate AI · specialist outputs remain structured JSON internally; the approved user-facing artefact is a deterministic PDF.</footer>
  </main>;
}
