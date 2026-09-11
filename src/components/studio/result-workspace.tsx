"use client";

import { useState } from "react";
import type { ArchitecturePackage, OrchestrationRun } from "@/lib/types";
import { AppArchitectureView } from "./app-architecture-view";

type Tab = "architecture" | "functional" | "nonfunctional" | "assumptions";

export function ResultWorkspace({ run }: { run: OrchestrationRun }) {
  const [tab, setTab] = useState<Tab>("architecture");
  const result = run.synthesis.result;
  if (!result) return <div className="empty-panel"><strong>Synthesis did not complete.</strong><p>{run.synthesis.error || "The orchestrator could not reconcile the specialist outputs."}</p></div>;
  return <div className="result-workspace">
    <article className="proposal-card"><p className="eyebrow">Proposed application</p><h2>{result.title}</h2><p>{result.proposedSolution}</p></article>
    <div className="tab-list" role="tablist">{(["architecture", "functional", "nonfunctional", "assumptions"] as Tab[]).map((value) => <button key={value} type="button" role="tab" aria-selected={tab === value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{value === "nonfunctional" ? "Non-functional requirements" : value === "functional" ? "Functional requirements" : value[0].toUpperCase() + value.slice(1)}</button>)}</div>
    {tab === "architecture" ? <ArchitecturePanel result={result} /> : null}
    {tab === "functional" ? <RequirementList title="Functional requirements" items={result.functionalRequirements.map((item) => ({ heading: `${item.id} · ${item.title}`, body: item.description, badge: item.priority }))} /> : null}
    {tab === "nonfunctional" ? <RequirementList title="Non-functional requirements" items={result.nonFunctionalRequirements.map((item) => ({ heading: `${item.id} · ${item.category}`, body: item.requirement, badge: `Target: ${item.target}` }))} /> : null}
    {tab === "assumptions" ? <RequirementList title="Assumptions for this application" items={result.assumptions.map((item, index) => ({ heading: `Assumption ${String(index + 1).padStart(2, "0")}`, body: item }))} /> : null}
  </div>;
}

function ArchitecturePanel({ result }: { result: ArchitecturePackage }) {
  const architecture = result.applicationArchitecture;
  return <div className="architecture-panel"><article className="detail-card"><p className="eyebrow">Application architecture style</p><h3>{architecture.style}</h3><p>{architecture.styleRationale}</p><p>{architecture.overview}</p><p>{architecture.dataFlow}</p></article><article className="detail-card"><AppArchitectureView architecture={architecture} /></article><div className="detail-grid"><article className="detail-card"><h3>Technology choices</h3>{architecture.techStack.map((choice) => <div className="stack-item" key={choice.layer}><strong>{choice.layer}</strong><p>{choice.choices.join(" · ")}</p><small>{choice.why}</small></div>)}</article><article className="detail-card"><h3>Integration points</h3><ul className="plain-list">{architecture.integrationPoints.map((item) => <li key={item}>{item}</li>)}</ul></article></div><details className="mermaid-details"><summary>View source diagram</summary><pre>{architecture.mermaid}</pre></details></div>;
}

function RequirementList({ title, items }: { title: string; items: Array<{ heading: string; body: string; badge?: string }> }) {
  return <div className="requirement-list"><p className="eyebrow">{title}</p>{items.map((item) => <article className="requirement-card" key={item.heading}><div><strong>{item.heading}</strong><p>{item.body}</p></div>{item.badge ? <span>{item.badge}</span> : null}</article>)}</div>;
}
